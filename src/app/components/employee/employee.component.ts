import { Component, OnInit } from '@angular/core';
import { EmployeeApiService } from 'src/app/services/employee-api.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as XLSX from 'ts-xlsx';
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
    id = Number(sessionStorage.getItem('AccountId'));
    // Excel
    checkFile = true;
    arrayBuffer: any;
    file: File;
    listDataExcel = [];
    selectedAll: any;
    employeeList = [];
    insEmployee = {};
    employees = [];
    companyId = 0;
    ngOnInit() {
        this.getEmployee();
    }
    // Excel
    incomingfile(event) {
        this.checkFile = true;
        this.file = event.target.files[0];
        if (this.file.size > 200000) {
            this.checkFile = false;
            this.toastr.error('File must be smaller than 20MB');
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
                this.insEmployee['accountId'] = this.id;
                this.insEmployee['fullname'] = element.fullname;
                this.insEmployee['email'] = element.email;
                this.employees.push(this.insEmployee);
            });
        } catch (err) {
            console.log(err);
        }

    }

    clickButtonRefresh() {
        this.getEmployee();
    }

    getEmployee() {
        this.employeeService.getAllEmployee(this.id).subscribe(
            (data) => {
                console.log(data['data']['data']);
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
    }

    // close modal
    closeModal() {
        this.modalService.dismissAll();
    }


    // submit
    // insert submit
    async insertEmployeeSubmit(key) {
        if (key === 'excel') {
            await this.insertEmployeeExcel();
            this.getEmployee();
            this.toastr.success("Create success");
        } else {
            if (!this.validdate) {
                return;
            }
            this.insertEmployee();
            this.getEmployee();
        }
    }


    async insertEmployeeExcel() {
        await this.formatExcel();
        console.log(this.employees);
        this.employeeService.postCreateEmployeeByExcel(this.employees).subscribe(
            results => {
                console.log(results);
                    this.getEmployee();
                    // this.toastr.success(results.status.message);
                    this.closeModal();
            }
        );
    }



    // function 
    // insert Employee function
    insertEmployee() {
        this.insEmployee['accountId'] = this.id;
        this.loading = true;
        this.insEmployee['questionId'] = parseInt(this.insEmployee['questionId']);
        this.employeeService.postCreateEmployee(this.insEmployee).subscribe(
            results => {
                console.log(results);
                this.loading = false;
                if (results.status.code == 200) {
                    this.toastr.success(results.status.message);
                    
                }
                this.getEmployee();
                this.closeModal();
            }
        );
    }


    // change status


    // select answer
    // selectAll() {
    //     this.updateStatus = [];
    //     for (let i = 0; i < this.answerList.length; i++) {
    //         this.answerList[i].selected = this.selectedAll;
    //         this.updateStatus.push(this.answerList[i]);
    //     }
    // }

    // checkIfAllSelected() {
    //     this.updateStatus = [];
    //     this.selectedAll = this.answerList.every(function (item: any) {
    //         return item.selected === true;

    //     });
    //     for (let i = 0; i < this.answerList.length; i++) {
    //         if (this.answerList[i].selected === true) {
    //             this.updateStatus.push(this.answerList[i]);
    //         }
    //     }

    // }
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
