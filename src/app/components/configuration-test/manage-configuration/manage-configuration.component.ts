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
    this.pageSize = 3;
  }
  startdate: Date = new Date();

  enddate: Date = new Date(this.startdate);
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
  iconIsActive: boolean;
  page: number;
  pageSize: number;
  element: HTMLElement;
  selectedAll: any;
  selectCattalogue = [];
  Configurations = [];

  Account = {};
  ListRank: [];
  a = {};
  catalogueList = [
    {
      "Name": "sss",
      "selected": false,
    },
    {
      "Name": "ssaaas",
      "selected": false,
    }
  ];
  inputConfiguration = {};
  inputManager = {};

  searchText = '';

  updateCompany = {};
  updateManager = {};
  updateStatus = [];

  ansForm: FormGroup;
  answersForm: FormGroup;
  form: any;
  count = 1;
  answerForm: FormGroup;

  dropdownList = [
    { "id": 1, "name": "Program Skil" },
    { "id": 5, "name": "Software Requirement Analysis" },
    { "id": 2, "name": "Software Design Methods" },
    { "id": 3, "name": "Technical Lead" },
    { "id": 4, "name": "Personal Skills" },
    { "id": 4, "name": "Personal Skills" },
    { "id": 4, "name": "Personal Skills" },
    { "id": 4, "name": "Personal Skills" },
    { "id": 4, "name": "Personal Skills" },

  ];
  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    text: "Select Catalogue",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: "form-control form-group",
    labelKey: "name",
    maxHeight: 240,
    showCheckbox: true,
  };


  PageSize(test: number) {
    this.pageSize = test;
  }


  ngOnInit() {


    this.getAllRank(true);

    this.getConfigurationIsActive(true);

    this.dropdownList['id'] = 0;
    this.dropdownList['itemName'] = ""
    this.dropdownList['isActive'] = true;

    this.inputConfiguration['Totalquestion'] = 1;
    this.inputConfiguration['Duration'] = 15;
    this.inputConfiguration['StartDate'] = this.startdate;
    this.inputConfiguration['EndDate'] = this.enddate.setDate(this.startdate.getDate() + 1);
  }

  onItemSelect(item: any) { }

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
    this.modalService.open(content, { size: 'lg', windowClass: "myCustomModalClass" });
    var a = document.querySelector('#stepper1');
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
    this.inputConfiguration["StartDate"] = this.startdate;
    this.inputConfiguration['EndDate'] = this.enddate;
  }

  back() {
    this.index = this.index - 1;
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

  clickButtonRefresh(refesh) {
    refesh.classList.add('spin-animation');
    setTimeout(function () {
      refesh.classList.remove('spin-animation');
    }, 500);
    this.getConfigurationIsActive(true);
  }

  
  getConfigurationIsActive(status: boolean) {
    this.iconIsActive = status;
    this.configAPi.getAllConfiguration(status).subscribe(
      (data) => {
        this.Configurations = data['data']['data'];
      }
    );
  }
  

  checkIfAllSelected() {
    this.selectCattalogue = [];
    this.selectedAll = this.catalogueList.every(function (item: any) {
      return item.selected == true;

    })
    for (var i = 0; i < this.catalogueList.length; i++) {
      if (this.catalogueList[i].selected == true) {
        this.selectCattalogue.push(this.catalogueList[i])
      }
    }
  }

  Create() {
    let inputAllConfig = [];
    if (this.inputConfiguration['Duration'] == "" || this.inputConfiguration['Totalquestion'] == "") {
      Swal.fire('Error', 'Something went wrong', 'error');
      return;
    }
    inputAllConfig.push(this.inputConfiguration, this.selectedItems, this.ListRank);
    this.closeModal();
    Swal.fire('Success', 'The configuration has been created', 'success');
    console.log(inputAllConfig);
  }

  validateConfiguration() {
    if (this.inputConfiguration['Totalquestion'] < 1 || this.inputConfiguration['Totalquestion'] > 100) {
      this.toast.error('Message', 'Total question must be range 1 to 100');
      return false;
    }
    else if (this.inputConfiguration['Duration'] < 15 || this.inputConfiguration['Duration'] > 180) {
      this.toast.error('Message', 'Duration must be range 15 to 200');
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
      total = this.selectedItems[i]['mark'] + total;
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
