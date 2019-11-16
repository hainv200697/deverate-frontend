import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CatalogueApiService } from '../../services/catalogue-api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import {ViewEncapsulation} from '@angular/core';
@Component({
    selector: 'app-catalogue-default',
    templateUrl: './catalogue-default.component.html',
    styleUrls: ['./catalogue-default.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CatalogueDefaultComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        public router: Router,
        private modalService: NgbModal,
        private catelogueService: CatalogueApiService,
        private toastr: ToastrService,
    ) {
    }
    public loading = false;
    iconIsActive: boolean;
    selectedAll: any;
    check = 0;
    catalogueList = [];
    searchText: string;
    insCatalogue = {};
    updCatalogue = {};
    updateStatus = [];
    ngOnInit() {
        this.getAllCatalogue(true);
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
            this.updCatalogue['CatalogueId'] = item['catalogueId'];
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
    getAllCatalogue(status) {
        this.iconIsActive = status;
        this.loading = true;
        this.catelogueService.getAllCatalogueDefault(this.iconIsActive).subscribe(
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
        this.getAllCatalogue(this.iconIsActive);
    }

    // Insert catalogue
    insertCatalogueSubmit() {
        this.insCata();
        this.closeModal();
        this.getAllCatalogue(this.iconIsActive);
    }

    insCata() {
        this.loading = true;
        this.catelogueService.insertCatalogueDefault(this.insCatalogue).subscribe(
            (results) => {
                this.loading = false;
                this.getAllCatalogue(this.iconIsActive);
                this.toastr.success(results['message']);
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
    }

    updCata() {
        this.loading = true;
        this.catelogueService.updateCatalogueDefault(this.updCatalogue).subscribe(
            (data:any) => {
                this.loading = false;
                this.getAllCatalogue(this.iconIsActive);
                this.toastr.success(data['message']);
            }
        );
    }

    clickButtonChangeStatus(status: boolean) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This status will be change!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                for (let i = 0; i < this.updateStatus.length; i++) {
                    this.updateStatus[i].IsActive = status;
                }
                this.catelogueService.removeCatalogueDefault(this.updateStatus).subscribe(data => {
                    this.getAllCatalogue(this.iconIsActive);
                    this.selectedAll = false;
                    this.closeModal();
                    Swal.fire('Success', 'The company has been change', 'success');
                });;
            Swal.fire(
              'change',
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

}
