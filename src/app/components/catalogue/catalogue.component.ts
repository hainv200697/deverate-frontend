import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
        public router: Router,
        private modalService: NgbModal,
        private catelogueService: CatalogueApiService,
        private toastr: ToastrService,
    ) {
    }
    selected = false;
    public loading = false;
    iconIsActive: boolean;
    selectedAll: any;
    check = 0;
    catalogueList = [];
    searchText: string;
    insCatalogue = {};
    updCatalogue = {};
    updateStatus = [];
    companyId = Number(localStorage.getItem('CompanyId'));
    ngOnInit() {
        this.getAllCatalogue(true);
    }

    // Open modal
    open(create) {
        this.modalService.open(create, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
    }

    openUpdateModal(item, update) {
        this.updateModal(item);
        this.modalService.open(update, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });

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
        this.catelogueService.getAllCatalogue(this.iconIsActive, this.companyId).subscribe(
            (data: any[]) => {
                this.loading = false;
                this.catalogueList = data;
                this.selected = false;
                this.selectedAll= false;
            }, error => {
                if (error.status == 0) {
                    this.toastr.error("System is not available");
                }
                if (error.status == 400) {
                    this.toastr.error("Input is invalid");
                }
                if (error.status == 500) {
                    this.toastr.error("System error");
                }
                this.loading = false;
            }
        );
    }


    clickButtonRefresh(refesh) {
        this.getAllCatalogue(this.iconIsActive);
    }

    // Insert catalogue
    insertCatalogueSubmit() {
        let check= true;
        if (!this.validate()) {
            check =false;
        }
        if(!this.validateDes()){
            check =false;
        }
        console.log(check);
        if(check==true){
            this.insCata();
            this.closeModal();
        }
    }

    insCata() {
            this.insCatalogue['companyId'] = this.companyId;
            this.loading = true;
            this.catelogueService.insertCatalogue(this.insCatalogue).subscribe(
                (results) => {
                    this.loading = false;
                    this.getAllCatalogue(this.iconIsActive);
                    this.toastr.success(results['message']);
                }, error => {
                    if (error.status == 0) {
                        this.toastr.error("System is not available");
                    }
                    if (error.status == 400) {
                        this.toastr.error("Input is invalid");
                    }
                    if (error.status == 500) {
                        this.toastr.error("System error");
                    }
                    this.loading = false;
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
        this.selected =false;
        this.selectedAll = this.catalogueList.every(function (item: any) {
            return item.selected === true;
        });
        for (let i = 0; i < this.catalogueList.length; i++) {
            if (this.catalogueList[i].selected === true) {
                this.selected = true;
                this.updateStatus.push(this.catalogueList[i]);
            }
        }

    }
    // Update catalogue
    updateCatalogueSubmit() {
        let check= true;
        if (!this.validateUpdate()) {
            check =false;
        }
        if(!this.validateUpdateDes()){
            check =false;
        }
        if(check==true){
            this.updCata();
            this.closeModal();
        }
    }

    updCata() {
        this.loading = true;
        this.catelogueService.updateCatalogue(this.updCatalogue).subscribe(
            (data: any) => {
                this.loading = false;
                this.getAllCatalogue(this.iconIsActive);
                this.toastr.success(data['message']);
            }, error => {
                if (error.status == 0) {
                    this.toastr.error("System is not available");
                }
                if (error.status == 400) {
                    this.toastr.error("Input is invalid");
                }
                if (error.status == 500) {
                    this.toastr.error("System error");
                }
                this.loading = false;
            }
        );
    }

    clickButtonChangeStatus(status: boolean) {
        if (this.selectedAll == true || this.selected == true ) {
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
                        this.selectedAll = false;
                        this.closeModal();
                        Swal.fire('Success', 'The catalogue has been change', 'success');
                    }, error => {
                        if (error.status == 500) {
                            this.toastr.error('System error')
                        }
                        if (error.status == 0) {
                            this.toastr.error('Connection error')
                        }
                        this.loading = false;
                    }
                    );

                }
            })
        }else {
            this.updateStatus = [];
            Swal.fire(
                'Cancelled',
                'Please choose Catalogue!',
                'error'
            )
        }
    }

    viewCatalog(item) {
        this.router.navigate(['/manage-question/', item['catalogueId']]);
    }

    validate() {
        if (this.insCatalogue['Name'] == null || this.insCatalogue['Name'] == undefined) {
            this.toastr.error('Message', 'Please input catalogue name');
            document.getElementById('ins_Catalogue_name').style.borderColor = 'red';
            document.getElementById('ins_Catalogue_name').focus();
            return false;
        } else if (this.insCatalogue['Name'].length < 3) {
            this.toastr.error('Message', 'Please input catalogue name min 3 letter');
            document.getElementById('ins_Catalogue_name').style.borderColor = 'red';
            document.getElementById('ins_Catalogue_name').focus();
            return false;
        } else if (this.insCatalogue['Name'].length > 200) {
            this.toastr.error('Message', 'Please input catalogue name max 200 letter');
            document.getElementById('ins_Catalogue_name').style.borderColor = 'red';
            document.getElementById('ins_Catalogue_name').focus();
            return false;
        }else {
            let checkDup = false;
            this.catalogueList.forEach(element => {
                if (this.insCatalogue['Name'] === element.name) {
                    checkDup = true;
                } 
            });
            if(!checkDup){
                document.getElementById('ins_Catalogue_name').style.borderColor = 'green';
                return true;
            }else{
                this.toastr.error('Message', 'Catalogue is existed');
                document.getElementById('ins_Catalogue_name').style.borderColor = 'red';
                document.getElementById('ins_Catalogue_name').focus();
                return false;
            }
            
        }
        return true;
    }

    validateUpdate() {
        console.log(this.updCatalogue['Name']);
        if (this.updCatalogue['Name'] == null || this.updCatalogue['Name'] == undefined) {
            this.toastr.error('Message', 'Please input catalogue name');
            document.getElementById('upd_Catalogue_name').style.borderColor = 'red';
            document.getElementById('upd_Catalogue_name').focus();
            return false;
        } else if (this.updCatalogue['Name'].length < 3) {
            this.toastr.error('Message', 'Please input catalogue name min 3 letter');
            document.getElementById('upd_Catalogue_name').style.borderColor = 'red';
            document.getElementById('upd_Catalogue_name').focus();
            return false;
        } else if (this.updCatalogue['Name'].length > 200) {
            this.toastr.error('Message', 'Please input catalogue name max 200 letter');
            document.getElementById('upd_Catalogue_name').style.borderColor = 'red';
            document.getElementById('upd_Catalogue_name').focus();
            return false;
        } else {
            let checkDup = false;
            this.catalogueList.forEach(element => {
                if (this.updCatalogue['Name'] === element.name) {
                    checkDup = true;
                } 
            });
            if(!checkDup){
                document.getElementById('upd_Catalogue_name').style.borderColor = 'green';
                return true;
            }else{
                this.toastr.error('Message', 'Catalogue is existed');
                document.getElementById('upd_Catalogue_name').style.borderColor = 'red';
                document.getElementById('upd_Catalogue_name').focus();
                return false;
            }
            
        }
        return true;
    }

    validateDes() {
        if (this.insCatalogue['Description'] != null || this.insCatalogue['Description'] != undefined) {
            if (this.insCatalogue['Description'].length < 3) {
                this.toastr.error('Message', 'Please input catalogue name min 3 letter');
                document.getElementById('ins_Catalogue_des').style.borderColor = 'red';
                document.getElementById('ins_Catalogue_des').focus();
                return false;
            } else if (this.insCatalogue['Description'].length > 200) {
                this.toastr.error('Message', 'Please input catalogue name max 200 letter');
                document.getElementById('ins_Catalogue_des').style.borderColor = 'red';
                document.getElementById('ins_Catalogue_des').focus();
                return false;
            } else {
                document.getElementById('ins_Catalogue_des').style.borderColor = 'green';
            }
        } else {
            document.getElementById('ins_Catalogue_des').style.borderColor = 'green';
        }
        return true;
    }

    validateUpdateDes() {
        if (this.updCatalogue['Description'] != '' || this.updCatalogue['Description'] != null || this.insCatalogue['Description'] != undefined) {
            if (this.updCatalogue['Description'].length < 3) {
                this.toastr.error('Message', 'Please input catalogue name min 3 letter');
                document.getElementById('upd_Catalogue_description').style.borderColor = 'red';
                document.getElementById('upd_Catalogue_description').focus();
                return false;
            } else if (this.updCatalogue['Description'].length > 200) {
                this.toastr.error('Message', 'Please input catalogue name max 200 letter');
                document.getElementById('upd_Catalogue_description').style.borderColor = 'red';
                document.getElementById('upd_Catalogue_description').focus();
                return false;
            } else {
                document.getElementById('upd_Catalogue_description').style.borderColor = 'green';
            }
        } else {
            document.getElementById('upd_Catalogue_description').style.borderColor = 'green';
        }
        return true;
    }

}
