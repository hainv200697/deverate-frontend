import { Component, OnInit } from '@angular/core';
import { EmployeeApiService } from 'src/app/services/employee-api.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as XLSX from 'ts-xlsx';
import Stepper from 'bs-stepper';
import { GloblaService } from 'src/assets/service/global.service';
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
    ngOnInit() {
        this.getEmployee(this.iconIsActive);
    }
    async next() {
        this.index = 2;
        await this.formatExcel();
        this.stepper.next();
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
            list = await this.readExcel();
            this.checkExcel = true;
            list.forEach(element => {
                this.insEmployee = {};
                if (element.fullname == null ||
                    element.fullname == undefined ) {
                    this.toastr.error("Full name"+element.fullname+" is invalid");
                    this.checkExcel = false;
                }else if(element.fullname.length < 5 ||
                    element.fullname.length > 200){
                        this.toastr.error("Full name"+element.fullname+" is in range from 5 to 200 letters");
                        this.checkExcel = false;
                    }
                if (element.email == null ||
                    element.email == undefined ||
                    element.email.length < 5 ||
                    element.email.length > 200) 
                {
                    this.toastr.error("Email"+element.email+" is invalid");
                    this.checkExcel = false;
                }else if (!this.globalservice.checkMail.test(String(element.email).toUpperCase())) {
                    this.toastr.error('Message', "Email "+element.email+" wrong format");
                    this.checkExcel = false;
                }
                if (element.role !== 'Employee' && element.role+"" !== 'Test Owner' ) 
                {
                    this.toastr.error("Role of "+element.fullname+" is invalid");
                    this.checkExcel = false;
                }else if( element.role == null || element.role == undefined){
                    element.role =null;
                    this.toastr.error("Role of "+element.fullname+" is blank");
                    this.checkExcel = false;
                }else if(element.role == "Employee"){
                    element.role = 3;
                }else if(element.role == "Test Owner"){
                    element.role = 4;
                }
                this.insEmployee['companyId'] = this.companyId;
                this.insEmployee['fullname'] = element.fullname;
                this.insEmployee['email'] = element.email;

                this.insEmployee['role'] = element.role;
                
                this.employees.push(this.insEmployee);
            });
            
            let listEmail = [];
            let existedEmail: String[] = null;
            var valueArr = this.employees.map(function (item) {
                var existItem = listEmail.some(email => email == item.email);
                if (existItem) {
                    existedEmail.push(item.email);
                }
                else {
                    listEmail.push(item.email);
                }
            });
            if (existedEmail != null ) {
                const email = existedEmail.slice(0, 3);
                const message = `Email ${email.join(',')}${existedEmail.length > 3 ? ',...' : ''} existed`;
                this.toastr.error(message);
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
        this.iconIsActive = status;
        this.employeeService.getAllEmployee(this.companyId, this.iconIsActive).subscribe(
            (data) => {
                this.employeeList = data;
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
            if (!this.validdate) {
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
        if(this.validdate()){
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
                    if(error.status == 500){
                        this.loading = false;
                        this.toastr.error("System error");
                        this.closeModal();
                    }else{
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
    validdate() {
        if (this.insEmployee['fullname'] == '' || this.insEmployee['fullname'] == null) {
            this.toastr.error('Message', 'Please input employee name');
            return false;
        } else if (this.insEmployee['fullname'].length < 3) {
            this.toastr.error('Message', 'Please input employee name min 3 letter');
            return false;
        } else if (!this.globalservice.checkMail.test(String(this.insEmployee['email']).toUpperCase())) {
            this.toastr.error('Message', 'Email wrong format');
            return false; 
        }else if (this.insEmployee['email'] == '') {
            this.toastr.error('Message', 'Email can not blank');
            return false;
        }else if (this.insEmployee['role'] == '') {
            this.toastr.error('Message', 'Role can not blank');
            return false;
        }else if (this.insEmployee['role'] == isNaN) {
            this.toastr.error('Message', 'RoleId mus be a number');
            return false;
        }else if (this.insEmployee['role'] < 3 || this.insEmployee['role'] > 4) {
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

    getAccount(item){
        if(item == 0){
            this.getEmployee(this.iconIsActive);
        }
        else{
            this.employeeService.getAllWithRole(this.companyId, this.iconIsActive,item).subscribe(
                (data) => {
                    this.employeeList = data;
                }
            );
        }
    }
}
