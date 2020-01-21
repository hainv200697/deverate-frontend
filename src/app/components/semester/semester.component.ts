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
    check;
    startDate;
    endDate;
    minDate;
    ngOnInit() {
        this.getAllConfig();
        this.minDate = this.momentToOpjectDate(moment());
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

    checkSelected(accountId) {
        var index = this.listEmployee.findIndex(x => x.accountId == accountId);
        this.listEmployee[index].selected = !this.listEmployee[index].selected;
        if (this.listEmployee[index].selected == false) {
            this.chooseEmployee.splice(this.listEmployee.indexOf(accountId), 1);
        } else {
            this.chooseEmployee.push(accountId);
        }
    }

    createTest() {
        this.validate();
        if (this.check == false) {
            return;
        }
        for (let index = 0; index < this.listConfig.length; index++) {
            if (this.listConfig[index].configId == this.chooseConfig) {
                const date = moment(this.startDate);
                this.endDate = this.calculateEndDate(date, this.listConfig[index].expiredDays);
            }
        }
        if (this.startDate.month < 10) {
            this.startDate.month =  ("0" + this.startDate.month).slice(-2);
        }
        if (this.startDate.day < 10) {
            this.startDate.day =  ("0" + this.startDate.day).slice(-2)
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

    calculateEndDate(date, expiredDays) {
        return {
            year: date.year(),
            month: date.month() < 10 ? ("0" + date.month()).slice(-2) : date.month(),
            day: date.date() + expiredDays < 10 ? ("0" + date.date() + expiredDays).slice(-2) : date.date() + expiredDays
        }
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
        if (this.chooseConfig == null) {
            this.toast.error('Please choose test setting');
            this.check = false;
        }
        if (this.chooseEmployee == undefined || this.chooseEmployee.length == 0) {
            this.toast.error('Please choose employee');
            this.check = false;
        }
    }
}
