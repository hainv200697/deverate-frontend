import { element } from 'protractor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistic-companymanager',
  templateUrl: './statistic-companymanager.component.html',
  styleUrls: ['./statistic-companymanager.component.scss']
})
export class StatisticManagerComponent implements OnInit {
  

  companyId = Number(sessionStorage.getItem('CompanyId'));
  ngOnInit() {
  }

  constructor(

  ) { }

  
}
