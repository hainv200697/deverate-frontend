import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CatalogueApiService } from '../../services/catalogue-api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
    selector: 'app-catalogue',
    templateUrl: './catalogue.component.html',
    styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        public router: Router,
        private modalService: NgbModal,
        private catelogueService: CatalogueApiService,
    ) {
    }
    selectedAll: any;
    check = 0;
    catalogueList = [];
    searchText :string;
    insCatalogue = {};
    updCatalogue = {};
    updateStatus = [];
    ngOnInit() {
        this.getAllCatalogue();
    }

    //Open modal 
    open(create) {
        this.modalService.open(create, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    }

    openUpdateModal(item, update) {
        console.log(item);
        this.updateModal(item);
        this.modalService.open(update, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });

    }

    updateModal(item) {
        if (item != null) {
            this.updCatalogue['CatalogueId'] = item['CatalogueId'];
            this.updCatalogue['Name'] = item['Name'];
            this.updCatalogue['Description'] = item['Description'];
            this.updCatalogue['IsActive'] = item['IsActive'];
        }

    }

    closeModal() {
        this.modalService.dismissAll();
    }

    closeUpdateModal() {
        this.modalService.dismissAll();
    }

    // Get all catalogue
    getAllCatalogue() {
        this.catelogueService.getAllCatalogue().subscribe(
            (data) => {

                this.catalogueList = data['data']['data'];
                console.log(this.catalogueList);
            }
        );
    }
    

    clickButtonRefresh(refesh) {
        refesh.classList.add('spin-animation');
        setTimeout(function () {
            refesh.classList.remove('spin-animation');
        }, 500)
        this.getAllCatalogue();
    }

    // Insert catalogue
    insertCatalogueSubmit() {
        console.log(this.insCatalogue);
        this.insCata();
        this.closeModal();
        this.getAllCatalogue();
    }

    insCata() {
        this.insCatalogue['IsActive'] = true;
        console.log(this.insCatalogue);
        this.catelogueService.insertCatalogue(this.insCatalogue).subscribe(
            (results) => {
                console.log(results);
            }
        );
    }

    selectAll() {
        this.updateStatus = [];
        for (var i = 0; i < this.catalogueList.length; i++) {
            this.catalogueList[i].selected = this.selectedAll;
            this.updateStatus.push(this.catalogueList[i])
        }
    }

    checkIfAllSelected() {
        this.updateStatus = [];
        this.selectedAll = this.catalogueList.every(function (item: any) {
            return item.selected == true;

        })
        for (var i = 0; i < this.catalogueList.length; i++) {
            if (this.catalogueList[i].selected == true) {
                this.updateStatus.push(this.catalogueList[i])
            }
        }

    }
    // Update catalogue 
    updateCatalogueSubmit() {
        this.updCata();
        this.closeModal();
        this.getAllCatalogue();
    }

    updCata() {
        console.log(this.updCatalogue);
        this.catelogueService.updateCatalogue(this.updCatalogue).subscribe(
            (results) => {
                console.log(results);
            }
        );
    }

    clickButtonChangeStatus(status: boolean){
        Swal.fire({
          title: 'Are you sure?',
          text: 'This catalogue will be delete!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
          if (result.value) {
            for(var i =0; i< this.updateStatus.length; i++){
              this.updateStatus[i].IsActive = status;
            }
            this.catelogueService.removeCatalogue(this.updateStatus).subscribe(
                (results) => {
                    console.log(results);
                }
            );
            
            Swal.fire(
              'Deleted',
              '',
              'success'
            )
            
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.updateStatus = [];
            Swal.fire(
              'Cancelled',
              '',
              'error'
            )
          }
        })
    }

    // viewCatalog(item){
    //     this.check = 1;
    // }

}