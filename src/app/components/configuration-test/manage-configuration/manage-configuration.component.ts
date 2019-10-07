import { ConfigurationApiService } from './../../../services/configuration-api.service';
import { CompanyApiService } from '../../../services/company-api.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { from } from 'rxjs';

@Component({
  selector: 'manage-configuration',
  templateUrl: './manage-configuration.component.html',
  styleUrls: ['./manage-configuration.component.scss']
})
export class ManageConfigurationComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    public router: Router,
    private modalService: NgbModal,
    private companyApi: CompanyApiService,
    private configAPi: ConfigurationApiService,
  ) {
    this.page = 1;
    this.pageSize = 3;
  }
  iconIsActive: boolean;
  page: number;
  pageSize: number;
  element: HTMLElement;
  selectedAll: any;
  Configurations = [];
  Account = {};
  Company: {};

  inputCompany = {};
  inputManager = {};

  searchText = '';

  updateCompany = {};
  updateManager = {};
  updateStatus = [];

  PageSize(test: number) {
    this.pageSize = test;
  }

  ngOnInit() {
    this.getConfigurationIsActive(true);
    this.inputCompany['Name'] = '';
    this.inputCompany['Address'] = '';
    this.inputCompany['Phone'] = '';
    this.inputCompany['Fax'] = '';
    this.inputCompany['IsActive'] = true;

    this.inputManager['Fullname'] = "";
    this.inputManager['Phone'] = "";
    this.inputManager['Email'] = "";
    this.inputManager['Address'] = "";
    this.inputManager['Gender'] = true;
  }

  open(content) {
        this.modalService.open(content, { size: 'lg',   ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  getConfigurationIsActive(status: boolean){
    this.configAPi.getAllConfiguration(status).subscribe(
      (data) => {
        this.Configurations = data['data']['data'];
      }
    );
  }
}