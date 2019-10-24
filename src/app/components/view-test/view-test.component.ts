import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { GobalService } from 'src/app/shared/services/gobal-service';

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.scss']
})
export class ViewTestComponent implements OnInit {
  public loading = false;
  constructor(
    private route: ActivatedRoute, 
    private testService: TestService, 
    private modalService: NgbModal, 
    private router: Router,
    private gblserv : GobalService,
    private activeRoute :ActivatedRoute
    ) { }
  config;
  key;
  error = false;
  test = false;
  questionInTest;
  alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  testId;
  sub: Subscription;
  id = this.activeRoute.snapshot.params.id;
  listTest = [];  
  ngOnInit() {
    console.log(this.id);
    this.getTestByConfig();

  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {

  }

  getTestByConfig(){
        this.testService.getTestByConfigId(this.id).subscribe(
            (data: any) => {
                console.log(data);
                this.listTest = data;
            }
        );
  }
  openViewTest(id){
    console.log(id);
    this.router.navigate(['/manage-detail-test/', id]);
}
}
