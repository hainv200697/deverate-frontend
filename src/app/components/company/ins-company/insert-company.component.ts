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
import { EmployeeApiService } from 'src/app/services/employee-api.service';


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
    private employeeService: EmployeeApiService,
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

  inputCompany = {
    name : '',
    address : '',
    phone : '', 
    fax : '', 
    isActive : true,
  };
  inputManager = {
    fullname : '',
    phone : '',
    email : '',
    address : '',
    gender : true,
  };

  searchText = "";

  updateCompany = {};
  updateManager = {};
  updateStatus = [];
  check = true;

  PageSize(test: number) {
    this.pageSize = test;
  }

  ngOnInit() {
    this.getCompanyIsActive(true);
  }

  open(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }).catch((error) => {
    });
  }

  closeModal() {
    this.inputCompany['name'] = '';
    this.inputCompany['address'] = '';
    this.inputCompany['phone'] = '';
    this.inputCompany['fax'] = '';
    this.inputCompany['isActive'] = true;

    this.inputManager['fullname'] = "";
    this.inputManager['phone'] = "";
    this.inputManager['email'] = "";
    this.inputManager['address'] = "";
    this.inputManager['gender'] = true;
    this.modalService.dismissAll();
  }

  openDetail(content, c) {
    this.updateCompany['companyId'] = c['companyId'];
    this.updateCompany['name'] = c['name'];
    this.updateCompany['address'] = c['address'];
    this.updateCompany['isActive'] = c['isActive'];
    this.updateCompany['phone'] = c['phone'];
    this.updateCompany['fax'] = c['fax'];

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }).catch((error) => {
    });;
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
          }, (error) => {
            this.toast.error(error.name);
            this.loading = false;
          });
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          this.updateStatus = [];
          this.closeModal();
        }
      });
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
          }, (error) => {
            this.toast.error(error.name);
            this.loading = false;
          });;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.updateStatus = [];
          this.closeModal();
        }
      });
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
      },
      (error) => {
        this.toast.error(error.name);
        this.loading = false;
        this.closeModal()
      }
    );
  }

  getAccountManager(id: number) {
    this.accountApi.getManagerByCompanyId(id).subscribe(
      (data) => {
        this.Account = data['data']['data'];
      }
    ), (error) => {
      this.toast.error(error.name);
      this.loading = false;
    };

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
    var inputCompanyData = {};
    this.validdate();
    if (this.check == false) {
      return;
    }
    else {
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
          console.log(inputCompanyData)
          this.loading = true;
          this.companyApi.insertCompany(inputCompanyData).subscribe(data => {
            this.loading = false;
            this.getCompanyIsActive(true);
            this.closeModal();
            Swal.fire('Success', 'The company has been created', 'success');
          }, (error) => {
            this.toast.error(error.name);
            this.loading = false;
          });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.updateStatus = [];
          this.closeModal();
        }
      });
    }
  }

  Update() {
    if (this.updateCompany['name'] == "" || this.updateCompany['address'] == "") {
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
        }, (error) => {
          this.toast.error(error.name);
          this.loading = false;
        });


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.updateStatus = [];
        this.closeModal();
      }
    });
  }

  resendmail(managerId, companyId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Password will be send!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'No, Do not send it'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        let manager: string[] = [];
        manager.push(managerId);
        this.employeeService.resendpassword(manager, companyId).subscribe(data => {
          this.getCompanyIsActive(true);
          this.closeModal();
          Swal.fire('Success', 'The mail has been send', 'success');
        }, (error) => {
          this.toast.error(error.name);
          this.loading = false;
        });
      }
    });
  }

  validateCompanyName() {
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].name == this.inputCompany['name']) {
        this.toast.error('Company\'s name is exist');
        this.check = false;
      }
    }
    if (this.inputCompany['name'] == "" || this.inputCompany['name'] == undefined) {
      this.toast.error('Please input company\'s name');
      this.check = false;
    }
    else if (this.inputCompany['name'].length < 3) {
      this.toast.error('Please input comapany name min 3 letter');
      this.check = false;
    }
  }

  validateCompanyAddress() {
    if (this.inputCompany['address'] == null || this.inputCompany['address'] == '') {
      this.toast.error('Please input address of company');
      this.check = false;
    } else if (this.inputCompany['address'].length < 3) {
      this.toast.error('Please input company address min 3 letter');
      this.check = false;
    }
    else if (this.inputCompany['address'].length > 200) {
      this.toast.error('Please input company address max 200 letter');
      this.check = false;
    }
  }

  validateCompanyPhone(){
    const checkphone =/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.inputCompany['phone']);
    if(this.inputCompany['phone'] == null || this.inputCompany['phone'] == ''){
        this.toast.error('Message', 'Please input phone of company');
        this.check = false;
    }else if (!checkphone) {
        this.toast.error('Message', 'Company\'s Phone number is invalid');
        this.check = false;
    }
  }

  validateManagerFullName(){
    var str = this.inputManager['fullname'].split(" ");
    console.log(str)
    if (this.inputManager['fullname'] == "" || this.inputManager['fullname'] == null) {
      this.toast.error('Please input manager\'s name');
      this.check = false;
    }
    else if(str.length < 2){
      this.toast.error('Manager\'s name min 2 leter');
      this.check = false;
    }
  }

  validateManagerMail(){
    if (this.inputManager['email'] == "" || this.inputManager['email'] == null) {
      this.toast.error('Please input manager\'s email');
      this.check = false;
    }
    else if (!this.globalservice.checkMail.test(String(this.inputManager['email']).toUpperCase())) {
      this.toast.error('Manager email wrong format');
      this.check = false;
    }
  }

  validateManagerPhone(){
    const checkphoneManager =/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.inputManager['phone']);
    if(this.inputManager['phone'] == null || this.inputManager['phone'] == ''){
        this.toast.error('Please input phone of manager');
        this.check = false;
    }else if (!checkphoneManager) {
        this.toast.error('Manager\'s Phone number is invalid');
        this.check = false;
    }
  }
  validdate() {
    this.check = true;
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].name == this.inputCompany['name']) {
        this.toast.error('Company\'s name is exist');
        this.check = false;
      }
      else if (this.Companies[i].phone == this.inputCompany['phone']) {
        this.toast.error('Company\'s phone is exist');
        this.check = false;
      }
      else if (this.Companies[i].managerMail == this.inputManager['email']) {
        this.toast.error('Manager\'s mail is exist');
        this.check = false;
      }
    }
    if (this.inputCompany['name'] == "" || this.inputCompany['name'] == null) {
      this.toast.error('Please input company\'s name');
      this.check = false;
    }
    else if (this.inputCompany['name'].length < 3) {
      this.toast.error('Please input comapany name min 3 letter');
      this.check = false;
    }
    if (this.inputCompany['address'] == null || this.inputCompany['address'] == '') {
      this.toast.error('Please input address of company');
      this.check = false;
    } else if (this.inputCompany['address'].length < 3) {
      this.toast.error('Please input company address min 3 letter');
      this.check = false;
    }
    else if (this.inputCompany['address'].length > 200) {
      this.toast.error('Please input company address max 200 letter');
      this.check = false;
    }
    const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.inputCompany['phone']);
    if (!checkPhone) {
      this.toast.error('Company phone is invalid');
      this.check = false;
    }
    var str = this.inputManager['fullname'].split(" ");
    console.log(str)
    if (this.inputManager['fullname'] == "" || this.inputManager['fullname'] == null) {
      this.toast.error('Please input manager\'s name');
      this.check = false;
    }
    else if(str.length < 2){
      this.toast.error('Manager\'s name min 2 letter');
      this.check = false;
    }
    if (!this.globalservice.checkMail.test(String(this.inputManager['email']).toUpperCase())) {
      this.toast.error('Manager\'s email wrong format');
      this.check = false;
    }
    const checkphoneManager =/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.inputManager['phone']);
    if(this.inputManager['phone'] == null || this.inputManager['phone'] == ''){
        this.toast.error('Please input phone of manager');
        this.check = false;
    }else if (!checkphoneManager) {
        this.toast.error('Manager\'s Phone number is invalid');
        this.check = false;
    }
    return this.check;
  }

}
