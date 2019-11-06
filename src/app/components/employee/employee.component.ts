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
    iconIsActive=true;
    private stepper: Stepper;
    companyId = Number(sessionStorage.getItem('CompanyId'));
    // Excel
    index = 1;
    checkFile = false;
    arrayBuffer: any;
    file: File;
    listDataExcel = [];
    selectedAll: any;
    employeeList = [];
    insEmployee = {};
    employees = [];
    updateEmployee = [];
    listUser:String[] = [];
    listId:number[] = [];
    ngOnInit() {
        this.getEmployee(this.iconIsActive);
    }
    async next(){
        this.index = 2;
        await this.formatExcel();
        this.stepper.next();
    }
    back(){
        this.index=1;
        this.employees = [];
        this.stepper.previous();
    }
    // Excel
    incomingfile(event) {
        this.file = event.target.files[0];
        console.log(this.file);
        if(this.file != null && this.file != undefined){
            var name = this.file.name.split('.');
            let type = name[name.length-1]+"";
            console.log(type);
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
            list.forEach(element => {
                console.log(element);
                this.insEmployee = {};
                this.insEmployee['companyId'] = this.companyId;
                this.insEmployee['fullname'] = element.fullname;
                this.insEmployee['email'] = element.email;
                this.insEmployee['role'] = 3;
                this.employees.push(this.insEmployee);
            });
        } catch (err) {
            console.log(err);
        }

    }

    clickButtonRefresh() {
        this.getEmployee(this.iconIsActive);
    }

    getEmployee(status) {
        this.iconIsActive =status;
        this.employeeService.getAllEmployee(this.companyId,this.iconIsActive).subscribe(
            (data) => {
                this.employeeList = data['data']['data'];
            }
        );
    }

    // modal
    // insert
    open(create) {
        this.modalService.open(create, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    }

    openModalExcel(excel) {
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
        this.insEmployee['companyId'] = this.companyId;
        this.loading = true; 
        this.insEmployee['role'] = 3;
        this.employees.push(this.insEmployee);
        this.employeeService.postCreateEmployee(this.employees).subscribe(
            results => {
                console.log(results);
                this.loading = false;
                if (results.status.code == 200) {
                    this.toastr.success(results.status.message);
                    
                }
                this.employees = [];
                this.insEmployee = {};
                this.getEmployee(this.iconIsActive);
                this.closeModal();
            },
            (error)=>{
                this.loading = false;
                console.log(error); 
                let email = [];
                let i = 0;
                console.log(error.error);
                error.error.forEach(element => {
                    if(i < 4){
                        email.push(element);
                    }
                    i++;
                });
                console.log(email);
                this.toastr.error("Email "+email + " existed");
            }
        );
    }


    // change status
// change status
clickButtonChangeStatus(status: boolean) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This catalogue will be delete!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.value) {
            console.log(this.updateEmployee);
            for (let i = 0; i < this.updateEmployee.length; i++) {
                this.listId.push(this.updateEmployee[i].accountId)
            }
            this.employeeService.disableEmployee(this.listId,status).subscribe(data => {
                this.getEmployee(this.iconIsActive);
                this.closeModal();
                Swal.fire('Success', 'The company has been deleted', 'success');
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
            this.employeeService.resendpassword(this.listUser,this.companyId).subscribe(data => {
                this.getEmployee(this.iconIsActive);
                this.closeModal();
                console.log(data);
                Swal.fire( {title:'Success',text: data.status.message,type:'success'});
                this.listUser = [];
            },error=>{
                console.log(error);
                let account = [];
                let i = 0;
                console.log(error.error);
                error.error.forEach(element => {
                    if(i < 4){
                        account.push(element);
                    }
                    i++;
                });
                Swal.fire({title:'Cancelled',
                text: "Account "+ account +" not found",
                type:'error'});
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
        if (this.insEmployee['fullname'] == '') {
            this.toastr.error('Message', 'Please input employee name');
            return false;
        } else if (this.insEmployee['fullname'].length < 3) {
            this.toastr.error('Message', 'Please input employee name min 3 letter');
            return false;
        } else if (!this.globalservice.checkMail.test(String(this.insEmployee['email']).toUpperCase())) {
            this.toastr.error('Message', 'Email wrong format');
            return false;
        }
        return true;
    }

}
