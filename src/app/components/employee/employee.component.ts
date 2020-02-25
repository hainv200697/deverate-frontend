import { Component, OnInit } from '@angular/core';
import { EmployeeApiService } from 'src/app/services/employee-api.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as XLSX from 'ts-xlsx';
import Stepper from 'bs-stepper';
import { GloblaService } from 'src/assets/service/global.service';
import { empty } from 'rxjs';
import * as moment from 'moment';
@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
    constructor(
        private employeeService: EmployeeApiService,
        private activeRoute: ActivatedRoute,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private globalservice: GloblaService
    ) { }
    public loading = false;
    iconIsActive = true;
    private stepper: Stepper;
    companyId = Number(localStorage.getItem('CompanyId'));
    // Excel
    index = 1;
    checkExcel = true;
    searchText = '';
    checkFile = false;
    arrayBuffer: any;
    file: File;
    listDataExcel = [];
    selectedAll: any;
    employeeList = [];
    insEmployee = {};
    employees = [];
    listUser: String[] = [];
    updRole = {};
    getRole = 0;
    message: Array<string> = [];
    ngOnInit() {
        this.getEmployee();
    }
    async next() {
        this.employees = [];
        this.message = [];
        await this.formatExcel();
        if (this.checkExcel == true) {
            this.index = 2;
            this.stepper.next();
        } else {
            this.toastr.error("File is wrong format");
        }
    }
    back() {
        this.index = 1;
        this.employees = [];
        this.stepper.previous();
    }
    // Excel
    incomingfile(event) {
        this.message = null;
        this.file = event.target.files[0];
        if (this.file != null && this.file != undefined) {
            var name = this.file.name.split('.');
            let type = name[name.length - 1] + "";
            if (type != 'xlsx') {
                this.checkFile = false;
                this.toastr.error('File must be excel file');
                this.file = null;
                return;
            }
            if (this.file.size > 200000) {
                this.checkFile = false;
                this.toastr.error('File must be smaller than 20MB');
                this.file = null;
                return;
            }
            this.checkFile = true;
        }
    }

    readExcel() {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.arrayBuffer = fileReader.result;
                let data = new Uint8Array(this.arrayBuffer);
                let arr = new Array();
                for (let i = 0; i != data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
                const bstr = arr.join('');
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const first_sheet_name = workbook.SheetNames[1];
                const worksheet = workbook.Sheets[first_sheet_name];
                this.listDataExcel = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                resolve(this.listDataExcel);
            };
            fileReader.readAsArrayBuffer(this.file);
        });
    }

    async formatExcel() {
        try {
            let list: any;
            this.employees = [];
            this.message = [];
            list = await this.readExcel();
            this.checkExcel = true;
            // const regex = this.globalservice.checkPhoneVn;
            list.forEach((element, index) => {
                this.insEmployee = {};
                index = index + 2;
                const phone = element.Phone;
                // let checkPhone = regex.test(String(phone));
                let checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(phone);
                if (element.Fullname == null ||
                    element.Fullname == undefined) {
                    this.message.push("Full name at # " + index + " is blank");
                    this.checkExcel = false;
                } else if (element.Fullname.length < 5 ||
                    element.Fullname.length > 200) {
                    this.message.push("Full name at #" + index + " must be in range from 5 to 200 letters");
                    this.checkExcel = false;
                }
                if (element.Address != null || element.Address != undefined) {
                    if (element.Address.length < 5 ||
                        element.Address.length > 200) {
                        this.message.push("Address at #" + index + " must be in range from 5 to 200 letters");
                        this.checkExcel = false;
                    }
                }
                if (element.Phone != null || element.Phone != undefined) {
                    if (!checkPhone) {
                        this.message.push("Phone at #" + index + " is invalid!");
                        this.checkExcel = false;
                    }
                }
                if (element.Email == null ||
                    element.Email == undefined) {
                    this.message.push("Email at #" + index + " is blank!");
                    this.checkExcel = false;
                } else if (element.Email.length < 5) {
                    this.message.push("Length of email at #" + index + " is more than 5");
                    this.checkExcel = false;
                } if (element.Email.length > 200) {
                    this.message.push("Length of email at #" + index + " is less than 200");
                    this.checkExcel = false;
                }
                else if (!this.globalservice.checkMail.test(String(element.Email).toUpperCase())) {
                    this.message.push("Email at #" + index + " is invalid");
                    this.checkExcel = false;
                }
                if (element.Role !== 'Employee' && element.Role !== 'Test Owner') {
                    this.message.push("Role of email " + element.Email + " is invalid");
                    this.checkExcel = false;
                } else if (element.Role == null || element.Role == undefined) {
                    element.role = null;
                    this.message.push("Role of email " + element.Email + " is blank!");
                    this.checkExcel = false;
                }else if (element.Role == "Company Manager") {
                    element.Role = 2;
                }else if (element.Role == "Employee") {
                    element.Role = 3;
                } else if (element.Role == "Test Owner") {
                    element.Role = 4;
                }
                if (element.Gender !== 'Male' && element.Gender !== 'Female') {
                    this.message.push("Gender of account at #" + index + " is invalid!");
                    this.checkExcel = false;
                } else if (element.Gender == null || element.Gender == undefined) {
                    element.Gender = null;
                    this.message.push("Gender of account at #" + index + " is blank!!");
                    this.checkExcel = false;
                } else if (element.Gender == "Male") {
                    element.Gender = true;
                } else if (element.Gender == "Female") {
                    element.Gender = false;
                }
                this.insEmployee['companyId'] = this.companyId;
                this.insEmployee['fullname'] = $.trim(element.Fullname.replace(/\s\s+/g, ' ')).toUpperCase();
                this.insEmployee['email'] = $.trim(element.Email.replace(/\s\s+/g, ' '));
                this.insEmployee['role'] = element.Role;
                this.insEmployee['gender'] = element.Gender;
                this.insEmployee['phone'] = $.trim(phone.replace(/\s\s+/g, ' '));
                this.insEmployee['address'] = $.trim(element.Address.replace(/\s\s+/g, ' '));
                this.employeeList.forEach(element => {
                    if (this.insEmployee['email'] === element.email) {
                        this.message.push("Email at #" + index + " is existed");
                        this.checkExcel = false;
                    }
                });
                this.employees.push(this.insEmployee);
            });

            let listEmail = [];
            let existedEmail: String[] = [];
            var valueArr = this.employees.map(function (item) {
                var existItem = listEmail.some(email => email == item.email);
                if (existItem) {
                    existedEmail.push(item.email);
                }
                else {
                    listEmail.push(item.email);
                }
            });

            if (existedEmail.length > 0) {
                const email = existedEmail.slice(0, 3);
                const message = `Email ${email.join(',')}${existedEmail.length > 3 ? ',...' : ''} duplicate`;
                this.message.push(message);
                this.checkExcel = false;
            }

        } catch (err) {
            this.toastr.error(err);
        }

    }

    clickButtonRefresh() {
        this.getEmployee();
    }


    getEmployee() {
        this.loading = true;
        this.employeeService.getAllWithRole(this.companyId, this.getRole).subscribe(
            (data) => {
                this.loading = false;
                data.forEach(element => {
                    element['joinDate'] = moment.utc(element['joinDate']).local().format();
                });
                data.forEach(element => {
                    element.selected = false;
                    if(element.roleId == 2){
                        element.roleName = "Company Manager"
                    }else if(element.roleId == 3){
                        element.roleName = "Employee"
                    }
                    else{
                        element.roleName = "Test Owner"
                    }
                });
                this.employeeList = data;
                this.insEmployee = {};
                this.selectedAll = false;
            }, (error) => {
                if (error.status == 500) {
                    this.toastr.error('System error')
                }else if (error.status == 400) {
                    this.toastr.error("Input is invalid");
                }else if (error.status == 0) {
                    this.toastr.error('System is not available')
                }
                this.loading = false;
            }
        );
    }

    // modal
    // insert
    open(create) {
        this.insEmployee['role'] = 2;
        this.insEmployee['gender'] = true;
        this.modalService.open(create, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
    }

    openModalExcel(excel) {
        this.index = 1;
        this.employees = [];
        this.checkFile = false;
        this.message = [];
        this.modalService.open(excel, { size: 'lg', backdrop: 'static', windowClass: 'myCustomModalClass' });
        const a = document.querySelector('#stepper1');
        this.stepper = new Stepper(a, {
            linear: false,
            animation: true
        });
    }

    // close modal
    closeModal() {
        this.employees = [];
        this.modalService.dismissAll();

    }


    // submit
    // insert submit
    insertEmployeeSubmit(key) {
        if (key === 'excel') {
            this.insertEmployeeExcel();
        } else {
            this.employees = [];
            this.insEmployee['companyId'] = this.companyId;
            this.employees.push(this.insEmployee);
            let check = true;
            if (!this.validate()) {
                check = false;
            }
            if (!this.validateAddress()) {
                check = false;
            }
            if (!this.validateEmail()) {
                check = false;
            }
            if (!this.validatePhone()) {
                check = false;
            }
            if (check == true) {
                this.insertEmployee();
            }

        }
    }

    insertEmployeeExcel() {
        this.insertEmployee();
    }

    // function 
    // insert Employee function
    insertEmployee() {
        this.loading = true;
        this.employeeService.postCreateEmployee(this.employees).subscribe(
            results => {
                this.loading = false;
                this.toastr.success("Create success");
                this.employees = [];

                this.insEmployee = {};
                this.getEmployee();
                this.closeModal();
            },
            (error) => {
                this.loading = false;
                if (error.status == 0) {
                    this.toastr.error("System is not available");
                }else if (error.status == 400) {
                    this.toastr.error("Input is invalid");
                }else if (error.status == 500) {
                    this.toastr.error("System error");
                } else {
                    this.loading = false;
                    const email = error.error.slice(0, 3);
                    const message = `Email ${email.join(',')}${error.error.length > 3 ? ',...' : ''} existed`;
                    this.toastr.error(message);
                }
            }
        );
    }


    // change status
    clickButtonChangeStatus(status: boolean) {
        if (this.listUser.length > 0) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Status will be change!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    this.loading = true;
                    this.employeeService.disableEmployee(this.listUser, status).subscribe(data => {
                        this.loading = false;
                        this.selectedAll = false;
                        this.getEmployee();
                        this.closeModal();
                        this.listUser = [];
                        Swal.fire('Success', 'The status has been change', 'success');
                    }, (error) => {
                        this.listUser = [];
                        if (error.status == 500) {
                            this.toastr.error('System error')
                        }
                        if (error.status == 400) {
                            this.toastr.error("Input is invalid");
                        }
                        if (error.status == 0) {
                            this.toastr.error('System is not available')
                        }
                        this.loading = false;
                    }
                    );
                }
            })
        } else {
            this.listUser = [];
            Swal.fire(
                'Cancelled',
                'Please choose employee!',
                'error'
            )
        }
    }

    // send pass
    resendmail() {
        if (this.listUser.length > 0) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Password will be send!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, send it!',
                cancelButtonText: 'No, Do not send it'
            }).then((result) => {
                if (result.value) {
                    this.employeeService.resendpassword(this.listUser, this.companyId).subscribe(data => {
                        this.getEmployee();
                        this.selectedAll = false;
                        this.closeModal();
                        Swal.fire({ title: 'Success', text: "Password was send to your email!", type: 'success' });
                        this.listUser = [];
                    }, error => {
                        this.listUser = [];
                        if (error.status == 400) {
                            const account = error.error.slice(0, 3);
                            const message = `Account ${account.join(',')}${error.error.length > 3 ? ',...' : ''} existed`;
                            Swal.fire({
                                title: 'Cancelled',
                                text: message,
                                type: 'error'
                            });
                        }
                        if (error.status == 500) {
                            Swal.fire({
                                title: 'Cancelled',
                                text: "System error",
                                type: 'error'
                            });
                        }
                        this.loading = false;
                    }

                    );;
                }
            })
        } else {
            this.listUser = [];
            Swal.fire(
                'Cancelled',
                'Please choose employee!',
                'error'
            )
        }
    }

    // select employee
    selectAll() {
        if(this.selectedAll){
            this.employeeList.forEach(e=>{
                e.selected = true;
                this.listUser.push(e.username);
            });
        }
        else{
            this.employeeList.forEach(e=>{
                e.selected = false;
            });
            this.listUser = [];
        }
    }

    checkSelected(username) {
        var index = this.employeeList.findIndex(x => x.username == username);
        this.employeeList[index].selected = !this.employeeList[index].selected;
        if(this.employeeList[index].selected == false){
            this.listUser.splice( this.listUser.indexOf(username), 1 );
            this.selectedAll = false;
        }else{
            this.listUser.push(username);
            if(this.listUser.length == this.employeeList.length){
                this.selectedAll = true;
            }
        }
    }
    validate() {
        let fullname = this.insEmployee['fullname'];
        if (fullname == '' || fullname == null) {
            this.toastr.error('Please input employee name');
            document.getElementById('ins_manage_fullname').style.borderColor = 'red';
            document.getElementById('ins_manage_fullname').focus();
            return false;
        } else if (fullname.length < 3) {
            this.toastr.error('Please input employee name min 3 letter');
            document.getElementById('ins_manage_fullname').style.borderColor = 'red';
            document.getElementById('ins_manage_fullname').focus();
            return false;
        } else {
            fullname = $.trim(this.insEmployee['fullname'].replace(/\s\s+/g, ' ')).toUpperCase();
            document.getElementById('ins_manage_fullname').style.borderColor = 'green';
        }
        const str = fullname.split(" ");
        if(str.length < 2){
            this.toastr.error('Employee\'s name min 2 words');
            document.getElementById('ins_manage_fullname').style.borderColor = 'red';
            document.getElementById('ins_manage_fullname').focus();
            return false;
        }
        this.insEmployee['fullname'] = fullname;
        return true;
    }

    updateRank(item) {
        this.loading = true;
        this.updRole['accountId'] = item.accountId;
        this.updRole['roleId'] = item.roleId;
        this.employeeService.putUpdateAccount(this.updRole).subscribe(
            results => {
                this.loading = false;
                this.toastr.success("Update success");
                this.updRole = {};
                this.getEmployee();
            },
            (error) => {
                this.loading = false;
                this.toastr.error(error);
            }
        );
    }

    validateAddress() {
        let address = this.insEmployee['address'];
        if (address != undefined) {
            if (address != '') {
                if (address.length < 3) {
                    this.toastr.error('Please input employee address min 3 characters');
                    document.getElementById('ins_manage_address').style.borderColor = 'red';
                    document.getElementById('ins_manage_address').focus();
                    return false;
                }
                else if (address.length > 200) {
                    this.toastr.error('Please input employee Employee address max 200 characters');
                    document.getElementById('ins_manage_address').style.borderColor = 'red';
                    document.getElementById('ins_manage_address').focus();
                    return false;
                } else {
                    address = $.trim(this.insEmployee['address'].replace(/\s\s+/g, ' '))
                    document.getElementById('ins_manage_address').style.borderColor = 'green';
                }
            }
        }
        this.insEmployee['address'] = address;
        return true;
    }
    validatePhone() {
        const check = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.insEmployee['phone']);
        if (this.insEmployee['phone'] != undefined) {
            if (this.insEmployee['phone'] != '') {
                if (!check) {
                    this.toastr.error('Phone number is invalid');
                    document.getElementById('ins_manage_phone').style.borderColor = 'red';
                    document.getElementById('ins_manage_phone').focus();
                    return false;
                } else {
                    document.getElementById('ins_manage_phone').style.borderColor = 'green';
                }
            }
        }
        return true;
    }

    downloadTemplate() {
        let link = document.createElement("a");
        link.download = "Emplyee_Template";
        link.href = "/assets/file/employee.xlsx";
        link.click();
    }

    validateEmail() {
        let email = this.insEmployee['email'];
        if (email == '' || email == null || email == undefined) {
            this.toastr.error('Email can not blank');
            document.getElementById('ins_manage_email').style.borderColor = 'red';
            document.getElementById('ins_manage_email').focus();
            return false;
        } else if (!this.globalservice.checkMail.test(String(email).toUpperCase())) {
            this.toastr.error('Email wrong format');
            document.getElementById('ins_manage_email').style.borderColor = 'red';
            document.getElementById('ins_manage_email').focus();
            return false;
        } else {
            let checkDup = false;
            this.employeeList.forEach(element => {
                if (email === element.email) {
                    this.toastr.error('Email is existed');
                    document.getElementById('ins_manage_email').style.borderColor = 'red';
                    document.getElementById('ins_manage_email').focus();
                    return checkDup = true;
                }
            });
            if (!checkDup) {
                email = $.trim(this.insEmployee['email'].replace(/\s\s+/g, ' '));
                document.getElementById('ins_manage_email').style.borderColor = 'green';
            }
        }
        this.insEmployee['email'] = email;
        return true;
    }
}
