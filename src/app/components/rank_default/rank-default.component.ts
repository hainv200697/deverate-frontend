import { element } from 'protractor';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { RankApiService } from '../../services/rank-api.services'
import { ToastrService } from 'ngx-toastr';
import { CatalogueApiService } from 'src/app/services/catalogue-api.service';
declare var $: any;

@Component({
  selector: 'app-rank',
  templateUrl: './rank-default.component.html',
  styleUrls: ['./rank-default.component.scss']
})
export class RankDefaultComponent implements OnInit {
  constructor(
    public router: Router,
    private modalService: NgbModal,
    private toast: ToastrService,
    private rankApi: RankApiService,
    private catelogueService: CatalogueApiService,
  ) {
  }
  public loading = false;
  iconIsActive: boolean;
  inputRank = [];

  updateRank = {};
  updateStatus = [];

  listRank = [];
  catalogueList = [];
  check;
  rankData = [];
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
        this.listRank.forEach(element => {
          element.selected = false;
        });
        Object.assign(this.clone,this.listRank)
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
      name: 'RankSample',
      isDefault: true,
      catalogueInRanks: catalogueInRank
    })
    this.calculateWeightPoint();
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

}
