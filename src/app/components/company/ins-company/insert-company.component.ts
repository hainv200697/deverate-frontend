
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
  ) {
    this.page = 1;
    this.pageSize = 5;
  }
  public loading = false;
  iconIsActive: boolean;
  page: number;
  pageSize: number;
  selectedAll: any;
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
    fax: '',
    phone: '',
  };
  updateManager = {};
  updateStatus = [];
  check = true;

  PageSize(test: number) {
    this.pageSize = test;
  }

  ngOnInit() {
    this.getCompanyIsActive();
    this.restartData();
  }

  open(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }).catch((error) => {
    });
  }

  restartData() {
    this.inputCompany = {
      name: '',
      address: '',
      phone: '',
      fax: '',
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
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }).catch((error) => {
    });;
  }

  selectAll() {
    if (this.updateStatus.length != 0) {
      this.updateStatus = [];
      this.Companies.forEach(element => {
        element.selected = false
      });
      return;
    }
    for (var i = 0; i < this.Companies.length; i++) {
      this.Companies[i].selected = this.selectedAll;
      this.updateStatus.push(this.Companies[i].companyId)
    }
    console.log(this.updateStatus)
  }

  clickButtonRefresh(refesh) {
    refesh.classList.add('spin-animation');
    setTimeout(function () {
      refesh.classList.remove('spin-animation');
    }, 500);
    this.getCompanyIsActive();
    this.selectedAll = false;
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
        this.loading = true;
        if (result.value) {
          this.companyApi.disableCompany(this.updateStatus, status).subscribe(data => {
            this.loading = false;
            this.getCompanyIsActive();
            this.closeModal();
            this.toast.success('The company has been deleted')
            this.selectedAll = false;
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
        else if (result.dismiss === Swal.DismissReason.cancel) {
          this.loading = false
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
        this.loading = true;
        if (result.value) {
          this.companyApi.disableCompany(this.updateStatus, status).subscribe(data => {
            this.loading = false;
            this.getCompanyIsActive();
            this.closeModal();
            Swal.fire('Success', 'The company has been enabled', 'success');
            this.selectedAll = false;
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

  checkIfAllSelected() {
    this.updateStatus = [];
    this.selectedAll = this.Companies.every(function (item: any) {
      return item.selected == true;
    })
    for (var i = 0; i < this.Companies.length; i++) {
      if (this.Companies[i].selected == true) {
        this.updateStatus.push(this.Companies[i].companyId)
      }
    }
  }

  getCompanyById(companyId) {
    this.loading = true;
    this.companyApi.getCompanyById(companyId).subscribe(
      (data) => {
        this.loading = false;
        this.account = data['data']['data'].accountDTO;
        this.updateCompany = data['data']['data'].companyDTO;
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
      (data) => {
        this.loading = false;
        console.log(data)
        this.Companies = data['data']['data'];
        console.log(this.Companies);
        this.selectedAll = false;
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
        this.Account = data['data']['data'];
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
            this.getCompanyIsActive();
            this.closeModal();
            this.toast.success('Create company successful');
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
            this.closeModal()
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
          this.closeModal()
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
          this.getCompanyIsActive();
          this.closeModal();
          this.toast.success('The mail has been send');
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
          this.closeModal()
        });
      }
    });
  }

  validateCompanyName() {
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
    $("#managerFullname").css("border-color", "");
    var str = this.inputManager['fullname'].split(" ");
    console.log(str)
    if (this.inputManager['fullname'] == "" || this.inputManager['fullname'] == null) {
      this.toast.error('Please input manager\'s name');
      $("#managerFullname").css("border-color", "red");
      return false
    }
    else if (str.length < 2) {
      this.toast.error('Manager\'s name min 2 leter');
      $("#managerFullname").css("border-color", "red");
      return false
    }
  }

  validateManagerMail() {
    $("#managerEmail").css("border-color", "");
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

}
