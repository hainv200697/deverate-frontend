import { Component, OnInit } from '@angular/core';
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
    private toastr: ToastrService,
    private configApi: ConfigurationApiService,
    private approveApi: ApproveApiService,
  ) { }
  listConfig = [];
  public loading = false;
  searchText = '';
  chooseConfig;
  companyId = localStorage.getItem('CompanyId');
  listEmployee = [];
  ngOnInit() {
    this.getConfig();
  }

  getConfig() {
    this.loading = true
    this.configApi.getConfigForApplicant(true, this.companyId).subscribe(
      (data) => {
        this.listConfig = data;
        this.loading = false;
      }
      , (error) => {
        if (error.status == 0) {
          this.toastr.error("Connection timeout");
        }
        if (error.status == 500) {
          this.toastr.error("System error");
        }
        this.loading = false;
      }
    );
  }

  getEmployeeToApprove(configId){
    this.loading = true
    this.approveApi.getAllApproveRequest(configId).subscribe(
      (data) => {
        this.listEmployee = data;
        this.loading = false;
      }
      , (error) => {
        if (error.status == 0) {
          this.toastr.error("Connection timeout");
        }
        if (error.status == 500) {
          this.toastr.error("System error");
        }
        this.loading = false;
      }
    );
  }

  approve(accountId, isApprove){
    this.loading = true
    this.approveApi.approveRank(this.chooseConfig,accountId,isApprove).subscribe(
      (data) => {
        this.toastr.success("Success");
        this.getEmployeeToApprove(this.chooseConfig)
        this.loading = false;
      }
      , (error) => {
        if (error.status == 0) {
          this.toastr.error("Connection timeout");
        }
        if (error.status == 500) {
          this.toastr.error("System error");
        }
        this.loading = false;
      }
    );
  }
}