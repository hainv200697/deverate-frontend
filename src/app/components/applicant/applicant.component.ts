import { Component, OnInit } from '@angular/core';
import { ApplicantApiService } from 'src/app/services/applicant-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as XLSX from 'ts-xlsx';
import Stepper from 'bs-stepper';
import { GloblaService } from 'src/assets/service/global.service';
@Component({
    selector: 'app-applicant',
    templateUrl: './applicant.component.html',
    styleUrls: ['./applicant.component.scss']
})
export class ApplicantComponent implements OnInit {
    constructor(
        private applicantService: ApplicantApiService,
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
    checkFile = false;
    arrayBuffer: any;
    file: File;
    listDataExcel = [];
    selectedAll: any;
    applicantList = [];
    insApplicant = {};
    applicants = [];
    ngOnInit() {

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
        this.applicants = [];
        this.insApplicant = {};
        this.modalService.dismissAll();

    }

    delete(index){
        this.applicantList.splice(index,1);
    }

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
            this.checkExcel = true;
            list = await this.readExcel();
            list.forEach(element => {
                this.insApplicant = {};
                if (element.fullname == null ||
                    element.fullname == undefined) {
                    this.toastr.error("Full name" + element.fullname + " is invalid");
                    this.checkExcel = false;
                } else if (element.fullname.length < 5 ||
                    element.fullname.length > 200) {
                    this.toastr.error("Full name" + element.fullname + " is in range from 5 to 200 letters");
                    this.checkExcel = false;
                }
                if (element.email == null ||
                    element.email == undefined ||
                    element.email.length < 5 ||
                    element.email.length > 200) {
                    this.toastr.error("Email" + element.email + " is invalid");
                    this.checkExcel = false;
                }
                this.insApplicant['fullname'] = element.fullname;
                this.insApplicant['email'] = element.email;
                this.applicantList.forEach(element => {
                    if(element.email == this.insApplicant['email'] ){
                        this.toastr.error("Email "+this.insApplicant['email']+" is existed");
                        this.checkExcel = false;
                    }
                });
                this.applicants.push(this.insApplicant);
            });
            let listEmail = [];
            let existedEmail: String[] = null;
            var valueArr = this.applicants.map(function (item) {
                var existItem = listEmail.some(email => email == item.email);
                if (existItem) {
                    existedEmail.push(item.email);
                }
                else {
                    listEmail.push(item.email);
                }
            });
            if (existedEmail != null) {
                const email = existedEmail.slice(0, 3);
                const message = `Email ${email.join(',')}${existedEmail.length > 3 ? ',...' : ''} existed`;
                this.toastr.error(message);
                this.checkExcel = false;
            }

        } catch (err) {
            this.toastr.error(err);
        }

    }

    async next() {
        this.index = 2;
        await this.formatExcel();
        this.stepper.next();
    }

    back() {
        this.index = 1;
        this.applicants = [];
        this.stepper.previous();
    }

    createApplicantExcel(){
        this.applicants.forEach(element => {
            this.applicantList.push(element); 
        });
        this.closeModal();
    }

    createApplicant() {
        if(this.validdate()){
            let checkExist= false;
            this.applicantList.forEach(element => {
                if(element.email == this.insApplicant['email'] ){
                    this.toastr.error("Email "+this.insApplicant['email']+" is existed");
                    checkExist = true;
                }
            });
            if(checkExist == false){
                this.applicantList.push(this.insApplicant);   
                this.insApplicant = {};     
            }
        }
    }

    createTest(){
        this.loading = true;
        this.applicantService.postCreateApplicant(this.applicantList).subscribe(
        results => {
            this.loading = false;
            this.toastr.success("Create success");
            this.applicantList = [];
            this.insApplicant = {};
        },
        (error) => {
            if (error.status == 400) {
                this.toastr.error("Input is invalid");
            }
            if (error.status == 500) {
                this.toastr.error("System error");
            }
        }
    );
    }

    validdate() {
        if (this.insApplicant['fullname'] == '' || this.insApplicant['fullname'] == null) {
            this.toastr.error('Message', 'Please input applicant name');
            return false;
        } else if (this.insApplicant['fullname'].length < 3) {
            this.toastr.error('Message', 'Please input applicant name min 3 letter');
            return false;
        } else if (!this.globalservice.checkMail.test(String(this.insApplicant['email']).toUpperCase())) {
            this.toastr.error('Message', 'Email wrong format');
            return false;
        } else if (this.insApplicant['email'] == '') {
            this.toastr.error('Message', 'Email can not blank');
            return false;
        }
        return true;
    }


}