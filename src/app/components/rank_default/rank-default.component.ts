import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, } from '@angular/router';
import Swal from 'sweetalert2'
import { RankApiService } from '../../services/rank-api.services'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rank',
  templateUrl: './rank-default.component.html',
  styleUrls: ['./rank-default.component.scss']
})
export class RankDefaultComponent implements OnInit {
  constructor(
    public router: Router,
    private toast: ToastrService,
    private rankApi: RankApiService,
  ) { }
  public loading = false;
  iconIsActive: boolean;

  updateRank = {};
  updateStatus = [];

  listRank = [];
  catalogueList = [];
  clone = [];
  avaragePercent = [];

  ngOnInit() {
    this.getRank();
  }

  clickButtonRefresh(refesh) {
    refesh.classList.add('spin-animation');
    setTimeout(function () {
      refesh.classList.remove('spin-animation');
    }, 500);
    this.getRank();
  }

  getRank() {
    this.loading = true;
    this.rankApi.getAllDefaultRank().subscribe(
      (data) => {
        this.loading = false;
        this.listRank = data.rankDTOs;
        this.catalogueList = data.catalogueDTOs;
        this.clone = JSON.parse(JSON.stringify(this.listRank));
        this.calculateWeightPoint();
        for (let i = 0; i < this.catalogueList.length; i++) {
          this.catalogueList[i].isShow = true;
          if (this.catalogueList[i].point == 0) {
            this.catalogueList[i].isShow = false
          }
        }
        for (let i = 0; i < this.clone.length; i++) {
          for (let z = 0; z < this.clone[i].catalogueInRanks.length; z++) {
            this.clone[i].catalogueInRanks[z].isShow = true;
            if (this.clone[i].catalogueInRanks[z].catalogueId == this.catalogueList[z].companyCatalogueId && this.catalogueList[z].isShow == false)
              this.clone[i].catalogueInRanks[z].isShow = false
          }
        }
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
      }
    );
  }

  addRankToList() {
    var catalogueInRank = [];
    for (var i = 0; i < this.catalogueList.length; i++) {
      catalogueInRank.push({
        catalogueId: this.catalogueList[i].companyCatalogueId,
        point: 100,
        isShow: this.catalogueList[i].isShow,
      })
    }
    this.clone.push({
      rankId: -1,
      name: 'RankSample',
      isDefault: true,
      catalogueInRanks: catalogueInRank
    })
    this.calculateWeightPoint();
  }

  removeRank(index) {
    this.clone.splice(index, 1)
  }

  checkSelected(catalogue) {
    catalogue.isShow = true;
    for (let i = 0; i < this.clone.length; i++) {
      for (let z = 0; z < this.clone[i].catalogueInRanks.length; z++) {
        if (this.clone[i].catalogueInRanks[z].catalogueId == catalogue.companyCatalogueId) {
          this.clone[i].catalogueInRanks[z].isShow = true;
        }
      }
    }
  }

  calculateWeightPoint(item = null) {
    if (item != null) {
      item.point = Math.round(item.point);
      var parsePoint = parseInt(item.point, 10);
      item.point = parsePoint;
      if (item.point > 100) item.point = 100;
      else if (item.point < 0) item.point = 0;
    }
    this.avaragePercent.length = 0;
    var number = this.clone.length;
    this.clone.forEach(rank => {
      var i = 0;
      var points = rank.catalogueInRanks.map(a => a.point);
      var total = points.reduce((a, b) => a + b, 0);
      if (total == 0) total = 1;
      rank.catalogueInRanks.forEach(element => {
        element.percent = element.point / total;
        if (this.avaragePercent[i] == undefined) this.avaragePercent.push(element.percent); else this.avaragePercent[i] += element.percent;
        i++;
      });
    });

    for (let i = 0; i < this.avaragePercent.length; i++) {
      this.avaragePercent[i] = this.avaragePercent[i] / number;
    }
    for (let index = 0; index < this.catalogueList.length; index++) {
      this.catalogueList[index].point = this.avaragePercent[index];
    }
    this.clone.forEach(rank => {
      var points = rank.catalogueInRanks.map(a => a.point);
      var sum = 0;
      for (let i = 0; i < points.length; i++) {
        sum += (points[i] * this.avaragePercent[i]);
      }
      rank.point = Math.round(sum);
    });
    this.clone.sort(function (a, b) {
      return a.point - b.point;
    })
  }

  formatRankName(index) {
    this.clone[index].name = this.clone[index].name.toUpperCase().replace(/\s/g, '');
  }

  saveChange() {
    var listSave = [];
    this.clone.forEach(rank => {
      var find = this.listRank.find(x => x.rankId == rank.rankId);
      if (find == undefined || find.name != rank.name) listSave.push(rank);
      else {
        var change = false;
        for (let i = 0; i < rank.catalogueInRanks.length; i++) {
          var findCataloguePoint = find.catalogueInRanks.find(x => x.catalogueId == rank.catalogueInRanks[i].catalogueId).point;
          if (findCataloguePoint != rank.catalogueInRanks[i].point) {
            change = true;
            break;
          }
        }
        if (change) listSave.push(rank);
      }
    });
    var listRemove = [];
    this.listRank.forEach(rank => {
      var find = this.clone.find(x => x.rankId == rank.rankId);
      if (find == undefined) listRemove.push(rank.rankId);
    });
    if (listSave.length == 0 && listRemove.length == 0) {
      this.toast.error('No data change');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'The rank will be save!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, do not save '
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        var count = 0;
        this.rankApi.saveDefaultRank(listSave)
          .subscribe((res) => {
            count++;
            if (count == 2) {
              this.getRank();
              this.toast.success('Save success');
              this.loading = false;
            }
          },
            (err) => {
              if (err.status == 0) {
                this.toast.error('Server is not availiable');
              }
              if (err.status == 500) {
                this.toast.error('Server error');
              }
              this.loading = false;
            });

        this.rankApi.disableDefaultRank(listRemove)
          .subscribe((res) => {
            count++;
            if (count == 2) {
              this.getRank()
              this.toast.success('Save success');
              this.loading = false;
            }
          },
            (err) => {
              if (err.status == 0) {
                this.toast.error('Server is not availiable');
              }
              if (err.status == 500) {
                this.toast.error('Server error');
              }
              this.loading = false;
            });
      }
    });
  }
  removeCatalogue(catalogueId){
    for (let i = 0; i < this.clone.length; i++) {
      for (let z = 0; z < this.clone[i].catalogueInRanks.length; z++) {
        if(catalogueId == this.clone[i].catalogueInRanks[z].catalogueId){
          this.catalogueList[z].isShow = false;
          this.clone[i].catalogueInRanks[z].point = 0;
          this.clone[i].catalogueInRanks[z].isShow = false;
          break;
        }
      }
    }
    this.calculateWeightPoint();
  }
}
