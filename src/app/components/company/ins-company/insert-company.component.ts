import { CompanyApiService } from './../../../services/company-api.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AccountApiService } from 'src/app/services/account-api.service';


@Component({
  selector: 'app-insert-company',
  templateUrl: './insert-company.component.html',
  styleUrls: ['./insert-company.component.scss']
})
export class InsertCompanyComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    public router: Router,
    private modalService: NgbModal,
    private companyApi: CompanyApiService,
    private accountApi: AccountApiService,
    private toast: ToastrService,
  ) {
    this.page = 1;
    this.pageSize = 3;
  }
  iconIsActive: boolean;
  page: number;
  pageSize: number;
  element: HTMLElement;
  selectedAll: any;
  Companies = [];
  Account = {};
  Company: {};

  inputCompany = {};
  inputManager = {};

  searchText = "";

  updateCompany = {};
  updateManager = {};
  updateStatus = [];

  PageSize(test: number) {
    this.pageSize = test;
  }

  ngOnInit() {
    this.getCompanyIsActive(true);
    this.inputCompany['name'] = '';
    this.inputCompany['address'] = '';
    this.inputCompany['phone'] = '';
    this.inputCompany['fax'] = '';
    this.inputCompany['isActive'] = true;

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

  openDetail(content, c) {
    this.getAccountManager(c['companyId'])

    this.updateCompany['companyId'] = c['companyId'];
    this.updateCompany['name'] = c['name'];
    this.updateCompany['address'] = c['address'];
    this.updateCompany['isActive'] = c['isActive'];
    this.updateCompany['phone'] = c['phone'];
    this.updateCompany['fax'] = c['fax'];


    this.open(content);
  }

  selectAll() {
    this.updateStatus = [];
    for (var i = 0; i < this.Companies.length; i++) {
      this.Companies[i].selected = this.selectedAll;
      this.updateStatus.push(this.Companies[i])
    }
  }

  clickButtonRefresh(refesh) {
    refesh.classList.add('spin-animation');
    setTimeout(function () {
      refesh.classList.remove('spin-animation');
    }, 500);
    this.getCompanyIsActive(true);
  }

  clickButtonChangeStatus(status: boolean) {
    if(status==false){
    Swal.fire({
      title: 'Are you sure?',
      text: 'The company will be delete!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        for (var i = 0; i < this.updateStatus.length; i++) {
          this.updateStatus[i].IsActive = status;
        }
        this.companyApi.disableCompany(this.updateStatus);
        this.getCompanyIsActive(true);
        Swal.fire(
          'Deleted',
          '',
          'success'
        )

      }
    })
  }
  else{
    Swal.fire({
      title: 'Are you sure?',
      text: 'The company will be enable!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, enable it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        for (var i = 0; i < this.updateStatus.length; i++) {
          this.updateStatus[i].IsActive = status;
        }
        this.companyApi.disableCompany(this.updateStatus);
        this.getCompanyIsActive(true);
        Swal.fire(
          'Enabled',
          '',
          'success'
        )

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.updateStatus = [];
        Swal.fire(
          'Cancelled',
          '',
          'error'
        )
      }
    })
  }
  }

  ChangeStatus(status: boolean, companyModel) {
    this.updateStatus = [];
    companyModel.IsActive = status;
    this.updateStatus.push(companyModel);
    this.companyApi.disableCompany(this.updateStatus);
  }

  checkIfAllSelected() {
    this.updateStatus = [];
    this.selectedAll = this.Companies.every(function (item: any) {
      return item.selected == true;

    })
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].selected == true) {
        this.updateStatus.push(this.Companies[i])
      }
    }
  }

  getCompanyIsActive(isActive: boolean) {
    this.iconIsActive = isActive;
    this.companyApi.getAllCompany(isActive).subscribe(
      (data) => {
        this.Companies = data['data']['data'];
      }
    );
  }

  getAccountManager(id: number) {
    this.accountApi.getManagerByCompanyId(id).subscribe(
      (data) => {
        this.Account = data['data']['data'];
      }
    );

  }

  search() {
    if (this.searchText == "") {
      this.getCompanyIsActive(true);
    }
    else {
      this.companyApi.getCompanyByName(this.searchText).subscribe(
        (data) => {
          this.Companies = data['data']['data'];
        }
      );
    }
  }

  Save() {
    // this.companyApi.insertCompany(this.inputCompany);
    // this.closeModal();
    var inputCompanyData = {};
    inputCompanyData['companyDTO'] = this.inputCompany;
    inputCompanyData['accountDTO'] = this.inputManager;
    console.log(inputCompanyData);

    if (this.inputCompany['Name'] == "" || this.inputCompany['Address'] == "" || this.inputManager['Fullname'].length < 3) {
      this.toast.error('Message', 'SOmething wrong');
      return;
    }
    this.companyApi.insertCompany(inputCompanyData);
    this.closeModal();
    Swal.fire('Success', 'The company has been created', 'success');
    this.getCompanyIsActive(true);
  }

  Update() {
    if (this.updateCompany['Name'] == "" || this.updateCompany['Address'] == "") {
      Swal.fire('Error', 'Something went wrong', 'error');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'The company will be update!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.companyApi.updateCompany(this.updateCompany);
        this.closeModal();
        Swal.fire('Success', 'The company has been updated', 'success');
        this.getCompanyIsActive(true);

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.updateStatus = [];
        Swal.fire(
          'Cancelled',
          '',
          'error'
        )
      }
    })
  }


}