import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestService } from 'src/app/services/test.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reranking',
  templateUrl: './reranking.component.html',
  styleUrls: ['./reranking.component.scss']
})
export class RerankingComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private testService: TestService) { }
  configs;
  startDate;
  endDate;
  duration;
  key;
  message;
  questions;
  configId;
  test = true;
  error = false;
  ngOnInit() {
    const accountId = localStorage.getItem('AccountId');
    this.testService.getAllTestInfo(accountId)
      .subscribe(res => {
        res.forEach(element => {
          element.startDate = moment.utc(element.startDate).local().format('MM/DD/YYYY');
          element.endDate = moment.utc(element.endDate).local().format('MM/DD/YYYY');
        });
        this.configs = res;
      });
  }

  open(content, index) {
    this.configId = this.configs[index].configId;
    this.startDate = moment(this.configs[index].startDate).format('LLLL');
    this.endDate = moment(this.configs[index].endDate).format('LLLL');
    this.duration = this.configs[index].duration;
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  quiz() {

    const testInfo = {
      accountId: Number(localStorage.getItem('AccountId')),
      configId: this.configId,
      code: this.key
    };
    this.testService.getAllQuestion(testInfo)
      .subscribe((res) => {
        this.message = res;
        this.closeModal();
        this.test = false;
      },
        (error) => {
          this.error = true;
        });
  }

}
