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
    selected = false;
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
    updateEmployee = [];
    listUser: String[] = [];
    listId: number[] = [];
    updRole = {};
    getRole = 0;
    message: Array<string> = [];
    ngOnInit() {
        this.getEmployee(this.iconIsActive);

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
                const first_sheet_name = workbook.SheetNames[0];
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
                    this.message.push("Full name at # " + index + " is invalid");
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
                } else if (element.Role == "Employee") {
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
                let checkDup = false;
                

                this.insEmployee['companyId'] = this.companyId;
                this.insEmployee['fullname'] = element.Fullname.trim();
                this.insEmployee['email'] = element.Email.trim();
                this.insEmployee['fullname'] = element.Fullname.trim();
                this.insEmployee['role'] = element.Role;
                this.insEmployee['gender'] = element.Gender;
                this.insEmployee['phone'] = phone.trim();
                this.insEmployee['address'] = element.Address.trim();
                this.employeeList.forEach(element => {
                    if (this.insEmployee['email'] === element.email) {
                        this.message.push("Email at #"+ index+" is existed");
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
        this.getEmployee(this.iconIsActive);
    }

    getEmployee(status) {
        this.getRole = 0;
        this.iconIsActive = status;
        this.loading = true;
        this.employeeService.getAllEmployee(this.companyId, this.iconIsActive).subscribe(
            (data) => {
                this.loading = false;
                this.employeeList = data;
                this.insEmployee = {};
                this.insEmployee['role'] = 0;
                this.insEmployee['gender'] = -1;
                this.selected = false;
                this.selectedAll = false;
            }, (error) => {
                if (error.status == 500) {
                    this.loading = false;
                    this.toastr.error("System error");
                    this.closeModal();
                }
            }
        );
    }

    // modal
    // insert
    open(create) {
        this.modalService.open(create, { ariaLabelledBy: 'modal-basic-title' });
    }

    openModalExcel(excel) {
        this.index = 1;
        this.employees = [];
        this.checkFile = false;
        this.message = [];
        this.modalService.open(excel, { size: 'lg', windowClass: 'myCustomModalClass' });
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
            this.insEmployee['fullname'] = this.insEmployee['fullname'];
            this.insEmployee['companyId'] = this.companyId;
            this.employees.push(this.insEmployee);
            let check = true;
            if (!this.validate()) {
                check = false;
            }
            if(!this.validateRole()){
                check = false;
            }
            if(!this.validateAddress()){
                check = false;
            }
            if(!this.validateGender()){
                check = false;
            }
            if(!this.validateRole()){
                check = false;
            }
            if(!this.validateEmail()){
                check = false;
            }
            if(!this.validatePhone()){
                check = false;
            }
            if(check == true){
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
                this.getEmployee(this.iconIsActive);
                this.closeModal();
            },
            (error) => {
                if (error.status == 500) {
                    this.toastr.error("System error");
                    this.closeModal();
                } else {
                    this.loading = false;
                    const email = error.error.slice(0, 3);
                    const message = `Email ${email.join(',')}${error.error.length > 3 ? ',...' : ''} existed`;
                    this.toastr.error(message);
                    this.closeModal();
                }
            }
        );
    }


    // change status
    clickButtonChangeStatus(status: boolean) {
        if (this.selectedAll == true || this.selected == true) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Status will be change!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    for (let i = 0; i < this.updateEmployee.length; i++) {
                        this.listId.push(this.updateEmployee[i].accountId)
                    }
                    this.loading = true;
                    this.employeeService.disableEmployee(this.listId, status).subscribe(data => {
                        this.loading = false;
                        this.selectedAll = false;
                        this.getEmployee(this.iconIsActive);
                        this.closeModal();
                        Swal.fire('Success', 'The status has been change', 'success');
                    }, (error) => {
                        if (error.status == 500) {
                            this.toastr.error('System error')
                        }
                        if (error.status == 0) {
                            this.toastr.error('Connection error')
                        }
                        this.loading = false;
                    }
                    );
                }
            })
        } else {
            this.updateEmployee = [];
            Swal.fire(
                'Cancelled',
                'Please choose employee!',
                'error'
            )
        }
    }

    // send pass
    resendmail() {
        if (this.selectedAll == true || this.selected == true) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Password will be send!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, send it!',
                cancelButtonText: 'No, Do not send it'
            }).then((result) => {
                if (result.value) {
                    this.updateEmployee.forEach(element => {
                        this.listUser.push(element.username);
                    });
                    this.employeeService.resendpassword(this.listUser, this.companyId).subscribe(data => {
                        this.getEmployee(this.iconIsActive);
                        this.selectedAll = false;
                        this.closeModal();
                        Swal.fire({ title: 'Success', text: "Password was send to your email!", type: 'success' });
                        this.listUser = [];
                    }, error => {
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
            this.updateEmployee = [];
            Swal.fire(
                'Cancelled',
                'Please choose employee!',
                'error'
            )
        }
    }

    // select employee
    selectAll() {
        this.updateEmployee = [];
        for (let i = 0; i < this.employeeList.length; i++) {
            this.employeeList[i].selected = this.selectedAll;
            this.employeeList[i].companyId = this.companyId;
            this.updateEmployee.push(this.employeeList[i]);
        }
    }

    checkIfAllSelected() {
        this.updateEmployee = [];
        this.selected = false;
        this.selectedAll = this.employeeList.every(function (item: any) {
            return item.selected === true;
        });
        for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeList[i].selected === true) {
                this.selected = true;
                this.employeeList[i].companyId = this.companyId;
                this.updateEmployee.push(this.employeeList[i]);
            }
        }
    }
    validate() {
        if (this.insEmployee['fullname'] == '' || this.insEmployee['fullname'] == null) {
            this.toastr.error('Please input employee name');
            document.getElementById('ins_manage_fullname').style.borderColor = 'red';
            document.getElementById('ins_manage_fullname').focus();
            return false;
        } else if (this.insEmployee['fullname'].length < 3) {
            this.toastr.error('Please input employee name min 3 letter');
            document.getElementById('ins_manage_fullname').style.borderColor = 'red';
            document.getElementById('ins_manage_fullname').focus();
            return false;
        } else {
            document.getElementById('ins_manage_fullname').style.borderColor = 'green';
        }
        return true;
    }

    // updateStatus(item) {
    //     this.loading = true;
    //     this.updRole['accountId'] = item.accountId;
    //     this.updRole['roleId'] = item.roleId;
    //     this.employeeService.putUpdateAccount(this.updRole).subscribe(
    //         results => {
    //             this.loading = false;
    //             this.toastr.success("Update success");
    //             this.updRole = {};
    //             this.getEmployee(this.iconIsActive);
    //         },
    //         (error) => {
    //             this.loading = false;
    //             this.toastr.error(error);
    //         }
    //     );
    // }

    getAccount(item) {
        this.getRole = item;
        if (this.getRole == 0) {
            this.getEmployee(this.iconIsActive);
        }
        else {
            this.employeeService.getAllWithRole(this.companyId, this.iconIsActive, this.getRole).subscribe(
                (data) => {
                    this.employeeList = data;
                }
            );
        }
    }
    validateRole() {
        if (this.insEmployee['role'] == 0) {
            this.toastr.error('Please choosing role of account!');
            document.getElementById('ins_manage_role').style.borderColor = 'red';
            document.getElementById('ins_manage_role').focus();
            return false;
        } else {
            document.getElementById('ins_manage_role').style.borderColor = 'green';
        }
        return true;
    }

    validateAddress() {
        if (this.insEmployee['address'] != undefined) {
            if (this.insEmployee['address'] != '') {
                if (this.insEmployee['address'].length < 3) {
                    this.toastr.error('Please input employee address min 3 characters');
                    document.getElementById('ins_manage_address').style.borderColor = 'red';
                    document.getElementById('ins_manage_address').focus();
                    return false;
                }
                else if (this.insEmployee['address'].length > 200) {
                    this.toastr.error('Please input employee Employee address max 200 characters');
                    document.getElementById('ins_manage_address').style.borderColor = 'red';
                    document.getElementById('ins_manage_address').focus();
                    return false;
                } else {
                    document.getElementById('ins_manage_address').style.borderColor = 'green';
                }
            }
        }
        return true;
    }
    validatePhone() {
        const check = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.insEmployee['phone']);
        if(this.insEmployee['phone'] != undefined){
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
    validateGender() {
        if (this.insEmployee['gender'] == -1) {
            this.toastr.error('Please choosing gender of account!');
            document.getElementById('ins_manage_gender').style.borderColor = 'red';
            document.getElementById('ins_manage_gender').focus();
            return false;
        } else {
            document.getElementById('ins_manage_gender').style.borderColor = 'green';
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
        let email = this.insEmployee['email'].trim();
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
                document.getElementById('ins_manage_email').style.borderColor = 'green';
            }
        }

        return true;
    }
}
