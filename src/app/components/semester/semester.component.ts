import { ConfigurationApiService } from './../../services/configuration-api.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-applicant',
    templateUrl: './semester.component.html',
    styleUrls: ['./semester.component.scss']
})
export class SemesterComponent implements OnInit {
    constructor(
        private configurationApiService: ConfigurationApiService,
        private modalService: NgbModal,
        private toastr: ToastrService,
    ) {
        this.page = 1;
        this.pageSize = 25;
    }
    listConfig;
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
    ngOnInit() {
        this.getAllConfig();
    }

    PageSize(value: number) {
        this.pageSize = value;
    }

    getAllConfig() {
        this.configurationApiService.getConfigForApplicant(true, this.companyId).subscribe(
            (result) => {
                this.listConfig = result;
            }, (error) => {
                if (error.status == 400) {
                    this.toastr.error("Input is invalid");
                }
                if (error.status == 500) {
                    this.toastr.error("System error");
                }
            }
        )
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
}
