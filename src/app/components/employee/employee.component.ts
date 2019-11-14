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
    companyId = Number(sessionStorage.getItem('CompanyId'));
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
            console.log(list);
            list.forEach(element => {
                this.insEmployee = {};
                const phone = element.Phone+"";
                if (element.Fullname == null ||
                    element.Fullname == undefined) {
                    this.message.push("Full name" + element.Fullname + " is invalid");
                    this.checkExcel = false;
                } else if (element.Fullname.length < 5 ||
                    element.Fullname.length > 200) {
                    this.message.push("Full name" + element.Fullname + " must be in range from 5 to 200 letters");
                    this.checkExcel = false;
                }
                if (element.Address == null ||
                    element.Address == undefined) {
                    this.message.push("Address of " + element.Fullname + " is blank!");
                    this.checkExcel = false;
                } else if (element.Address.length < 5 ||
                    element.Address.length > 200) {
                    this.message.push("Address of " + element.Fullname + " must be in range from 5 to 200 letters");
                    this.checkExcel = false;
                }
                if(element.Phone === null || element.Phone === undefined ){
                    this.message.push("Phone of "+element.Fullname+" is blank!");
                    this.checkExcel = false;
                }else if(isNaN(element.Phone)){
                    this.message.push("Phone of "+element.Fullname+" is not a number!");
                    this.checkExcel = false;
                }
                else if(phone.length < 10 && phone.length > 11){
                    this.message.push("Phone of "+element.Fullname+" must have 10 of 11 numbers! ");
                    this.checkExcel = false;
                }
                if (element.Email == null ||
                    element.Email == undefined) {
                    this.message.push("Email of "+element.Fullname+" is blank!");
                    this.checkExcel = false;
                }else if (element.Email.length < 5) {
                    this.message.push("Length of email " + element.Email + " is more than 5");
                    this.checkExcel = false;
                } if (element.Email.length > 200) {
                    this.message.push("Length of email " + element.Email + " is less than 200");
                    this.checkExcel = false;
                }
                else if (!this.globalservice.checkMail.test(String(element.Email).toUpperCase())) {
                    this.message.push("Email " + element.Email + " is invalid");
                    this.checkExcel = false;
                }
                if (element.Role !== 'Employee' && element.Role  !== 'Test Owner') {
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
                    this.message.push("Gender of account " + element.Fullname + " is invalid!");
                    this.checkExcel = false;
                } else if (element.Gender == null || element.Gender == undefined) {
                    element.Gender = null;
                    this.message.push("Gender of account " + element.Fullname + " is blank!!");
                    this.checkExcel = false;
                } else if (element.Gender == "Male") {
                    element.Gender = true;
                } else if (element.Gender == "Female") {
                    element.Gender = false;
                }
                
                this.insEmployee['companyId'] = this.companyId;
                this.insEmployee['fullname'] = element.Fullname;
                this.insEmployee['email'] = element.Email;
                this.insEmployee['fullname'] = element.Fullname;
                this.insEmployee['role'] = element.Role;
                this.insEmployee['gender'] = element.Gender;
                this.insEmployee['phone'] = element.Phone;
                this.insEmployee['address'] = element.Address;
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
        this.employeeService.getAllEmployee(this.companyId, this.iconIsActive).subscribe(
            (data) => {
                this.employeeList = data;
                this.insEmployee = {};
                this.insEmployee['role'] = 0;
                this.insEmployee['gender']=-1;
            }
        );
    }

    // modal
    // insert
    open(create) {
        this.modalService.open(create, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    }

    openModalExcel(excel) {
        this.index = 1;
        this.employees = [];
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
            if (!this.validate()) {
                return;
            }
            this.employees = [];
            this.insEmployee['companyId'] = this.companyId;
            this.employees.push(this.insEmployee);
            this.insertEmployee();
            this.getEmployee(this.iconIsActive);

        }
    }


    insertEmployeeExcel() {
        this.insertEmployee();

    }



    // function 
    // insert Employee function
    insertEmployee() {
        if (this.validate() && this.validateRole() && this.validateAddress() && this.validatePhone() && this.validateGender()) {
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
                        this.loading = false;
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
    }


    // change status
    clickButtonChangeStatus(status: boolean) {

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
                    this.getEmployee(this.iconIsActive);
                    this.closeModal();
                    Swal.fire('Success', 'The status has been change', 'success');
                });;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.updateEmployee = [];
                Swal.fire(
                    'Cancelled',
                    '',
                    'error'
                )
            }
        })
    }

    // send pass
    resendmail() {
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
                }

                );;
            }
        })
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
        this.selectedAll = this.employeeList.every(function (item: any) {
            return item.selected === true;

        });
        for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeList[i].selected === true) {
                this.employeeList[i].companyId = this.companyId;
                this.updateEmployee.push(this.employeeList[i]);
            }
        }

    }
    validate() {
        if (this.insEmployee['fullname'] == '' || this.insEmployee['fullname'] == null) {
            this.toastr.error('Message', 'Please input employee name');
            return false;
        } else if (this.insEmployee['fullname'].length < 3) {
            this.toastr.error('Message', 'Please input employee name min 3 letter');
            return false;
        } else if (!this.globalservice.checkMail.test(String(this.insEmployee['email']).toUpperCase())) {
            this.toastr.error('Message', 'Email wrong format');
            return false;
        } else if (this.insEmployee['email'] == '') {
            this.toastr.error('Message', 'Email can not blank');
            return false;
        } else if (this.insEmployee['role'] == '') {
            this.toastr.error('Message', 'Role can not blank');
            return false;
        } else if (this.insEmployee['role'] == isNaN) {
            this.toastr.error('Message', 'RoleId mus be a number');
            return false;
        } else if (this.insEmployee['role'] < 3 || this.insEmployee['role'] > 4) {
            this.toastr.error('Message', 'Role must be in the range of 3 to 4');
            return false;
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
    validateRole(){
        if(this.insEmployee['role'] == 0){
            this.toastr.error('Message', 'Please choosing role of account!');
            return false;
        }
        return true;
    }

    validateAddress(){
        if(this.insEmployee['address'] == null || this.insEmployee['address'] == undefined){
            this.toastr.error('Message', 'Please choosing address of account!');
            return false;
        }else if (this.insEmployee['address'].length < 3) {
            this.toastr.error('Message', 'Please input employee address min 3 letter');
            return false;
        }
        else if (this.insEmployee['address'].length > 200) {
            this.toastr.error('Message', 'Employee address max 3 letter');
            return false;
        }
        return true;
    }
    validatePhone(){
        const phone = this.insEmployee['phone']+"";
        if(this.insEmployee['phone'] == null || this.insEmployee['phone'] == undefined){
            this.toastr.error('Message', 'Please choosing phone of account!');
            return false;
        }else if (isNaN(this.insEmployee['phone']) || 
                    phone.length > 11 || 
                    phone.length < 10) {
            this.toastr.error('Message', 'Phone number is invalid');
            return false;
        }
        return true;
    }
    validateGender(){
        console.log(this.insEmployee['gender']);
        if(this.insEmployee['gender'] == -1){
            this.toastr.error('Message', 'Please choosing gender of account!');
            return false;
        }
        return true;
    }
    
}
