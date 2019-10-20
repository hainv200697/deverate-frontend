import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ViewEncapsulation } from '@angular/compiler/src/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private route: ActivatedRoute, private testService: TestService, private modalService: NgbModal) { }
  config;
  key;
  error = false;
  test = false;
  question;
  alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  ngOnInit() {
    const testId = this.route.snapshot.paramMap.get('testId');
    this.config = this.testService.getConfig(testId)
      .subscribe(res => {
        this.config = res;
        this.config.startDate = moment(this.config.startDate).format('LLLL');
        this.config.endDate = moment(this.config.endDate).format('LLLL');
        $('#openModalButton').click();
      });
  }

  open(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  quiz() {
    const testInfo = {
      accountId: Number(sessionStorage.getItem('AccountId')),
      configId: this.config.configId,
      code: this.key
    };
    this.testService.getAllQuestion(testInfo)
      .subscribe((res) => {
        this.test = true;
        this.question = res;
        console.log(this.question);
        this.closeModal();
      },
        (error) => {
          this.error = true;
        });
  }

  submit() {
    console.log(JSON.stringify(this.question));
    this.testService.postSubmitTest(this.question)
    .subscribe((res) => {
      console.log(res);
    });
  }

  scroll(id) {
    console.log(id);
    let el = document.getElementById(id);
    el.scrollIntoView({behavior:"smooth"});
  }

}
