import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { GobalService } from 'src/app/shared/services/gobal-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  public loading = false;

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private gblserv: GobalService
  ) { }
  isSave = false;
  config;
  key;
  error = false;
  expired = false;
  message = '';
  test = false;
  questionInTest = [];
  alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  testId;
  status = false;
  time = 0;
  accountId = localStorage.getItem('AccountId');
  sub: Subscription;
  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('testId');
    this.config = this.testService.getConfig(this.testId)
      .subscribe(res => {
        this.config = res;
        if (this.config.accountId != null && this.accountId == undefined) {
          this.router.navigate(['login']);
          return;
        }
        if (this.config.accountId != null && this.accountId != this.config.accountId) {
          this.router.navigate(['**']);
          return;
        }
        if (this.config.accountId != null && this.config.status == 'Submitted' && this.config.accountId == this.accountId) {
          this.router.navigate(['/result', this.testId]);
          return;
        }
        if(this.config.status == 'Submitted' && this.config.applicantId != null)
        {
          this.status = true;
        }
        if (this.config.status == 'Expired') {
          this.expired = true;
          this.message = "Test expires!"
          return;
        }
        this.config.title = this.config.title.toUpperCase();
        this.config.startDate = moment.utc(this.config.startDate).local().format('LLLL');
        this.config.endDate = moment.utc(this.config.endDate).local().format('LLLL');
        $('#openModalButton').click();
      });
  }

  viewResult(){
    if(this.key != undefined){
      this.testService.checkCode(this.testId,this.key).subscribe(
        (res)=>{
            this.closeModal();
            localStorage.setItem('applicantId',res);
            this.router.navigate(['/result', this.testId]);
        },
        (error)=>{
          if (error.status == 0) {
            this.toastr.error("System is not available");
          }
          if (error.status == 400) {
            this.toastr.error("Key is invalid");
          }
          if (error.status == 500) {
            this.toastr.error("System error");
          }
          this.loading = false;
        }
      );
    }else{
      this.toastr.error("Please enter key!");
    }
  }


  open(content) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }).catch(e => {
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  quiz() {
    const testInfo = {
      testId: this.testId,
      accountId: this.accountId,
      configId: this.config.configId,
      code: this.key
    };
    let newAnswer = [];
    this.testService.getAllQuestion(testInfo)
      .subscribe((res) => {
        this.test = true;
        this.questionInTest = res.questionInTest;
        this.time = this.config.timeRemaining;
        if (this.time > 0) {
          this.closeModal();
          this.questionInTest.forEach(element => {

            newAnswer = this.gblserv.shuffleAnswer(element['answers']);
            element['answers'] = newAnswer;
          });
          this.sub = interval(60000)
            .subscribe((val) => {
              console.log("Auto Save");
              this.autoSave()
            });
        }

      },
        (error) => {
          this.error = true;
          this.message = "Code is invalid!";
        });

  }

  submit() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The test will be submited!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submited it!',
      cancelButtonText: 'No, submited it'
    }).then((result) => {
      if (result.value) {
        this.submitTest();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.closeModal();
      }
    }).catch(e => {
    });
  }

  handleEvent($event) {

    if (!this.test) {
      return;
    }
    switch ($event.action) {
      case 'notify':
        if ($event.left == 30000) {
          $('.count-down span').css("color", "red");
        } else {
          $('.count-down span').html("Time Up!");
        }
        break;
      case 'done':
        this.submitTest();
        break;
    }

  }

  autoSave() {
    const userTest = {
      accountId: this.accountId,
      testId: this.testId,
      code: this.key,
      questionInTest: this.questionInTest
    };
    this.testService.postAutoSaveTest(userTest)
      .subscribe((res) => {
        if(!this.isSave){
          this.toastr.success("Auto save success");
          this.isSave = true;
        }
      },(error)=>{
        if(this.isSave){
          this.toastr.error("Auto save fail!");
          this.isSave = false;
        }
      }
      );
  }

  scroll(id) {
    let el = document.getElementById(id);
    el.scrollIntoView({ behavior: "smooth" });
  }

  submitTest() {
    const userTest = {
      accountId: this.accountId,
      testId: this.testId,
      code: this.key,
      questionInTest: this.questionInTest
    }
    this.loading = true;
    this.testService.postSubmitTest(userTest)
      .subscribe((res) => {
        if(res != 0){
          localStorage.setItem('applicantId',res);
        }
        this.loading = false;
        this.closeModal();
        Swal.fire('Success', 'The test has been submited', 'success');
        this.sub.unsubscribe();
        this.router.navigate(['/result', this.testId]);
      });
  }

}
