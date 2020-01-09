import { EmployeeApiService } from 'src/app/services/employee-api.service';
import { option1, option2, option0, Point } from './data';
import { RankApiService } from './../../../services/rank-api.services';
import { CatalogueApiService } from './../../../services/catalogue-api.service';
import { ConfigurationApiService } from './../../../services/configuration-api.service';
import { CompanyApiService } from '../../../services/company-api.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import Stepper from 'bs-stepper';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $: any;
@Component({
  selector: 'manage-configuration',
  templateUrl: './manage-configuration-applicant.component.html',
  styleUrls: ['./manage-configuration-applicant.component.scss']
})
export class ManageConfigurationApplicantComponent implements OnInit {
  public rateCataOfRank: number[] = []
  constructor(
    public router: Router,
    private modalService: NgbModal,
    private companyApi: CompanyApiService,
    private configAPi: ConfigurationApiService,
    private catalogueApi: CatalogueApiService,
    private rankApi: RankApiService,
    private toast: ToastrService,
    private employeeApi: EmployeeApiService,
  ) {
    this.page = 1;
    this.pageSize = 25;
  }
  public loading = false;
  startDate: Date = new Date();
  settings1 = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: false,
  };
  settings2 = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: true,
  };
  point: number[][];
  private stepper: Stepper;
  index = 1;
  indexDetail = 1;
  iconIsActive: boolean;
  page: number;
  pageSize: number;
  element: HTMLElement;
  selectedAll: any;
  selectedAllRank: any;
  selectRank = [];
  selectConfiguration = [];
  Configurations = [];
  ConfigurationsCata = [];
  inputAllConfig = [];
  catalogueInRank = [];

  Account = {};
  ListRank = [];
  a = {};
  catalogueList = [];
  inputConfiguration = {};
  inputManager = {};

  searchText = '';

  updateCompany = {};
  updateConfig = {};
  updateStatus = [];

  ansForm: FormGroup;
  answersForm: FormGroup;
  form: any;
  count = 1;
  answerForm: FormGroup;
  selectedItems = [];
  selectedItemsUpdate = []
  dropdownSettings = {
    singleSelection: false,
    text: 'Select Catalogue',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'form-control form-group',
    labelKey: 'name',
    primaryKey: 'companyCatalogueId',
    maxHeight: 240,
    showCheckbox: true,
    badgeShowLimit: 0,
  };
  dropdownSettingsDetail = {
    singleSelection: false,
    text: 'Select Catalogue',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'form-control form-group',
    labelKey: 'name',
    primaryKey: 'companyCatalogueId',
    maxHeight: 240,
    showCheckbox: true,
    badgeShowLimit: 0,
  };

  PageSize(test: number) {
    this.pageSize = test;
  }

  companyId = localStorage.getItem('CompanyId');
  employeeInCompany = [];
  isSampleConfig = false;
  catalogueInRanks: number[][];
  loadData = false;

  ngOnInit() {
    this.getAllRank(true);
    this.getAllCatalogue();
    this.getConfigurationIsActive(true);
  }

  onDeSelectAll(item: any) {
    this.selectedItems = []
  }

  removeItem(item, select) {

    for (let i = 0; i < select.length; i++) {
      if (select[i]['catalogueId'] == item['catalogueId']) {
        select.splice(i, 1);
        this.updateConfig['catalogueInConfigs'].splice(i, 1);
      }
    }
  }

  onItemUpdateSelect(item) {
    this.updateConfig['catalogueInConfigs'].push(item);
  }

  OnItemUpdateDeSelect(item) {
    for (let i = 0; i < this.updateConfig['catalogueInConfigs'].length; i++) {
      if (this.updateConfig['catalogueInConfigs'][i]['catalogueId'] == item['catalogueId']) {
        this.updateConfig['catalogueInConfigs'].splice(i, 1);
      }
    }
  }
  open(content) {
    if (this.catalogueList.length == 0) {
      this.toast.error('No catalogue to config');
      return;
    }
    if (this.catalogueList.length < 3) {
      this.toast.error('Please insert question to at least three catalogues');
      return;
    }
    this.index = 1;
    this.startDate = new Date();

    this.inputConfiguration['title'] = "";
    this.inputConfiguration['accountId'] = localStorage.getItem("AccountId");
    this.inputConfiguration['title'] = '';
    this.inputConfiguration['type'] = false;
    this.inputConfiguration['duration'] = 15;
    this.inputConfiguration['startDate'] = this.startDate;
    this.selectedItems = [];
    this.getAllRank(true);
    this.modalService.open(content, { size: 'lg', windowClass: 'myCustomModalClass' });
    const a = document.querySelector('#stepper1');
    this.stepper = new Stepper(a, {
      linear: false,
      animation: true
    });
  }

  openDetail(content, id: number) {
    this.indexDetail = 1;
    this.GetConfigurationCatalogueByConfigId(id);
    this.modalService.open(content, { size: 'lg', windowClass: 'myCustomModalClass' });
    const a = document.querySelector('#update');
    this.stepper = new Stepper(a, {
      linear: false,
      animation: true
    });
  }

  calculateRank() {
    for (var i = 0; i < this.ListRank.length; i++) {
      this.ListRank[i].weightPoint = 0;
    }

    for (var i = 0; i < this.ListRank.length; i++) {
      for (var y = 0; y < this.selectedItems.length; y++) {
        this.ListRank[i].weightPoint += Number($('#' + this.selectedItems[y].companyCatalogueId + "_" + this.ListRank[i].companyRankId).val()) * (this.selectedItems[y].weightPoint / 100);
      }
    }
  }

  next() {
    if (this.validateConfiguration() === false) {
      return;
    }
    this.calculateRank();
    this.stepper.next();
    this.index = this.index + 1;
    this.inputConfiguration['startDate'] = this.startDate;
    if (this.index == 3) {
      this.catalogueInRank = [];
      for (var x = 0; x < this.selectedItems.length; x++) {
        this.selectedItems[x].CatalogueInRankDTO = [];
      }
      for (var i = 0; i < this.ListRank.length; i++) {
        for (var j = 0; j < this.selectedItems.length; j++) {
          var key = this.selectedItems[j].companyCatalogueId + "_" + this.ListRank[i].companyRankId;
          var cir = {
            "catalogueId": this.selectedItems[j].companyCatalogueId,
            "weightPoint": ($('#' + key).val()) / 100,
            "isActive": true
          }
          var cirShow = {
            "companyRankId": this.ListRank[i].companyRankId,
            "name": this.selectedItems[j].name,
            "rank": this.ListRank[i].name,
            "point": $('#' + key).val(),
          }
          this.selectedItems[j].CatalogueInRankDTO.push(cirShow)
          this.catalogueInRank.push(cirShow)
        }
      }
    }
  }

  nextDetail() {
    this.stepper.next();
    this.indexDetail += 1;
  }

  back() {
    this.index = this.index - 1;
    this.stepper.previous();
  }

  backDetail() {
    this.indexDetail = this.indexDetail - 1;
    this.stepper.previous();
  }

  closeModal() {
    this.modalService.dismissAll();
    this.index = 1;
  }

  getAllRank(status: boolean) {
    this.rankApi.getAllRank(status, this.companyId).subscribe(
      (data: any[]) => {
        let tmp = []
        tmp = data;
        for (var i = 0; i < tmp.length; i++) {
          if (tmp[i].name == "DEV0") {
            tmp.splice(i, 1);
            break;
          }
        }
        this.ListRank = tmp;
      },
      (error) => {
        this.loading = false;
        this.toast.error(error.name);
      }
    );

  }

  getAllCatalogue() {
    let tmp: any;
    this.catalogueApi.getAllCatalogue(true, this.companyId).subscribe(
      (data) => {
        tmp = data;
        for (let i = 0; i < data.length; i++) {
          if (tmp[i].quescount == 0) {
            tmp.splice(i, 1);
            i--
          }
        }
        this.catalogueList = tmp;
      },
      (error) => {
        this.loading = false;
        this.toast.error(error.name);
      }
    );
  }

  clickButtonRefresh(refesh) {
    refesh.classList.add('spin-animation');
    setTimeout(function () {
      refesh.classList.remove('spin-animation');
    }, 500);
    this.getConfigurationIsActive(true);
  }


  getConfigurationIsActive(status: boolean) {
    this.loading = true;
    this.iconIsActive = status;
    this.configAPi.getAllConfiguration(false, this.companyId).subscribe(
      (data) => {
        this.loading = false;
        this.Configurations = data;
      },
      (error) => {
        this.loading = false;
        this.toast.error(error.name);
      }
    );
  }

  GetConfigurationCatalogueByConfigId(id: number) {
    this.loading = true;
    this.configAPi.GetConfigurationCatalogueByConfigId(id).subscribe(
      (res) => {
        this.updateConfig['configId'] = res['configId'];
        this.updateConfig['accountId'] = res['testOwnerId'];
        this.updateConfig['type'] = res['type'];
        this.updateConfig['title'] = res['title'];
        this.updateConfig['createDate'] = res['createDate'];
        this.updateConfig['startDate'] = moment.utc(res['startDate']).local();
        this.updateConfig['duration'] = res['duration'];
        this.updateConfig['isActive'] = res['isActive'];
        this.updateConfig['catalogueInConfigs'] = res['catalogueInConfigurationDTO'];

        let tmp = res['catalogueInConfigurationDTO'];
        this.selectedItemsUpdate = [];
        //khoi tao mang 2 chieu theo catalogue
        var numberCatalogue = res['catalogueInConfigurationDTO'][0].catalogueInRankDTO.length;
        var numberRank = res['catalogueInConfigurationDTO'].length - 1
        this.catalogueInRanks = new Array(numberCatalogue).fill(0);

        //khoi tao mang 2 chieu theo rank ung voi tung catalogue
        for (let i = 0; i < this.catalogueInRanks.length; i++) {
          this.catalogueInRanks[i] = new Array(numberRank).fill(0);
        }
        var h = 0;
        var c = 0;
        // doc data theo tung rank
        for (var i = 0; i < numberRank; i++) {
          // lay weight point cua catalogue theo rank
          for (var j = 0; j < numberCatalogue; j++) {
            this.catalogueInRanks[h][c] = res['catalogueInConfigurationDTO'][i].catalogueInRankDTO[j].point;
            h++
          }
          c++
          h = 0;
        }
        tmp.forEach(x => {
          this.selectedItemsUpdate.push(new Object(
            {
              catalogueInConfigId: x.catalogueInConfigId,
              configId: x.configId,
              catalogueId: x.catalogueId,
              weightPoint: x.weightPoint,
              isActive: x.isActive,
            }
          ));
        });
        console.log(this.catalogueInRanks)
        this.loading = false;
        this.loadData = true;
      },
      (error) => {
        this.loading = false;
        this.toast.error(error.name);
      }
    );
  }

  selectAll() {
    this.selectConfiguration = [];
    for (let i = 0; i < this.Configurations.length; i++) {
      this.Configurations[i].selected = this.selectedAll;
      this.selectConfiguration.push(this.Configurations[i]);
    }
  }

  checkIfAllSelected() {
    this.selectConfiguration = [];
    this.selectedAll = this.Configurations.every(function (item: any) {
      return item.selected === true;
    });
    for (let i = 0; i < this.Configurations.length; i++) {
      if (this.Configurations[i].selected === true) {
        this.selectConfiguration.push(this.Configurations[i]);
      }
    }
  }

  Sample() {
    const sampleTest = {
      companyId: this.companyId,
      catalogueInConfigurations: this.selectedItems
    }
    localStorage.setItem("SampleTest", JSON.stringify(sampleTest));
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.setAttribute('target', '_blank');
    link.href = '/sample-test';
    document.body.appendChild(link);
    link.click();
    link.remove();

  }

  Create() {
    this.loading = false;
    if (this.inputConfiguration['duration'] === '') {
      Swal.fire('Error', 'Something went wrong', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'The configuration will be create!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.inputConfiguration['CatalogueInConfigurationDTO'] = this.selectedItems;
        this.inputConfiguration['startDate'] = new Date(this.inputConfiguration['startDate']);
        console.log(this.inputConfiguration);
        this.configAPi.createConfigurartion(this.inputConfiguration).subscribe(data => {
          this.getConfigurationIsActive(true);
          this.closeModal();
          localStorage.removeItem('SampleTest');
          this.index = 1;
          Swal.fire('Success', 'The configuration has been created', 'success');
        }, (error) => {
          this.getConfigurationIsActive(true);
          this.closeModal();
          this.index = 1;
          this.loading = false;
        });
      }
    });
  }

  Update() {
    this.loading = false;
    Swal.fire({
      title: 'Are you sure?',
      text: 'The configuration will be update!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        let request = Object.assign({}, this.updateConfig);
        if (typeof (request['startDate']) === 'string') {
          request['startDate'] = moment(request['startDate']);
        }
        this.configAPi.updateConfiguration(request).subscribe(data => {
          this.getConfigurationIsActive(true);
          this.closeModal();
          this.indexDetail = 1;
          Swal.fire('Success', 'The configuration has been updated', 'success');
        }, (error) => {
          this.toast.error(error.name);
          this.loading = false;
        });
      }
    });

  }

  DisableConfiguration(status: boolean) {
    this.loading = false;
    if (status === false) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'The config will be delete!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          this.configAPi.changeStatusConfiguration(this.selectConfiguration, status).subscribe(data => {
            this.getConfigurationIsActive(true);
            this.closeModal();
            Swal.fire('Success', 'The configuration has been deleted', 'success');
          }, (error) => {
            this.toast.error(error.name);
            this.loading = false;
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.updateStatus = [];
          this.closeModal();
        }
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'The configuration will be enable!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, enable it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          for (let i = 0; i < this.selectConfiguration.length; i++) {
            this.selectConfiguration[i].isActive = status;
          }
          this.configAPi.changeStatusConfiguration(this.selectConfiguration,status).subscribe(data => {
            this.getConfigurationIsActive(true);
            this.closeModal();
            Swal.fire('Success', 'The configuration has been enabled', 'success');
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

  validateUpdateConfiguration() {

  }

  validateConfiguration() {
    if (this.inputConfiguration['title'] == "") {
      this.toast.error('Message', 'Please input title config');
      return false;
    }
    else if (this.inputConfiguration['title'].length > 20) {
      this.toast.error('Message', 'The maximum exam name is 20');
      return false;
    } else if (this.inputConfiguration['duration'] < this.selectedItems.length * 5 || this.inputConfiguration['duration'] > 180) {
      this.toast.error('Message', 'duration must be range ' + this.selectedItems.length * 5 + '\'' + ' to 200\'');
      this.inputConfiguration['duration'] = this.selectedItems.length * 5
      return false;
    } else if (this.selectedItems.length === 0) {
      this.toast.error('Message', 'Please select the catalogue');
      return false;
    } else if (this.selectedItems.length < 3) {
      this.toast.error('Message', 'please select minimum 3 catalogues');
      return false;
    }
    else if ($('#mark').val() === '') {
      this.toast.error('Message', 'Please input rate of catalogue');
      return false;
    }
    let total = 0;
    for (let i = 0; i < this.selectedItems.length; i++) {
      total = this.selectedItems[i]['weightPoint'] + total;
    }
    if (total !== 100) {
      this.toast.error('Message', 'please input total point of catalogue must be 100');
      return false;
    } else if (this.index === 2) {
      
      for (var i = 0; i < this.selectedItems.length; i++) {
        for (var z = 0; z < this.ListRank.length; z++) {
          $('#' + this.selectedItems[i].companCatalogueId + "_" + this.ListRank[z].companyRankId).css("border-color", "");
          if ($('#' + this.selectedItems[i].companyCatalogueId + "_" + this.ListRank[z].companyRankId).val() > 100) {
            this.toast.error('Please input value smaller than 100');
            $('#' + this.selectedItems[i].companyCatalogueId + "_" + this.ListRank[z].companyRankId).focus();
            $('#' + this.selectedItems[i].companyCatalogueId + "_" + this.ListRank[z].companyRankId).css("border-color", "red");
            return false;
          }
        }
      }
    }
  }

  sendMail(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The mail will be send to employee!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.configAPi.sendMail(id).subscribe(data => {
          this.loading = false;
          Swal.fire('Success', 'The mail has been send', 'success');
        }, (error) => {
          this.toast.error(error.name);
          this.loading = false;
        });
      }
    },

    );
  }

  checkIfRankSelected() {
    this.selectRank = [];
    this.selectedAllRank = this.ListRank.every(function (item: any) {

      return item.selected == true;
    })
    for (var i = 0; i < this.ListRank.length; i++) {
      if (this.ListRank[i].selected == true) {
        this.selectRank.push(this.ListRank[i])
      }
    }
  }

  cloneConfig(configId) {
    console.log(configId)

  }

  viewTest(id) {
    this.router.navigate(['/manage-test/', id]);
  }
}
