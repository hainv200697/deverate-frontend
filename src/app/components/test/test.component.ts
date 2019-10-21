import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private route: ActivatedRoute, private testService: TestService, private modalService: NgbModal, private router: Router) { }
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
    this.modalService.open(content, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
        console.log(res);
        this.test = true;
        this.questionInTest = res;
        this.closeModal();

        this.sub = interval(60000)
          .subscribe((val) => {
            console.log("Auto Save")
            this.autoSave()
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
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'The test will be submited!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submited it!',
      cancelButtonText: 'No, submited it'
    }).then((result) => {
      if (result.value) {
        console.log(JSON.stringify(userTest))
        this.testService.postSubmitTest(userTest)
          .subscribe((res) => {
            this.closeModal();
            Swal.fire('Success', 'The test has been submited', 'success');
            this.router.navigate(['/result', this.testId]);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.closeModal();
      }
    })
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
    let el = document.getElementById(id);
    el.scrollIntoView({ behavior: "smooth" });
  }

  changeAnswer(id) {
    let el = document.getElementById(id);
    el.style.backgroundColor = "blue";
    el.style.color = "white";
  }

}
