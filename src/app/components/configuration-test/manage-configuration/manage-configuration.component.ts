import { EmployeeApiService } from 'src/app/services/employee-api.service';
import { RankApiService } from './../../../services/rank-api.services';
import { CatalogueApiService } from './../../../services/catalogue-api.service';
import { ConfigurationApiService } from './../../../services/configuration-api.service';
import { CompanyApiService } from '../../../services/company-api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import Stepper from 'bs-stepper';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'manage-configuration',
  templateUrl: './manage-configuration.component.html',
  styleUrls: ['./manage-configuration.component.scss']
})
export class ManageConfigurationComponent implements OnInit {
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

  }
  public loading = false;

  private stepper: Stepper;
  index = 1;
  iconIsActive: boolean;

  selectConfiguration = [];
  Configurations = [];

  ListRank = [];
  inputConfiguration = {};

  searchText = '';

  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    text: 'Select Rank',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'form-control form-group',
    labelKey: 'name',
    primaryKey: 'rankId',
    maxHeight: 240,
    showCheckbox: true,
    badgeShowLimit: 3,
  };

  companyId = localStorage.getItem('CompanyId');
  avaragePercent = [];

  listCatalogue = [];
  configDetail;

  totalQuestion;

  rankInConfig;
  catalogueInConfiguration;
  ngOnInit() {
    this.getAllRank();
    this.getConfigurationIsActive(true);
  }

  onDeSelectAll(item: any) {
    this.selectedItems = []
  }

  open(content) {
    this.index = 1;
    for (let index = 0; index < this.listCatalogue.length; index++) {
      this.listCatalogue[index].numberQuestion = 0;
    }
    this.totalQuestion = 0;
    this.inputConfiguration['title'] = "";
    this.inputConfiguration['companyId'] = localStorage.getItem("CompanyId");
    this.inputConfiguration['title'] = '';
    this.inputConfiguration['type'] = true;
    this.inputConfiguration['duration'] = 0;
    this.inputConfiguration['expiredDays'] = 7;
    this.selectedItems = [];
    this.modalService.open(content, { backdrop: 'static', size: 'lg', windowClass: 'myCustomModalClass' });
    const a = document.querySelector('#stepper1');
    this.stepper = new Stepper(a, {
      linear: false,
      animation: true
    });
  }

  next() {
    if (this.validateConfiguration() === false) {
      return;
    }
    this.stepper.next();
    this.index = this.index + 1;

    this.rankInConfig = [];
    this.selectedItems.forEach(item => {
      this.rankInConfig.push({
        rankId: item.rankId,
        point: item.point,
      })
    });

    this.catalogueInConfiguration = [];
    this.listCatalogue.forEach(item => {
      this.catalogueInConfiguration.push({
        catalogueId: item.companyCatalogueId,
        weightPoint: Math.round(item.point * 100),
        numberQuestion: item.numberQuestion
      })
    });
  }

  back() {
    this.index = this.index - 1;
    this.stepper.previous();
  }

  closeModal() {
    this.modalService.dismissAll();
    this.index = 1;
  }

  getAllRank() {
    this.rankApi.getAllRank(this.companyId).subscribe(
      (data) => {
        this.ListRank = data.rankDTOs;
        for (let i = 0; i < data.catalogueDTOs.length; i++) {
          if (data.catalogueDTOs[i].quescount == 0) {
            data.catalogueDTOs.splice(i, 1);
            i--
          }
        }
        this.listCatalogue = data.catalogueDTOs;
        this.calculateWeightPoint(this.ListRank);
        for (let i = 0; i < this.listCatalogue.length; i++) {
          this.listCatalogue[i].numberQuestion = 0;
          if (this.listCatalogue[i].point == 0) {
            this.listCatalogue.splice(i, 1);
            i--
          }
        }
      },
      (error) => {
        this.loading = false;
        if (error.status == 0) {
          this.toast.error('Server is not availiable');
        }
        if (error.status == 404) {
          this.toast.error('Not found');
        }
        if (error.status == 500) {
          this.toast.error('Server error');
        }
      }
    );
  }

  DeSelectRank(value) {
    for (let i = 0; i < this.selectedItems.length; i++) {
      if (this.selectedItems[i].rankId == value.rankId) {
        this.selectedItems.splice(i, 1);
        break;
      }
    }
  }

  clickButtonRefresh(refesh) {
    this.getConfigurationIsActive(true);
  }


  getConfigurationIsActive(status) {
    this.loading = true;
    this.iconIsActive = status;
    this.configAPi.getAllConfiguration(true, this.companyId).subscribe(
      (data) => {
        this.Configurations = data;
        this.Configurations.forEach(element => {
          element.selected = false;
        });
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status == 0) {
          this.toast.error('Server is not availiable');
        }
        if (error.status == 404) {
          this.toast.error('Not found');
        }
        if (error.status == 500) {
          this.toast.error('Server error');
        }
      }
    );
  }

  getConfigById(content, configId) {
    this.loading = true;
    this.configAPi.GetConfigurationCatalogueByConfigId(configId).subscribe(
      (data) => {
        this.configDetail = data;
        this.modalService.open(content, { size: 'lg', windowClass: 'myCustomModalClass' });
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status == 0) {
          this.toast.error('Server is not availiable');
        }
        if (error.status == 404) {
          this.toast.error('Not found');
        }
        if (error.status == 500) {
          this.toast.error('Server error');
        }
      }
    );
  }

  checkSelected(configId) {
    var index = this.Configurations.findIndex(x => x.configId == configId);
    this.Configurations[index].selected = !this.Configurations[index].selected;
    if (this.Configurations[index].selected == false) {
      this.selectConfiguration.splice(this.Configurations.indexOf(configId), 1);
    } else {
      this.selectConfiguration.push(configId);
    }
  }

  Sample() {
    const sampleTest = {
      companyId: this.companyId,
      catalogueInConfigurations: this.listCatalogue
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

  calculateWeightPoint(ranks) {
    this.avaragePercent.length = 0;
    var number = ranks.length;
    ranks.forEach(rank => {
      var i = 0;
      var catas = rank.catalogueInRanks.filter(x => x.questionCount > 0);
      var points = catas.map(a => a.point);
      var total = points.reduce((a, b) => a + b, 0);
      if (total == 0) total = 1;
      rank.catalogueInRanks.forEach(element => {
        if (element.questionCount > 0) {
          element.percent = element.point / total;
          if (this.avaragePercent[i] == undefined) this.avaragePercent.push(element.percent); else this.avaragePercent[i] += element.percent;
          i++;
        }
      });
    });
    for (let i = 0; i < this.avaragePercent.length; i++) {
      this.avaragePercent[i] = this.avaragePercent[i] / number;
    }

    for (let index = 0; index < this.listCatalogue.length; index++) {
      this.listCatalogue[index].point = this.avaragePercent[index];
    }
    ranks.forEach(rank => {
      var catas = rank.catalogueInRanks.filter(x => x.questionCount > 0);
      var points = catas.map(a => a.point);
      var sum = 0;
      for (let i = 0; i < points.length; i++) {
        sum += (points[i] * this.avaragePercent[i]);
      }
      rank.point = Math.round(sum);
    });
    ranks.sort(function (a, b) {
      return a.point - b.point;
    })
  }

  Create() {
    this.loading = false;
    Swal.fire({
      title: 'Are you sure?',
      text: 'The semester will be create!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {

        this.inputConfiguration['rankInConfigs'] = this.rankInConfig;
        this.inputConfiguration['catalogueInConfigurations'] = this.catalogueInConfiguration;
        this.loading = true;
        this.configAPi.createConfigurartion(this.inputConfiguration).subscribe(data => {
          this.getConfigurationIsActive(true);
          this.closeModal();
          localStorage.removeItem('SampleTest');
          this.index = 1;
          this.toast.success(data['message']);
          this.loading = false;
        }, (error) => {
          this.getConfigurationIsActive(true);
          this.closeModal();
          this.index = 1;
          this.loading = false;
          if (error.status == 0) {
            this.toast.error('Server is not availiable');
          }
          if (error.status == 404) {
            this.toast.error('Not found');
          }
          if (error.status == 500) {
            this.toast.error('Server error');
          }
        });
      }
    });
  }

  DisableConfiguration(status) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The semester will be delete!',
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
          this.toast.success(data['message']);
          this.selectConfiguration = [];
          this.loading = false;
        }, (error) => {
          if (error.status == 0) {
            this.toast.error('Server is not availiable');
          }
          if (error.status == 400) {
            this.toast.error(error['message']);
          }
          if (error.status == 500) {
            this.toast.error('Server error');
          }
          this.loading = false;
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.closeModal();
      }
    });
  }

  validateConfiguration() {
    if (this.inputConfiguration['title'] == "") {
      this.toast.error('Message', 'Please input title semester!');
      return false;
    }
    else if (this.inputConfiguration['title'].length > 20) {
      this.toast.error('Message', 'The maximum title semester is 20');
      return false;
    }
    else if (this.inputConfiguration['duration'] < 5 || this.inputConfiguration['duration'] > 180) {
      this.toast.error('Message', 'duration must be range ' + this.selectedItems.length * 5 + '\'' + ' to 200\'');
      return false;
    }
    else if (this.inputConfiguration['expiredDays'] < 1) {
      this.toast.error('Message', 'ExpiredDays must be be greater than 0');
      return false;
    }
    else if (this.selectedItems.length === 0) {
      this.toast.error('Message', 'Please select the rank');
      return false;
    }
    else if (this.listCatalogue.length != 0) {
      for (let index = 0; index < this.listCatalogue.length; index++) {
        if (this.listCatalogue[index].numberQuestion == null) {
          this.toast.error('Message', 'Please input number of question');
          return false;
        }
        if (this.listCatalogue[index].numberQuestion <= 0) {
          this.toast.error('Message', 'Please input number of question valid');
          return false;
        }
        if (this.listCatalogue[index].numberQuestion > this.listCatalogue[index].quescount) {
          this.toast.error('Message', this.listCatalogue[index].name + ' max question ' + this.listCatalogue[index].quescount);
          return false;
        }

      }
      if (this.inputConfiguration['duration'] < this.totalQuestion) {
        this.toast.error('Message', 'Please input duration min: ' + this.totalQuestion);
        return false;
      }
    }
  }

  viewTest(id) {
    localStorage.setItem('isEmployee', 'true');
    this.router.navigate(['/manage-test/', id]);
  }

  validateQuestion() {
    this.totalQuestion = 0;
    for (let index = 0; index < this.listCatalogue.length; index++) {
      if(this.listCatalogue[index].numberQuestion != null || this.listCatalogue[index].numberQuestion > 0){
        this.totalQuestion += this.listCatalogue[index].numberQuestion;
      }
    }
    if(this.inputConfiguration['duration'] < this.totalQuestion){
      this.inputConfiguration['duration'] = this.totalQuestion * 2;
    }
  }
}
