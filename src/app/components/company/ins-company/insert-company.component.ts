
import { GloblaService } from './../../../../assets/service/global.service';
import { CompanyApiService } from './../../../services/company-api.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
    public router: Router,
    private modalService: NgbModal,
    private companyApi: CompanyApiService,
    private accountApi: AccountApiService,
    private toast: ToastrService,
    private globalservice: GloblaService,
    private employeeService: EmployeeApiService,
  ) {}
  public loading = false;
  iconIsActive: boolean;
  Companies = [];
  Account = {};
  Company: {};

  account: {
    address: '',
    email: '',
    fullname: '',
    gender: boolean,
    phone: '',
  };

  inputCompany = {};
  inputManager = {};

  searchText = "";

  updateCompany = {
    companyId: 0,
    name: '',
    address: '',
    phone: '',
  };
  updateStatus = [];
  check = true;
  isLoaded = false

  ngOnInit() {
    this.getCompanyIsActive();
    this.restartData();
  }

  open(content) {
    this.modalService.open(content, {backdrop: 'static', size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }).catch((error) => {
    });
  }

  restartData() {
    this.inputCompany = {
      name: '',
      address: '',
      phone: '',
      isActive: true,
    };
    this.inputManager = {
      fullname: '',
      phone: '',
      email: '',
      address: '',
      gender: true,
    };
  }
  closeModal() {
    this.restartData();
    this.modalService.dismissAll();
  }

  openDetail(content, companyId) {
    this.getCompanyById(companyId);
    this.modalService.open(content, {backdrop: 'static' ,ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }).catch((error) => {
    });;
  }

  clickButtonRefresh(refesh) {
    refesh.classList.add('spin-animation');
    setTimeout(function () {
      refesh.classList.remove('spin-animation');
    }, 500);
    this.getCompanyIsActive();
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
          this.loading = true;
          this.companyApi.disableCompany(this.updateStatus, status).subscribe(data => {
            this.loading = false;
            this.getCompanyIsActive();
            this.closeModal();
            this.toast.success('The company has been deleted');
            this.updateStatus = [];
          }, (error) => {
            if (error.status == 0) {
              this.toast.error('Server is not availiable');
            }
            if (error.status == 404) {
              this.toast.error('Not found');
            }
            if (error.status == 500) {
              this.toast.error('Server error');
            }
            this.loading = false;
            this.closeModal();
          });
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
          this.loading = true;
          this.companyApi.disableCompany(this.updateStatus, status).subscribe(data => {
            this.loading = false;
            this.getCompanyIsActive();
            this.closeModal();
            Swal.fire('Success', 'The company has been enabled', 'success');
          }, (error) => {
            if (error.status == 0) {
              this.toast.error('Server is not availiable');
            }
            if (error.status == 404) {
              this.toast.error('Not found');
            }
            if (error.status == 500) {
              this.toast.error('Server error');
            }
            this.loading = false;
            this.closeModal();
          });;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.loading = false
        }
      });
    }
  }

  ChangeStatus(status: boolean, companyModel) {
    this.updateStatus = [];
    companyModel.IsActive = status;
    this.updateStatus.push(companyModel);
    this.companyApi.disableCompany(this.updateStatus, status);
  }

  checkSelected(companyId) {
    var index = this.Companies.findIndex(x => x.companyId == companyId);
    this.Companies[index].selected = !this.Companies[index].selected;
    if (this.Companies[index].selected == false) {
      this.updateStatus.splice(this.Companies.indexOf(companyId), 1);
    } else {
      this.updateStatus.push(companyId);
    }
  }

  isLoadDetail = false;
  getCompanyById(companyId) {
    this.loading = true;
    this.isLoadDetail = false;
    this.companyApi.getCompanyById(companyId).subscribe(
      (data) => {
        this.loading = false;
        this.isLoadDetail = true;
        this.account = data['accountDTO'];
        this.updateCompany = data['companyDTO'];
      },
      (error) => {
        if (error.status == 0) {
          this.toast.error('Server is not availiable');
        }
        if (error.status == 404) {
          this.toast.error('Not found');
        }
        if (error.status == 500) {
          this.toast.error('Server error');
        }
        this.loading = false;
        this.closeModal()
      }
    );
  }

  getCompanyIsActive() {
    this.loading = true;
    this.companyApi.getAllCompany().subscribe(
      (data: any[]) => {
        this.loading = false;
        this.Companies = data;
        this.Companies.forEach(element => {
          element.selected = false;
        });
        this.isLoaded = true
      },
      (error) => {
        if (error.status == 0) {
          this.toast.error('Server is not availiable');
        }
        if (error.status == 404) {
          this.toast.error('Not found');
        }
        if (error.status == 500) {
          this.toast.error('Server error');
        }
        this.loading = false;
        this.closeModal()
      }
    );
  }

  getAccountManager(id: number) {
    this.accountApi.getManagerByCompanyId(id).subscribe(
      (data) => {
        this.Account = data;
      }
    ), (error) => {
      this.toast.error(error.name);
      this.loading = false;
    };

  }

  search() {
    if (this.searchText == "") {
      this.getCompanyIsActive();
    }
    else {
      this.companyApi.getCompanyByName(this.searchText).subscribe(
        (data : any[]) => {
          this.Companies = data;
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
          this.loading = true;
          this.companyApi.insertCompany(inputCompanyData).subscribe(data => {
            this.getCompanyIsActive();
            this.closeModal();
            this.toast.success('Create company successful');
            this.loading = false;
          }, (error) => {
            if (error.status == 0) {
              this.toast.error('Server is not availiable');
            }
            if (error.status == 400) {
              this.toast.error('Company name is exist');
            }
            if (error.status == 500) {
              this.toast.error('Server error');
            }
            this.loading = false;
          });

        }
      });
    }
  }

  Update() {
    this.validateUpdate();
    if (this.check == false) {
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
          this.getCompanyIsActive();
          this.closeModal();
          this.toast.success('Update company successful');
          this.loading = false;
        }, (error) => {
          if (error.status == 0) {
            this.toast.error('Server is not availiable');
          }
          if (error.status == 400) {
            this.toast.error('Company name is exist');
          }
          if (error.status == 500) {
            this.toast.error('Server error');
          }
          this.loading = false;
          this.closeModal()
        });


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.updateStatus = [];
        this.closeModal();
      }
    });
  }

  validateCompanyName() {
    this.inputCompany['name'] = $.trim(this.inputCompany['name'].replace(/\s\s+/g, ' ')).toUpperCase();
    $("#companyName").css("border-color", "");
    if (this.inputCompany['name'] == "" || this.inputCompany['name'] == undefined) {
      this.toast.error('Please input company\'s name');
      $("#companyName").css("border-color", "red");
      return false;
    }
    else if (this.inputCompany['name'].length < 3) {
      this.toast.error('Please input comapany name min 3 characters');
      $("#companyName").css("border-color", "red");
      return false;
    }
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].name == this.inputCompany['name']) {
        this.toast.error('Company\'s name is exist');
        $("#companyName").css("border-color", "red");
        return false;
      }
    }

  }

  validateCompanyAddress() {
    this.inputCompany['address'] = $.trim(this.inputCompany['address'].replace(/\s\s+/g, ' '));
    $("#companyAddress").css("border-color", "");
    if (this.inputCompany['address'] == null || this.inputCompany['address'] == '') {
      this.toast.error('Please input address of company');
      $("#companyAddress").css("border-color", "red");
      return false
    } else if (this.inputCompany['address'].length < 3) {
      this.toast.error('Please input company address min 3 characters');
      $("#companyAddress").css("border-color", "red");
      return false
    }
    else if (this.inputCompany['address'].length > 200) {
      this.toast.error('Please input company address max 200 characters');
      $("#companyAddress").css("border-color", "red");
      return false;
    }
  }

  validateCompanyPhone() {
    this.inputCompany['phone'] = $.trim(this.inputCompany['phone'].replace(/\s\s+/g, ' '))
    $("#companyPhone").css("border-color", "");
    const checkphone = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.inputCompany['phone']);
    if (this.inputCompany['phone'] == null || this.inputCompany['phone'] == '') {
      this.toast.error('Message', 'Please input phone of company');
      $("#companyPhone").css("border-color", "red");
      return false
    } else if (!checkphone) {
      this.toast.error('Message', 'Company\'s Phone number is invalid');
      $("#companyPhone").css("border-color", "red");
      return false;
    }
  }

  validateManagerFullName() {
    this.inputManager['fullname'] = $.trim(this.inputManager['fullname'].replace(/\s\s+/g, ' ')).toUpperCase();
    $("#managerFullname").css("border-color", "");
    var str = this.inputManager['fullname'].split(" ");

    if (this.inputManager['fullname'] == "" || this.inputManager['fullname'] == null) {
      this.toast.error('Please input manager\'s name');
      $("#managerFullname").css("border-color", "red");
      return false
    }
    else if (str.length < 2) {
      this.toast.error('Manager\'s name min 2 letter');
      $("#managerFullname").css("border-color", "red");
      return false
    }
  }

  validateManagerMail() {
    $("#managerEmail").css("border-color", "");
    this.inputManager['email'] = $.trim(this.inputManager['email'].replace(/\s\s+/g, ' '));
    if (this.inputManager['email'] == "" || this.inputManager['email'] == null) {
      this.toast.error('Please input manager\'s email');
      $("#managerEmail").css("border-color", "red");
      return false
    }
    else if (!this.globalservice.checkMail.test(String(this.inputManager['email']).toUpperCase())) {
      this.toast.error('Manager email wrong format');
      $("#managerEmail").css("border-color", "red");
      return false
    }
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].managerMail == this.inputManager['email']) {
        this.toast.error('Manager\'s mail is exist');
        $("#managerEmail").css("border-color", "red");
        return false;
      }
    }
  }

  validateManagerPhone() {
    $("#managerPhone").css("border-color", "");
    this.inputManager['phone'] = $.trim(this.inputManager['phone'].replace(/\s\s+/g, ' '));
    const checkphoneManager = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.inputManager['phone']);
    if (this.inputManager['phone'] == null || this.inputManager['phone'] == '') {
      this.toast.error('Please input phone of manager');
      $("#managerPhone").css("border-color", "red");
      return false
    } else if (!checkphoneManager) {
      this.toast.error('Manager\'s Phone number is invalid');
      $("#managerPhone").css("border-color", "red");
      return false
    }
  }
  validdate() {
    this.check = true;
    $("#companyName").css("border-color", "");
    $("#companyAddress").css("border-color", "");
    $("#companyPhone").css("border-color", "");
    $("#managerFullname").css("border-color", "");
    $("#managerEmail").css("border-color", "");
    $("#managerPhone").css("border-color", "");
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].name == this.inputCompany['name']) {
        this.toast.error('Company\'s name is exist');
        $("#companyName").css("border-color", "red");
        this.check = false;
      }
      else if (this.Companies[i].managerMail == this.inputManager['email']) {
        this.toast.error('Manager\'s mail is exist');
        $("#managerEmail").css("border-color", "red");
        this.check = false;
      }
    }
    if (this.inputCompany['name'] == "" || this.inputCompany['name'] == null) {
      this.toast.error('Please input company\'s name');
      $("#companyName").css("border-color", "red");
      this.check = false;
    }
    else if (this.inputCompany['name'].length < 3) {
      this.toast.error('Please input comapany name min 3 characters');
      $("#companyName").css("border-color", "red");
      this.check = false;
    }
    if (this.inputCompany['address'] == null || this.inputCompany['address'] == '') {
      this.toast.error('Please input address of company');
      $("#companyAddress").css("border-color", "red");
      this.check = false;
    } else if (this.inputCompany['address'].length < 3) {
      this.toast.error('Please input company address min 3 characters');
      $("#companyAddress").css("border-color", "red");
      this.check = false;
    }
    else if (this.inputCompany['address'].length > 200) {
      this.toast.error('Please input company address max 200 characters');
      $("#companyAddress").css("border-color", "red");
      this.check = false;
    }
    const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.inputCompany['phone']);
    if (this.inputCompany['phone'] == null || this.inputCompany['phone'] == '') {
      this.toast.error('Please input phone of company');
      $("#companyPhone").css("border-color", "red");
      this.check = false;
    } else if (!checkPhone) {
      this.toast.error('Company phone is invalid');
      $("#companyPhone").css("border-color", "red");
      this.check = false;
    }
    var str = this.inputManager['fullname'].split(" ");
    if (this.inputManager['fullname'] == "" || this.inputManager['fullname'] == null) {
      this.toast.error('Please input manager\'s name');
      $("#managerFullname").css("border-color", "red");
      this.check = false;
    }
    else if (str.length < 2) {
      this.toast.error('Manager\'s name min 2 characters');
      $("#managerFullname").css("border-color", "red");
      this.check = false;
    }
    if (!this.globalservice.checkMail.test(String(this.inputManager['email']).toUpperCase())) {
      this.toast.error('Manager\'s email wrong format');
      $("#managerEmail").css("border-color", "red");
      this.check = false;
    }
    const checkphoneManager = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.inputManager['phone']);
    if (this.inputManager['phone'] == null || this.inputManager['phone'] == '') {
      this.toast.error('Please input phone of manager');
      $("#managerPhone").css("border-color", "red");
      this.check = false;
    } else if (!checkphoneManager) {
      this.toast.error('Manager\'s Phone number is invalid');
      $("#managerPhone").css("border-color", "red");
      this.check = false;
    }
    return this.check;
  }

  validateUpdateCompanyName() {
    this.updateCompany['name'] = $.trim(this.updateCompany['name'].replace(/\s\s+/g, ' ')).toUpperCase();
    $("#updateCompanyName").css("border-color", "");
    if (this.updateCompany['name'] == "" || this.updateCompany['name'] == undefined) {
      this.toast.error('Please input company\'s name');
      $("#updateCompanyName").css("border-color", "red");
      return false
    }
    else if (this.updateCompany['name'].length < 3) {
      this.toast.error('Please input comapany name min 3 characters');
      $("#updateCompanyName").css("border-color", "red");
      return false
    }
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].name == this.updateCompany['name'] && this.Companies[i].companyId != this.updateCompany.companyId) {
        this.toast.error('Company\'s name is exist');
        $("#updateCompanyName").css("border-color", "red");
        return false;
      }
    }
  }

  validateUpdateCompanyAddress() {
    this.updateCompany['address'] = $.trim(this.updateCompany['address'].replace(/\s\s+/g, ' '));
    $("#updateCompanyAddress").css("border-color", "");
    if (this.updateCompany['address'] == null || this.updateCompany['address'] == '') {
      this.toast.error('Please input address of company');
      $("#updateCompanyAddress").css("border-color", "red");
      return false
    } else if (this.updateCompany['address'].length < 3) {
      this.toast.error('Please input company address min 3 characters');
      $("#updateCompanyAddress").css("border-color", "red");
      return false
    }
    else if (this.updateCompany['address'].length > 200) {
      this.toast.error('Please input company address max 200 characters');
      $("#updateCompanyAddress").css("border-color", "red");
      return false
    }
  }

  validateUpdateCompanyPhone() {
    this.updateCompany['phone'] = $.trim(this.updateCompany['phone'].replace(/\s\s+/g, ' '));
    $("#updateCompanyPhone").css("border-color", "");
    const checkphone = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.updateCompany['phone']);
    if (this.updateCompany['phone'] == null || this.updateCompany['phone'] == '') {
      $("#updateCompanyPhone").css("border-color", "red");
      return false;
    } else if (!checkphone) {
      this.toast.error('Company\'s Phone number is invalid');
      $("#updateCompanyPhone").css("border-color", "red");
      return false;
    }
  }

  validateUpdate() {
    this.check = true;
    $("#updateCompanyName").css("border-color", "");
    $("#updateCompanyAddress").css("border-color", "");
    $("#updateCompanyPhone").css("border-color", "");
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].name == this.updateCompany['name'] && this.Companies[i].companyId != this.updateCompany.companyId) {
        this.toast.error('Company\'s name is exist');
        $("#updateCompanyName").css("border-color", "red");
        this.check = false;
      }
    }
    if (this.updateCompany['name'] == "" || this.updateCompany['name'] == undefined) {
      this.toast.error('Please input company\'s name');
      $("#updateCompanyName").css("border-color", "red");
      this.check = false;
    }
    else if (this.updateCompany['name'].length < 3) {
      this.toast.error('Please input comapany name min 3 characters');
      $("#updateCompanyName").css("border-color", "red");
      this.check = false;
    }
    if (this.updateCompany['address'] == null || this.updateCompany['address'] == '') {
      this.toast.error('Please input address of company');
      $("#updateCompanyAddress").css("border-color", "red");
      this.check = false;
    } else if (this.updateCompany['address'].length < 3) {
      this.toast.error('Please input company address min 3 characters');
      $("#updateCompanyAddress").css("border-color", "red");
      this.check = false;
    }
    else if (this.updateCompany['address'].length > 200) {
      this.toast.error('Please input company address max 200 characters');
      $("#updateCompanyAddress").css("border-color", "red");
      this.check = false;
    }
    const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.updateCompany['phone']);
    if (!checkPhone) {
      this.toast.error('Company phone is invalid');
      $("#updateCompanyPhone").css("border-color", "red");
      this.check = false;
    }
  }

  viewAccount(item) {
    localStorage.setItem('CompanyId', item['companyId']);
    this.router.navigate(['/manage-company-account/']);
  }

}
