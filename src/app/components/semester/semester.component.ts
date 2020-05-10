import { ConfigurationApiService } from './../../services/configuration-api.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EmployeeApiService } from '../../services/employee-api.service';
import { SemesterApiService } from '../../services/semester-api.service';
import * as moment from 'moment';
@Component({
    selector: 'app-applicant',
    templateUrl: './semester.component.html',
    styleUrls: ['./semester.component.scss']
})
export class SemesterComponent implements OnInit {
    constructor(
        private configurationApiService: ConfigurationApiService,
        private semesterApiService: SemesterApiService,
        private employeeApiService: EmployeeApiService,
        private modalService: NgbModal,
        private toast: ToastrService,
    ) { }
    search;
    listConfig;
    chooseConfig = null;
    chooseType = false;
    listEmployee = [];
    companyId = localStorage.getItem('CompanyId');
    chooseEmployee = [];
    public loading = false;
    selectedAll: any;
    check;
    startDate;
    endDate;
    minDate;
    ngOnInit() {
        this.getAllConfig();
        this.chooseConfig = -1;
        this.minDate = this.momentToOpjectDate(moment());
        this.startDate = this.minDate;
        this.calculateEndDate(this.startDate, 7);
    }

    getEmployeeDoTheTest(configId) {
        this.loading = true;
        this.employeeApiService.getEmployeeDoTheTest(configId, this.companyId).subscribe(
            (data) => {
                this.loading = false;
                this.listEmployee = data;
                this.listEmployee.forEach(element => {
                    element.selected = false;
                });
                this.selectedAll = false;
            }, (error) => {
                if (error.status == 0) {
                    this.toast.error("Connection timeout");
                }
                if (error.status == 500) {
                    this.toast.error("System error");
                }
                this.loading = false;
            }
        )
    }

    getAllConfig() {
        this.loading = true;
        this.configurationApiService.getConfigForEmployee(this.companyId).subscribe(
            (result) => {
                this.listConfig = result;
                this.loading = false;
            }, (error) => {
                if (error.status == 0) {
                    this.toast.error("Connection timeout");
                }
                if (error.status == 500) {
                    this.toast.error("System error");
                }
                this.loading = false;
            }
        )
    }

    selectAll() {
        if(this.selectedAll){
            this.listEmployee.forEach(e=>{
                e.selected = true;
                this.chooseEmployee.push(e.accountId);
            });
        }
        else{
            this.listEmployee.forEach(e=>{
                e.selected = false;
            });
            this.chooseEmployee = [];
        }
    }

    checkSelected(accountId) {
        var index = this.listEmployee.findIndex(x => x.accountId == accountId);
        this.listEmployee[index].selected = !this.listEmployee[index].selected;
        if (this.listEmployee[index].selected == false) {
            this.chooseEmployee.splice(this.listEmployee.indexOf(accountId), 1);
            this.selectedAll = false;
        } else {
            this.chooseEmployee.push(accountId);
            if(this.chooseEmployee.length == this.listEmployee.length){
                this.selectedAll = true;
            }
        }
    }

    createTest() {
        this.validate();
        if (this.check == false) {
            return;
        }
        if (this.startDate.month < 10) {
            this.startDate.month =  ("0" + this.startDate.month).slice(-2);
        }
        if (this.startDate.day < 10) {
            this.startDate.day =  ("0" + this.startDate.day).slice(-2)
        }
        if (this.endDate.month < 10) {
            this.endDate.month =  ("0" + this.endDate.month).slice(-2);
        }
        if (this.endDate.day < 10) {
            this.endDate.day =  ("0" + this.endDate.day).slice(-2)
        }
        var startDateString = `${this.startDate.year}-${this.startDate.month}-${this.startDate.day}T00:00:01.000+07:00`;
        var endDateString =  `${this.endDate.year}-${this.endDate.month}-${this.endDate.day}T23:59:59.000+07:00`;
        var data = {
            accountIds: this.chooseEmployee,
            configId: this.chooseConfig,
            oneForAll: this.chooseType,
            startDate: startDateString,
            endDate: endDateString
        };
        Swal.fire({
            title: 'Are you sure?',
            text: 'The test will be create!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, create it!',
            cancelButtonText: 'No, do not create '
        }).then((result) => {
            if (result.value) {
                this.loading = true;
                this.semesterApiService.createTest(data).subscribe(data => {
                    this.toast.success('Create success');
                    this.getEmployeeDoTheTest(this.chooseConfig);
                    this.chooseEmployee = [];
                    this.loading = false;
                    this.selectedAll = false;
                    this.startDate = this.momentToOpjectDate(moment());
                    this.minDate = this.momentToOpjectDate(moment());
                    this.calculateEndDate(this.startDate, 7);
                }, (error) => {
                    if (error.status == 0) {
                        this.toast.error('Conection time out');
                    }
                    if (error.status == 500) {
                        this.toast.error('Server error');
                    }
                    this.loading = false;
                });
            }
        });
    }

    momentToOpjectDate(date) {
        return {
            year: date.year(),
            month: date.month() + 1,
            day: date.date()
        }
    }

    validate() {
        this.check = true;
        if (this.chooseConfig == -1) {
            this.toast.error('Please choose semester!');
            this.check = false;
        }
        if (this.chooseEmployee == undefined || this.chooseEmployee.length == 0) {
            this.toast.error('Please choose employee');
            this.check = false;
        }
        if(this.startDate == undefined || this.startDate == null){
            this.toast.error('Please choose startdate');
            this.check = false;
        }
        if(this.endDate == undefined || this.endDate == null){
            this.toast.error('Please choose enddate');
            this.check = false;
        }
    }

    calculateEndDate(startDate, days) {
        var ed = moment(`${startDate.day}-${startDate.month}-${startDate.year}`, "DD-MM-YYYY").add( days - 1, 'days');
        this.endDate = {
            year: ed.year(),
            month: ed.month() + 1,
            day: ed.date()
        }
    }

}
