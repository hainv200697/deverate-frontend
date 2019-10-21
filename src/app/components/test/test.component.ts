import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';

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
  questionInTest;
  alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  testId;
  sub: Subscription;
  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('testId');
    this.config = this.testService.getConfig(this.testId)
      .subscribe(res => {
        this.config = res;
        this.config.startDate = moment(this.config.startDate).format('LLLL');
        this.config.endDate = moment(this.config.endDate).format('LLLL');
        $('#openModalButton').click();
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.sub.unsubscribe();
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
        this.questionInTest = res;
        this.closeModal();

        this.sub = interval(60000)
          .subscribe((val) => {
            console.log('Auto Save');
            this.autoSave();
          });
      },
        (error) => {
          this.error = true;
        });
  }

  submit() {
    const userTest = {
      accountId: Number(sessionStorage.getItem('AccountId')),
      testId: this.testId,
      code: this.key,
      questionInTest: this.questionInTest
    };
    this.testService.postSubmitTest(userTest)
      .subscribe((res) => {
        console.log(res);
      });
  }

  autoSave() {
    const userTest = {
      accountId: Number(sessionStorage.getItem('AccountId')),
      testId: this.testId,
      code: this.key,
      questionInTest: this.questionInTest
    };
    this.testService.postAutoSaveTest(userTest)
      .subscribe((res) => {
        console.log(res);
      });
  }

  scroll(id) {
    console.log(id);
    const el = document.getElementById(id);
    el.scrollIntoView({ behavior: 'smooth' });
  }

}
