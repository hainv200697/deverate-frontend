import { EmployeeApiService } from 'src/app/services/employee-api.service';
import { option1, option2, option0, Point } from './data';
import { RankApiService } from './../../../services/rank-api.services';
import { CatalogueApiService } from './../../../services/catalogue-api.service';
import { ConfigurationApiService } from './../../../services/configuration-api.service';
import { CompanyApiService } from '../../../services/company-api.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import Stepper from 'bs-stepper';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { analyzeAndValidateNgModules } from '@angular/compiler';
declare var $: any;
@Component({
  selector: 'manage-configuration',
  templateUrl: './manage-configuration.component.html',
  styleUrls: ['./manage-configuration.component.scss']
})
export class ManageConfigurationComponent implements OnInit {
  public rateCataOfRank: number[] = []
  constructor(
    private translate: TranslateService,
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
    this.pageSize = 5;
  }
  public loading = false;
  startDate: Date = new Date();

  endDate: Date = new Date();
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
    primaryKey: 'catalogueId',
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
    primaryKey: 'catalogueId',
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

  ngOnInit() {
    this.getAllRank(true);
    this.getAllCatalogue();
    this.getConfigurationIsActive(true);
    this.getAllEmployee();
  }

  onItemSelect(item: any) {
    this.inputConfiguration['totalQuestion'] += 5;
  }

  onSelectAll(item: any) { }

  onDeSelectAll(item: any) {
    this.selectedItems = []
  }

  OnItemDeSelect(item: any) {
    this.inputConfiguration['totalQuestion'] -= 5;
  }

  onDateSelect(item: any) {
  }

  removeItem(item, select) {

    for (let i = 0; i < select.length; i++) {
      if (select[i]['catalogueId'] == item['catalogueId']) {
        select.splice(i, 1);
        this.updateConfig['catalogueInConfigurations'].splice(i, 1);
      }
    }
  }

  onItemUpdateSelect(item) {
    this.updateConfig['catalogueInConfigurations'].push(item)
    console.log(item)
  }

  OnItemUpdateDeSelect(item) {
    for (let i = 0; i < this.updateConfig['catalogueInConfigurations'].length; i++) {
      if (this.updateConfig['catalogueInConfigurations'][i]['catalogueId'] == item['catalogueId']) {
        this.updateConfig['catalogueInConfigurations'].splice(i, 1);
        this.updateConfig['catalogueInConfigurations'].splice(i, 1);
      }
    }
  }
  open(content) {
    if (this.catalogueList.length == 0) {
      this.toast.error('No catalogue to config');
      return;
    }
    this.index = 1;
    this.startDate = new Date();

    this.endDate = new Date();
    this.inputConfiguration['title'] = "";
    this.inputConfiguration['testOwnerId'] = localStorage.getItem("AccountId");
    this.inputConfiguration['totalQuestion'] = 0;
    this.inputConfiguration['title'] = '';
    this.inputConfiguration['type'] = true;
    this.inputConfiguration['duration'] = 15;
    this.inputConfiguration['startDate'] = this.startDate;
    this.inputConfiguration['endDate'] = this.endDate.setDate(this.startDate.getDate() + 1);
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
    for (var i = 0; i < this.selectedItems.length; i++) {
      this.ListRank[0].weightPoint += Number($('#' + this.selectedItems[i].catalogueId + "_" + this.ListRank[0].rankId).val()) * (this.selectedItems[i].weightPoint / 100);
      this.ListRank[1].weightPoint += Number($('#' + this.selectedItems[i].catalogueId + "_" + this.ListRank[1].rankId).val()) * (this.selectedItems[i].weightPoint / 100);
      this.ListRank[2].weightPoint += Number($('#' + this.selectedItems[i].catalogueId + "_" + this.ListRank[2].rankId).val()) * (this.selectedItems[i].weightPoint / 100);
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
    this.inputConfiguration['endDate'] = this.endDate;
    if (this.index == 3) {
      this.catalogueInRank = [];

      for (var i = 0; i < this.ListRank.length; i++) {
        this.ListRank[i].catalogueInRank = [];

        for (var j = 0; j < this.selectedItems.length; j++) {
          var key = this.selectedItems[j].catalogueId + "_" + this.ListRank[i].rankId;
          var cir = {
            "catalogueId": this.selectedItems[j].catalogueId,
            "weightPoint": ($('#' + key).val()) / 100,
            "isActive": true
          }
          var cirShow = {
            "catalogueId": this.selectedItems[j].catalogueId,
            "name": this.selectedItems[j].name,
            "rank": this.ListRank[i].name,
            "weightPoint": $('#' + key).val(),
          }
          this.ListRank[i].catalogueInRank.push(cirShow);
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
    this.rankApi.getAllRank(status).subscribe(
      (data) => {
        let tmp = []
        tmp = data['data']['data'];
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
    this.configAPi.getAllConfiguration(status, this.companyId).subscribe(
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
      (data) => {
        this.updateConfig['ConfigId'] = data['data']['data']['configId'];
        this.updateConfig['testOwnerId'] = data['data']['data']['testOwnerId'];
        this.updateConfig['type'] = data['data']['data']['type'];
        this.updateConfig['title'] = data['data']['data']['title'];
        this.updateConfig['totalQuestion'] = data['data']['data']['totalQuestion'];
        this.updateConfig['createDate'] = data['data']['data']['createDate'];
        this.updateConfig['startDate'] = data['data']['data']['startDate'];
        this.updateConfig['endDate'] = data['data']['data']['endDate'];
        this.updateConfig['duration'] = data['data']['data']['duration'];
        this.updateConfig['isActive'] = data['data']['data']['isActive'];
        this.updateConfig['catalogueInConfigurations'] = data['data']['data']['catalogueInConfigs'];
        this.updateConfig['configurationRank'] = data['data']['data']['configurationRanks'];
        this.selectedItemsUpdate = data['data']['data']['catalogueInConfigs'];
        let tmp = data['data']['data']['catalogueInConfigs'];
        tmp.forEach(x => {
          this.selectedItemsUpdate.push(new Object(
            {
              cicId: x.cicId,
              configId: x.configId,
              catalogueId: x.catalogueId,
              catalogueName: x.catalogueName,
              weightPoint: x.weightPoint,
              isActive: x.isActive,
            }
          ));
        });
        this.loading = false;
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
      totalQuestion: this.inputConfiguration['totalQuestion'],
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
    if (this.inputConfiguration['duration'] === '' || this.inputConfiguration['totalQuestion'] === '') {
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
        this.loading = true;
        this.inputConfiguration['catalogueInConfigurations'] = this.selectedItems;
        let dev0 = [];
        this.selectedItems.forEach(x => {
          dev0.push(new Object(
            {
              catalogueId: x.catalogueId,
              name: x.name,
              rank: x.rank,
              weightPoint: x.weightPoint,
            }
          ));
        });
        for (var i = 0; i < dev0.length; i++) {
          dev0[i].weightPoint = "0";
        }
        this.ListRank.push({
          catalogueInRank: dev0,
          rankId: 4,
          weightPoint: 0,
          isActive: true,
        })
        this.inputConfiguration['configurationRank'] = this.ListRank;
        this.inputConfiguration['startDate'] = new Date(this.inputConfiguration['startDate']);
        this.inputConfiguration['endDate'] = new Date(this.inputConfiguration['endDate']);

        this.configAPi.createConfigurartion(this.inputConfiguration).subscribe(data => {
          this.getConfigurationIsActive(true);
          this.closeModal();
          this.index = 1;
          Swal.fire('Success', 'The configuration has been created', 'success');
        }, (error) => {
          console.log(error)
          this.getConfigurationIsActive(true);
          this.closeModal();
          this.index = 1;
          this.loading = false;
        });
        console.log(this.inputConfiguration)
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
        this.configAPi.updateConfiguration(this.updateConfig).subscribe(data => {
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
        text: 'The company will be delete!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          for (let i = 0; i < this.selectConfiguration.length; i++) {
            this.selectConfiguration[i].isActive = status;
          }
          this.configAPi.changeStatusConfiguration(this.selectConfiguration).subscribe(data => {
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
          this.configAPi.changeStatusConfiguration(this.selectConfiguration).subscribe(data => {
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

  getAllEmployee() {
    this.employeeApi.getAllEmployee(this.companyId, true).subscribe(
      (data) => {

        this.employeeInCompany = data;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  validateConfiguration() {
    if (this.inputConfiguration['type'] == true && this.employeeInCompany.length == 0) {
      this.toast.error('Message', 'No employee in company');
      return false;
    }
    else if (this.inputConfiguration['title'] == "") {
      this.toast.error('Message', 'Please input title config');
      return false;
    }
    else if (this.inputConfiguration['title'].length > 20) {
      this.toast.error('Message', 'The maximum exam name is 20');
      return false;
    }
    else if (this.inputConfiguration['totalQuestion'] < 1 || this.inputConfiguration['totalQuestion'] > 100) {
      this.toast.error('Message', 'Total question must be range 1 to 100');
      this.inputConfiguration['totalQuestion'] = 0;
      return false;
    } else if (this.inputConfiguration['duration'] < 15 || this.inputConfiguration['duration'] > 180) {
      this.toast.error('Message', 'duration must be range 15 to 200');
      this.inputConfiguration['duration'] = 15
      return false;
    } else if (this.selectedItems.length === 0) {
      this.toast.error('Message', 'Please select the catalogue');
      return false;
    } else if ($('#mark').val() === '') {
      this.toast.error('Message', 'Please input rate of catalogue');
      return false;
    }
    let total = 0;
    for (let i = 0; i < this.selectedItems.length; i++) {
      total = this.selectedItems[i]['weightPoint'] + total;
    }
    if (total !== 100) {
      this.toast.error('Message', 'Total mark of catalogue must be 100');
      return false;
    } else if (this.index === 2) {
      if (this.ListRank[0].weightPoint > 100) {
        this.toast.error('Dev3\'s mark is smaller 100');
        return false;
      }
      else if (this.ListRank[2].weightPoint < 0) {
        this.toast.error('Dev1\'s mark is large 100');
        return false;
      }
      else if (this.ListRank[0].weightPoint < this.ListRank[1].weightPoint || this.ListRank[0].weightPoint < this.ListRank[2].weightPoint) {
        this.toast.error('Dev3\'s mark is highest');
        return false;
      }
      else if (this.ListRank[1].weightPoint < this.ListRank[2].weightPoint) {
        this.toast.error('Dev1\'s mark is smallest');
        return false;
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
      this.loading = true;
      if (result.value) {
        this.configAPi.sendMail(id).subscribe(data => {
          this.loading = false;
          Swal.fire('Success', 'The mail has been send', 'success');
        }, (error) => {
          this.toast.error(error.name);
          this.loading = false;
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
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

  onChangeSampleConfig(value) {
    this.inputConfiguration = {};
    this.selectedItems = [];
    if (value == "none") {
      this.inputConfiguration = option0;
      this.selectedItems = option0.selectedItems;
      this.isSampleConfig = false;
    }
    else if (value == 1) {
      this.inputConfiguration = (new Object(
        {
          duration: option1.duration,
          title: option1.title,
          totalQuestion: option1.totalQuestion,
          testOwnerId: option1.testOwnerId,
          type: option1.type,
        }
      ));
      this.catalogueList.forEach(x => {
        this.selectedItems.push(new Object(
          {
            catalogueId: x.catalogueId,
            description: x.description,
            isActive: x.isActive,
            name: x.name,
            weightPoint: x.weightPoint,
          }
        ));
      });
      for (var i = 0; i < this.selectedItems.length; i++) {
        this.selectedItems[i].weightPoint = option1.selectedItems[i].weightPoint;
      }
      this.point = Point;
      this.isSampleConfig = true;
    }
    else if (value == 2) {
      this.inputConfiguration = (new Object(
        {
          duration: option2.duration,
          title: option2.title,
          totalQuestion: option2.totalQuestion,
          testOwnerId: option2.testOwnerId,
          type: option2.type,
        }
      ));
      this.catalogueList.forEach(x => {
        this.selectedItems.push(new Object(
          {
            catalogueId: x.catalogueId,
            description: x.description,
            isActive: x.isActive,
            name: x.name,
            weightPoint: x.weightPoint,
          }
        ));
      });
      for (var i = 0; i < this.selectedItems.length; i++) {
        this.selectedItems[i].weightPoint = option2.selectedItems[i].weightPoint;
      }
      this.point = Point;
      this.isSampleConfig = true;
    }
  }

  viewTest(id) {
    this.router.navigate(['/manage-test/', id]);
  }
}
