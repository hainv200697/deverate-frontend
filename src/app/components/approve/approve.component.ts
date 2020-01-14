import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfigurationApiService } from 'src/app/services/configuration-api.service';
import { ApproveApiService } from 'src/app/services/approve-api.service';
@Component({
    selector: 'app-approve',
    templateUrl: './approve.component.html',
    styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {
    constructor(
        private activeRoute: ActivatedRoute,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private configApi: ConfigurationApiService,
        private approveService: ApproveApiService,
    ) { }
    listConfig = [];
    public loading = false;
    searchText = '';
    approveList = [];
    updateStatus = [];
    configId;
    checkApprove;
    companyId = Number(localStorage.getItem('CompanyId'));
    ngOnInit() {
        this.getApproveById();
    }

    clickButtonRefresh() {
        this.getApproveById();
    }

    getApproveById() {
        this.approveService.getAllApproveRequest(this.configId).subscribe(
            (data: any) => {
                console.log(data);
                this.approveList = data;
            }
        );
    }

    getConfig() {
        this.loading = true
        this.configApi.getConfigForApplicant(true, this.companyId).subscribe(
            (data) => {
                this.listConfig = data;
                this.configId = this.listConfig[0].configId;
            }
            , (error) => {
                if (error.status == 0) {
                    this.toastr.error("System is not available");
                }
                if (error.status == 400) {
                    this.toastr.error("Input is invalid");
                }
                if (error.status == 500) {
                    this.toastr.error("System error");
                }
                this.loading = false;
            }
        );
    }

    approve(item, status){
        this.checkApprove.configId = item.configId;
        this.checkApprove.isApprove = status;
        this.approveService.checkRankTest(this.checkApprove).subscribe(
            (data: any) => {
                console.log(data);
            }
        );
    }






}
