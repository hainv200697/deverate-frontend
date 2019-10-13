import { RankApiService } from './../../../services/rank-api.services';
import { CatalogueApiService } from './../../../services/catalogue-api.service';
import { ConfigurationApiService } from './../../../services/configuration-api.service';
import { CompanyApiService } from '../../../services/company-api.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import Stepper from 'bs-stepper';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
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
    private catalogueApi: CatalogueApiService,
    private rankApi: RankApiService,
    private toast: ToastrService,
  ) {
    this.page = 1;
    this.pageSize = 5;
  }
  public loading = false;
  startDate: Date = new Date();

  endDate: Date = new Date(this.startDate);
  settings1 = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: false,
  }
  settings2 = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: true,
  }
  private stepper: Stepper;
  index = 1;
  indexDetail = 1;
  iconIsActive: boolean;
  page: number;
  pageSize: number;
  element: HTMLElement;
  selectedAll: any;
  selectConfiguration = [];
  Configurations = [];
  ConfigurationsCata = [];
  inputAllConfig = [];

  Account = {};
  ListRank: [];
  a = {};
  catalogueList: any;
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
  dropdownSettings = {
    singleSelection: false,
    text: "Select Catalogue",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: "form-control form-group",
    labelKey: "name",
    primaryKey: "CatalogueId",
    maxHeight: 240,
    showCheckbox: true,
  };


  PageSize(test: number) {
    this.pageSize = test;
  }


  ngOnInit() {


    this.getAllRank(true);
    this.getAllCatalogue();
    this.getConfigurationIsActive(true);

  }

  onItemSelect(item: any) {
    this.inputConfiguration['totalQuestion'] += 5
    console.log(this.inputConfiguration['totalQuestion']);
  }

  onSelectAll(item: any) { }

  onDeSelectAll(item: any) { }

  OnItemDeSelect(item: any) { }

  removeItem(item) {
    for (var i = 0; i < this.selectedItems.length; i++) {
      if (this.selectedItems[i]['id'] == item['id']) {
        this.selectedItems.splice(i, 1);
      }
    }
  }

  open(content) {
    this.index = 1;
    this.inputConfiguration['testOwnerId'] = 1;
    this.inputConfiguration['totalQuestion'] = 0;
    this.inputConfiguration['duration'] = 15;
    this.inputConfiguration['startDate'] = this.startDate;
    this.inputConfiguration['endDate'] = this.endDate.setDate(this.startDate.getDate() + 1);
    this.selectedItems = [];
    this.getAllRank(true);
    this.modalService.open(content, { size: 'lg', windowClass: "myCustomModalClass" });
    var a = document.querySelector('#stepper1');
    this.stepper = new Stepper(a, {
      linear: false,
      animation: true
    });
  }

  openDetail(content, id: number) {
    this.indexDetail = 1
    this.GetConfigurationCatalogueByConfigId(id);
    console.log(id);
    this.modalService.open(content, { size: 'lg', windowClass: "myCustomModalClass" });
    var a = document.querySelector('#update');
    this.stepper = new Stepper(a, {
      linear: false,
      animation: true
    });
  }

  next() {
    if (this.validateConfiguration() == false) {
      return;
    }
    this.stepper.next();
    this.index = this.index + 1;
    this.inputConfiguration["startDate"] = this.startDate;
    this.inputConfiguration['endDate'] = this.endDate;
    console.log(this.inputConfiguration['endDate'])
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
        this.ListRank = data['data']['data'];
      }
    );

  }

  getAllCatalogue() {
    this.catalogueApi.getAllCatalogue().subscribe(
      (data) => {

        this.catalogueList = data;
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
    this.configAPi.getAllConfiguration(status).subscribe(
      (data) => {
        this.loading = false;
        this.Configurations = data['data']['data'];
      }
    );
  }

  GetConfigurationCatalogueByConfigId(id: number) {
    this.loading = true;
    this.configAPi.GetConfigurationCatalogueByConfigId(id).subscribe(
      (data) => {
        this.updateConfig['ConfigId'] = data['data']['data']['ConfigId'];
        this.updateConfig['testOwnerId'] = data['data']['data']['testOwnerId'];
        this.updateConfig['totalQuestion'] = data['data']['data']['totalQuestion'];
        this.updateConfig['createDate'] = data['data']['data']['createDate'];
        this.updateConfig['startDate'] = data['data']['data']['startDate'];
        this.updateConfig['endDate'] = data['data']['data']['endDate'];
        this.updateConfig['duration'] = data['data']['data']['duration'];
        this.updateConfig['isActive'] = data['data']['data']['isActive'];
        this.updateConfig['catalogueInConfigurations'] = data['data']['data']['catalogueInConfigurations'];
        this.updateConfig['configurationRank'] = data['data']['data']['configurationRank']
        this.selectedItems = data['data']['data']['catalogueInConfigurations'];
        this.loading = false;
        console.log(this.updateConfig);
      }
    );
  }

  selectAll() {
    this.selectConfiguration = [];
    for (var i = 0; i < this.Configurations.length; i++) {
      this.Configurations[i].selected = this.selectedAll;
      this.selectConfiguration.push(this.Configurations[i])
    }
  }

  checkIfAllSelected() {
    this.selectConfiguration = [];
    this.selectedAll = this.Configurations.every(function (item: any) {
      return item.selected == true;
    })
    for (var i = 0; i < this.Configurations.length; i++) {
      if (this.Configurations[i].selected == true) {
        this.selectConfiguration.push(this.Configurations[i])
      }
    }
  }

  Create() {
    this.loading = false;
    if (this.inputConfiguration['duration'] == "" || this.inputConfiguration['totalQuestion'] == "") {
      Swal.fire('Error', 'Something went wrong', 'error');
      return;
    }
    this.inputConfiguration['catalogueInConfigurations'] = this.selectedItems;
    this.inputConfiguration['configurationRank'] = this.ListRank;

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
        console.log(this.inputConfiguration)
        this.configAPi.createConfigurartion(this.inputConfiguration).subscribe(data => {
          this.getConfigurationIsActive(true);
          this.closeModal();
          this.index = 1;
        Swal.fire('Success', 'The configuration has been created', 'success'); 
        });
      }
    })
  }

  Update(){
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
        console.log(this.updateConfig);
        this.configAPi.updateConfiguration(this.updateConfig).subscribe(data => {
          this.getConfigurationIsActive(true);
          this.closeModal();
          this.indexDetail = 1;
        Swal.fire('Success', 'The configuration has been updated', 'success'); 
        });
      }
    })
    
  }

  DisableConfiguration(status: boolean){
    this.loading = false;
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
          for (var i = 0; i < this.selectConfiguration.length; i++) {
            this.selectConfiguration[i].isActive = status;
          }
          this.configAPi.changeStatusConfiguration(this.selectConfiguration).subscribe(data => {
            this.getConfigurationIsActive(status);
            this.closeModal();
            Swal.fire('Success', 'The configuration has been deleted', 'success');
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
        text: 'The configuration will be enable!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, enable it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          for (var i = 0; i < this.selectConfiguration.length; i++) {
            this.selectConfiguration[i].isActive = status;
          }
          this.configAPi.changeStatusConfiguration(this.selectConfiguration).subscribe(data => {
            this.getConfigurationIsActive(status);
            this.closeModal();
            Swal.fire('Success', 'The configuration has been enabled', 'success');
          });;
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          this.updateStatus = [];
          this.closeModal();
        }
      })
    }
  }

  validateConfiguration() {
    if (this.inputConfiguration['totalQuestion'] < 1 || this.inputConfiguration['totalQuestion'] > 100) {
      this.toast.error('Message', 'Total question must be range 1 to 100');
      return false;
    }
    else if (this.inputConfiguration['duration'] < 15 || this.inputConfiguration['duration'] > 180) {
      this.toast.error('Message', 'duration must be range 15 to 200');
      return false;
    }
    else if (this.selectedItems.length == 0) {
      this.toast.error('Message', 'Please select the catalogue');
      return false;
    }
    else if ($('#mark').val() == "") {
      this.toast.error('Message', 'Please input rate of catalogue');
      return false;
    }
    var total = 0;
    for (var i = 0; i < this.selectedItems.length; i++) {
      total = this.selectedItems[i]['weightPoint'] + total;
    }
    if (total != 1) {
      console.log(total)
      this.toast.error('Message', 'Total mark of catalogue must be 1');
      return false;
    }

    else if (this.index == 2) {
      if ($('#rate').val() == "") {
        this.toast.error('Message', 'Please input rate of rank');
        return false;
      }
      // else {
      //   var total = 0;
      //   for (var i = 0; i < this.ListRank.length; i++) {
      //     total = this.ListRank[i]['rate'] + total;
      //   }
      //   if (total != 1) {
      //     console.log(total)
      //     this.toast.error('Message', 'Total mark of Rank must be 1');
      //     return false;
      //   }
      // }
    }
  }
}
