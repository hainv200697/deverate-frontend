import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-insert-company',
    templateUrl: './insert-company.component.html',
    styleUrls: ['./insert-company.component.scss']
})
export class InsertCompanyComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        public router: Router,
        private modalService: NgbModal,
        
    ) {
    }
    closeResult: string;
    question ={};
    selectedAll: any;
    Companies =[
      {
        "CompanyId": 1,
        "Name": "công ty của Huy",
        "Address": "string",
        "CreatAt": "20-10-2019",
        "IsActive": true,
        selected: false
      },
      {
        "CompanyId": 2,
        "Name": "công ty của Huy",
        "Address": "string",
        "IsActive": true,
        selected: false
      },
      {
        "CompanyId": 3,
        "Name": "công ty của Huy",
        "Address": "string",
        "IsActive": false,
        selected: false
      }
    ];
    catalogue={};
    
    ngOnInit() {
        
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }


      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return  `with: ${reason}`;
        }
      }

      clickButtonUpdate(companyId: number, content){
        this.open(content);
      }
    
      selectAll() {
        for (var i = 0; i < this.Companies.length; i++) {
          this.Companies[i].selected = this.selectedAll;
        }
      }
      checkIfAllSelected() {
        this.selectedAll = this.Companies.every(function(item:any) {
            return item.selected == true;
          })
      }

    

    // getCatalogueById(id:string){
    //     this.catelogueService.getCatalogueById(id).subscribe(
    //         (data) => {

    //             this.catalogue = data['data']['data'];
    //             console.log(JSON.stringify(this.catalogue));
    //         }
    //     );
    // }
}