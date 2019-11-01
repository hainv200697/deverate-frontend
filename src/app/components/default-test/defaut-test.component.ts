import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import {Location} from '@angular/common';
import Swal from 'sweetalert2';
import { GobalService } from 'src/app/shared/services/gobal-service';

@Component({
  selector: 'app-defaut-test',
  templateUrl: './defaut-test.component.html',
  styleUrls: ['./defaut-test.component.scss']
})
export class DefautTestComponent implements OnInit {

  constructor(private route: ActivatedRoute,
     private testService: TestService, 
     private modalService: NgbModal, 
     private router: Router,
     private activeRoute:ActivatedRoute,
     private gblserv : GobalService,
     private _location: Location
     ) { }
  config;
  key;
  error = false;
  test = false;
  questionInTest=[];
  alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  testId;
  id = this.activeRoute.snapshot.params.id;
  ngOnInit() {
    this.getTest();
  }


  getTest() {
    const testInfo = {
      testId : this.id
    };
    let newAnswer = [];
    this.testService.getAllQuestionManager(testInfo)
      .subscribe((res) => {
        let i = 0;
        this.test = true;
        this.questionInTest = res.questionInTest;
        this.questionInTest.forEach(element => {
          newAnswer = this.gblserv.shuffleAnswer(element['answers']);
          console.log(newAnswer);
          element['answers'] =newAnswer;
        });
        
        
      },
        (error) => {
          this.error = true;
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
  backClicked() {
    this._location.back();
  }
}
