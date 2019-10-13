import { GloblaService } from './../../../../assets/service/global.service';
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
    private globalservice: GloblaService,
  ) {
    this.page = 1;
    this.pageSize = 5;
  }
  public loading = false;
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
    this.inputCompany['Name'] = '';
    this.inputCompany['Address'] = '';
    this.inputCompany['Phone'] = '';
    this.inputCompany['Fax'] = '';
    this.inputCompany['isActive'] = true;

    this.inputManager['Fullname'] = "";
    this.inputManager['Phone'] = "";
    this.inputManager['Email'] = "";
    this.inputManager['Address'] = "";
    this.inputManager['Gender'] = true;
  }

  open(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  openDetail(content, c) {
    this.getAccountManager(c['companyId'])
    this.updateCompany['CompanyId'] = c['CompanyId'];
    this.updateCompany['name'] = c['name'];
    this.updateCompany['address'] = c['address'];
    this.updateCompany['isActive'] = c['isActive'];
    this.updateCompany['phone'] = c['phone'];
    this.updateCompany['fax'] = c['fax'];

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    });
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
    if (status == false) {
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
          this.companyApi.disableCompany(this.updateStatus).subscribe(data => {
            this.getCompanyIsActive(status);
            this.closeModal();
            Swal.fire('Success', 'The company has been deleted', 'success');
          });;
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          this.updateStatus = [];
          this.closeModal();
        }
      })
    }
    else {
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
          this.companyApi.disableCompany(this.updateStatus).subscribe(data => {
            this.getCompanyIsActive(status);
            this.closeModal();
            Swal.fire('Success', 'The company has been enabled', 'success');
          });;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.updateStatus = [];
          this.closeModal();
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
    this.loading = true;
    this.companyApi.getAllCompany(isActive).subscribe(
      (data) => {
        this.loading = false;
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
    if(this.validdate() == false){
      console.log(this.validdate())
      console.log(this.inputCompany);
      return;
    }
    else{
    this.loading = false;
    var inputCompanyData = {};
    inputCompanyData['companyDTO'] = this.inputCompany;
    inputCompanyData['accountDTO'] = this.inputManager;
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'The company will be create!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No, don not create '
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        console.log(inputCompanyData)
        this.companyApi.insertCompany(inputCompanyData).subscribe(data => {
          this.getCompanyIsActive(true);
          this.closeModal();
          Swal.fire('Success', 'The company has been created', 'success');
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.updateStatus = [];
        this.closeModal();
      }
    })
  }
  }

  Update() {
    if (this.updateCompany['Name'] == "" || this.updateCompany['Address'] == "") {
      Swal.fire('Error', 'Something went wrong', 'error');
      return;
    }
    this.loading = false;
    Swal.fire({
      title: 'Are you sure?',
      text: 'The company will be update!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.companyApi.updateCompany(this.updateCompany).subscribe(data => {
          this.getCompanyIsActive(true);
          this.closeModal();
          Swal.fire('Success', 'The company has been updated', 'success');
        });


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.updateStatus = [];
        this.closeModal();
      }
    })
  }

  validdate(){
    if (this.inputCompany['Name'] == "") {
      this.toast.error('Message', 'Please input company name');
      return false;
    }
    else if (this.inputCompany['Address'] == "") {
      this.toast.error("Message", "Please input company's address");
      return false;
    }
    else if (this.inputCompany['Phone'] == "") {
      this.toast.error("Message", "Please input company's phone");
      return false;
    }
    else if (this.inputCompany['Fax'] == "") {
      this.toast.error("Message", "Please input company's fax");
      return false;
    }
    
    else if (this.inputManager['Fullname'] == "" ) {
      this.toast.error("Message", "Please input manager name");
      return false;
    }
    else if(this.inputManager['Fullname'].length < 3 ){
      this.toast.error("Message", "Please input manager name min 3 letter");
      return false;
    }
    
    else if(!this.globalservice.checkMail.test(String(this.inputManager['Email']).toUpperCase())){
      this.toast.error("Message", "Email wrong format");
      return false;
    }
  }

}