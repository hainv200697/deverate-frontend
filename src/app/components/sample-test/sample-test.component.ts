import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { Location } from '@angular/common';
import { GobalService } from 'src/app/shared/services/gobal-service';

@Component({
  selector: 'app-sample-test',
  templateUrl: './sample-test.component.html',
  styleUrls: ['./sample-test.component.scss']
})
export class SampleTestComponent implements OnInit {

  constructor(
    private testService: TestService,
    private router: Router
  ) { }
  config;
  key;
  error = false;
  test = false;
  questionInTest = [];
  alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  testId;
  ngOnInit() {
    this.getTest();
  }


  getTest() {
    const sampleTest = JSON.parse(localStorage.getItem('SampleTest'));
    if (sampleTest == null || sampleTest == undefined || sampleTest == '') {
      this.router.navigate(['/not-fount']);
    }
    console.log(JSON.stringify(sampleTest));
    this.testService.getAllQuestionSample(sampleTest)
      .subscribe((res) => {
        console.log(res);
        this.test = true;
        this.questionInTest = res.questions;
      },
        (error) => {
          this.error = true;
        });
  }


  scroll(id) {
    let el = document.getElementById(id);
    el.scrollIntoView({ behavior: "smooth" });
  }

  changeAnswer(id) {
    let el = document.getElementById(id);
    el.style.backgroundColor = "blue";
    el.style.color = "white";
  }
}
