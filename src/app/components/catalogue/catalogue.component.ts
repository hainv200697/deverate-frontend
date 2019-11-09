import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CatalogueApiService } from '../../services/catalogue-api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
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
    companyId = Number(sessionStorage.getItem('CompanyId'));
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
        this.catelogueService.getAllCatalogue(this.iconIsActive,this.companyId).subscribe(
            (data :any[]) => {
                this.loading = false;
                this.catalogueList = data;
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
        if(this.validdate()){
            this.insCatalogue['companyId'] = this.companyId;
            this.loading = true;
            this.catelogueService.insertCatalogue(this.insCatalogue).subscribe(
                (results) => {
                    this.loading = false;
                    this.getAllCatalogue(this.iconIsActive);
                    this.toastr.success(results['message']);
                }
            );
        }
    }

    selectAll() {
        this.updateStatus = [];
        for (let i = 0; i < this.catalogueList.length; i++) {
            if(this.catalogueList[i].type){
                this.catalogueList[i].selected = this.selectedAll;
            }
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
        this.catelogueService.updateCatalogue(this.updCatalogue).subscribe(
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
                    this.updateStatus[i].companyId = this.companyId;
                }
                this.catelogueService.removeCatalogue(this.updateStatus).subscribe(data => {
                    this.getAllCatalogue(this.iconIsActive);
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

    viewCatalog(item){
        this.router.navigate(['/manage-question/', item['catalogueId']]);
    } 

    validdate() {
        if (this.insCatalogue['Name'] == '') {
            this.toastr.error('Message', 'Please input catalogue name');
            return false;
        } else if (this.insCatalogue['Name'].length < 3) {
            this.toastr.error('Message', 'Please input catalogue name min 3 letter');
            return false;
        }
        return true;
    }

}
