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
  public loading = false;
  isLoaded = false;
  questionInTest = [];
  alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  testId;
  catalogues;
  color = ['Red', 'Blue', '#990000', 'Purple', 'Teal', 'Fuchsia', 'Maroon', 'Olive', 'Yellow', 'Lime', 'Green', 'Navy', 'White', 'Black'];
  ngOnInit() {
    this.getTest();
  }


  getTest() {
    this.loading = true;
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
        this.catalogues = res.catalogues;
        for (var i = 0; i < this.questionInTest.length; i++) {
          var index = this.catalogues.findIndex(c => c.catalogueId == this.questionInTest[i].catalogueId);
          this.questionInTest[i].color = this.color[index];
        }
        this.loading = false;
        this.isLoaded = true;
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
