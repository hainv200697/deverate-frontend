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
        private catelogueService: CatalogueApiService
    ) {
    }
    public loading = false;
    selectedAll: any;
    check = 0;
    catalogueList = [];
    searchText: string;
    insCatalogue = {};
    updCatalogue = {};
    updateStatus = [];
    ngOnInit() {
        this.getAllCatalogue();
    }

    // Open modal
    open(create) {
        this.modalService.open(create, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    }

    openUpdateModal(item, update) {
        this.updateModal(item);
        this.modalService.open(update, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });

    }

    updateModal(item) {
        if (item != null) {
            this.updCatalogue['CatalogueId'] = item['CatalogueId'];
            this.updCatalogue['Name'] = item['name'];
            this.updCatalogue['Description'] = item['description'];
            this.updCatalogue['IsActive'] = item['isActive'];
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
        this.loading = true;
        this.catelogueService.getAllCatalogue().subscribe(
            (data :any[]) => {
                this.loading = false;
                this.catalogueList = data;
                console.log(this.catalogueList);
            }
        );
    }


    clickButtonRefresh(refesh) {
        refesh.classList.add('spin-animation');
        setTimeout(function () {
            
            refesh.classList.remove('spin-animation');
        }, 500);
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
        this.loading = true;
        this.catelogueService.insertCatalogue(this.insCatalogue).subscribe(
            (results) => {
                this.loading = false;
                console.log(results);
            }
        );
    }

    selectAll() {
        this.updateStatus = [];
        for (let i = 0; i < this.catalogueList.length; i++) {
            this.catalogueList[i].selected = this.selectedAll;
            this.updateStatus.push(this.catalogueList[i]);
        }
    }

    checkIfAllSelected() {
        this.updateStatus = [];
        this.selectedAll = this.catalogueList.every(function (item: any) {
            return item.selected === true;

        });
        for (let i = 0; i < this.catalogueList.length; i++) {
            if (this.catalogueList[i].selected === true) {
                this.updateStatus.push(this.catalogueList[i]);
            }
        }

    }
    // Update catalogue
    updateCatalogueSubmit() {
        this.updCata();
        this.closeModal();
        // this.getAllCatalogue();
    }

    updCata() {
        this.loading = true;
        this.catelogueService.updateCatalogue(this.updCatalogue).subscribe(
            (data:any) => {
                this.loading = false;
                console.log(data['message']);
            }
        );
    }

    clickButtonChangeStatus(status: boolean) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This catalogue will be delete!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                for (let i = 0; i < this.updateStatus.length; i++) {
                    this.updateStatus[i].IsActive = status;
                
                }
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

    viewCatalog(item){
        this.router.navigate(['/manage-question/', item['CatalogueId']]);
    }

}
