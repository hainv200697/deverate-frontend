import { ConfigurationApiService } from './../../services/configuration-api.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EmployeeApiService } from '../../services/employee-api.service';
import { SemesterApiService } from '../../services/semester-api.service';
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
    ) {
        this.page = 1;
        this.pageSize = 25;
    }
    listConfig;
    chooseConfig = null;
    chooseType = 1;
    listEmployee = [];
    dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'text',
        enableCheckAll: false,
        itemsShowLimit: 3,
        allowSearchFilter: true,
    };
    listRankOfEmployee = [];
    listSemester = [];
    companyId = localStorage.getItem('CompanyId');
    selectedRanks = [];
    selectedSemester = [];
    page: number;
    pageSize: number;
    chooseEmployee = [];
    selectedAll: any;
    public loading = false;
    check;
    ngOnInit() {
        this.getAllConfig();
        this.getAllEmployeeInCompany();
    }

    PageSize(value: number) {
        this.pageSize = value;
    }

    getAllEmployeeInCompany() {
        this.loading = true;
        this.employeeApiService.getAllEmployee(this.companyId,true).subscribe(
            (data) => {
                this.loading = false;
                this.listEmployee = data;
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
        this.configurationApiService.getAllConfiguration(true, this.companyId).subscribe(
            (result) => {
                this.listConfig = result;
            }, (error) => {
                if (error.status == 0) {
                    this.toast.error("Connection timeout");
                }
                if (error.status == 500) {
                    this.toast.error("System error");
                }
            }
        )
    }

    checkIfAllSelected() {
        this.chooseEmployee = [];
        this.selectedAll = this.listEmployee.every(function (item: any) {
            return item.selected == true;
        })
        for (var i = 0; i < this.listEmployee.length; i++) {
            if (this.listEmployee[i].selected == true) {
                this.chooseEmployee.push(this.listEmployee[i].accountId)
            }
        }
    }

    selectAll() {
        this.chooseEmployee = [];
        for (var i = 0; i < this.listEmployee.length; i++) {
            this.listEmployee[i].selected = this.selectedAll;
            this.chooseEmployee.push(this.listEmployee[i].companyId)
        }
    }

    chooseRanks(item) {
        this.selectedRanks.push(item);
    }

    DeSelectRank(item) {
        for (let i = 0; i < this.selectedRanks.length; i++) {
            if (this.selectedRanks[i].id == item.id) {
                this.selectedRanks.splice(i, 1);
                break;
            }
        }
    }

    chooseSemesters(item) {
        this.selectedSemester.push(item)
    }

    DeSelectSemester(item) {
        for (let i = 0; i < this.selectedSemester.length; i++) {
            if (this.selectedSemester[i].id == item.id) {
                this.selectedSemester.splice(i, 1);
                break;
            }
        }
    }

    createTest() {
        this.validate();
        if (this.check == false) {
            return;
        }
        var data = {
            accountIds: this.chooseEmployee,
            configId: this.chooseConfig,
            oneForAll: this.chooseType
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
                this.chooseConfig = null;
                this.selectedAll = false;
                for (let i = 0; i < this.listEmployee.length; i++) {
                    this.listEmployee[i].selected = false;
                }
            }
        });
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
