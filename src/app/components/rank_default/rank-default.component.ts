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
  ) {
  }
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
        this.listRank = data.defaultRankDTOs;
        this.catalogueList = data.catalogueDefaultDTOs;
        this.clone = JSON.parse(JSON.stringify(this.listRank));
        this.calculateWeightPoint();
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
        catalogueId : this.catalogueList[i].catalogueId,
        point: 100,
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

  removeRank(index){
    this.clone.splice(index,1)
  }

  calculateWeightPoint(item = null){
    if (item != null) {
      item.point = Math.round(item.point);
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

    for(let i = 0; i < this.avaragePercent.length; i++) {
      this.avaragePercent[i] = this.avaragePercent[i] / number;
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

  saveChange() {
    var listSave = [];
    this.clone.forEach(rank => {
      var find = this.listRank.find(x => x.rankId == rank.rankId);
      if (find == undefined || find.name != rank.name) listSave.push(rank);
      else {
        var change = false;
        for(let i = 0; i < rank.catalogueInRanks.length; i++) {
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
      cancelButtonText: 'No, don not save '
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.rankApi.saveDefaultRank(listSave)
          .subscribe((res) => {
            this.toast.error(res['message']);
          },
            (err) => {
              if (err.status == 0) {
                this.toast.error('Server is not availiable');
              }
              if (err.status == 500) {
                this.toast.error('Server error');
              }
              this.loading = false;
            });}
    });
  }
}
