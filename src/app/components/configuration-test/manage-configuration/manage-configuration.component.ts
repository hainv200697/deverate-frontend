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
    closeOnSelect: false,
    minDateTime: new Date(this.startdate),
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
    {"id" : 1, "itemName" : "huy"},
    {"id" : 5, "itemName" : "a"},
    {"id" : 2, "itemName" : "b"},
    {"id" : 3, "itemName" : "tt"},
    {"id" : 4, "itemName" : "ccc"}

  ];
  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    text: "Select Catalogue",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: "myclass custom-class"
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

    this.inputConfiguration['Totalquestion'] = "";
    this.inputConfiguration['Duration'] = "";
    this.inputConfiguration['StartDate'] = "";
    this.inputConfiguration['EndDate'] = "";
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
    console.log(this.selectedItems);
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
    this.stepper.next();
    this.index = this.index + 1;
    this.inputConfiguration["StartDate"] = this.startdate;
    this.inputConfiguration['EndDate'] = this.enddate;
    console.log(this.selectedItems, this.inputConfiguration);
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

  getConfigurationIsActive(status: boolean) {
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
    console.log(this.inputConfiguration);
    if (this.inputConfiguration['Duration'] == "" || this.inputConfiguration['Totalquestion'] == "") {
      Swal.fire('Error', 'Something went wrong', 'error');
      return;
    }
    this.closeModal();
    Swal.fire('Success', 'The configuration has been created', 'success');
  }
}