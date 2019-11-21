import { Component, OnInit } from '@angular/core';
import { AnswerApiService } from 'src/app/services/answer-api.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-answer',
    templateUrl: './answer.component.html',
    styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {
    constructor(
        private answerService: AnswerApiService,
        private activeRoute: ActivatedRoute,
        private modalService: NgbModal,
        private toastr: ToastrService,
    ) { }
    public loading = false;
    searchText = '';
    iconIsActive = true;
    selectedAll: any;
    answerList = [];
    insAnswer = {};
    updAnswer = {};
    updateStatus = [];
    checkAdd=false;
    checkUpd=true;
    id: number = this.activeRoute.snapshot.params.id;
    ngOnInit() {
        this.getAnswerById(true);
    }

    clickButtonRefresh() {
        this.getAnswerById(this.iconIsActive);
    }

    getAnswerById(status) {
        this.iconIsActive = status;
        this.answerService.getAllAnswerByQuestioId(this.id, status).subscribe(
            (data: any) => {
                console.log(data);
                this.answerList = data;
            }
        );
    }
    // modal
    // insert
    open(create) {
        this.modalService.open(create, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    }


    // update
    openUpdateModal(item, update) {
        this.updAnswer['AnswerId'] = item['AnswerId'];
        this.updAnswer['answer'] = item['answer'];
        this.updAnswer['point'] = item['point'];
        this.updAnswer['isActive'] = true;
        this.updAnswer['questionId'] = item['questionId'];
        this.modalService.open(update, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });

    }

    // close modal
    closeModal() {
        this.modalService.dismissAll();
    }

    // submit
    // insert submit
    insertAnswerSubmit() {
        this.insertAnswer();
        this.closeModal();
    }

    // insert submit
    updateAnswerSubmit() {
        this.updateAnswer();
        this.closeModal();
    }

    // function 
    // insert answer function
    insertAnswer() {
        if (this.validate()) {
            this.insAnswer['isActive'] = true;
            this.insAnswer['questionId'] = this.id;
            this.loading = true;
            this.insAnswer['questionId'] = parseInt(this.insAnswer['questionId']);
            this.answerService.insertAnswer(this.insAnswer).subscribe(
                (results) => {
                    console.log(results);
                    this.loading = false;
                    this.getAnswerById(true);
                    this.toastr.success(results['message']);
                }
            );
        }
    }

    // update anser function
    updateAnswer() {
        this.loading = true;
        console.log(this.updAnswer);
        this.answerService.updateAnswer(this.updAnswer).subscribe(
            (results) => {
                console.log(results);
                this.loading = false;
                this.getAnswerById(this.iconIsActive);
                this.toastr.success(results['message']);
            }
        );
    }

    // change status
    clickButtonChangeStatus(status: boolean) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Status will be changed!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Change it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                for (let i = 0; i < this.updateStatus.length; i++) {
                    this.updateStatus[i].IsActive = status;
                }
                this.answerService.disableAnswer(this.updateStatus).subscribe(data => {
                    this.getAnswerById(this.iconIsActive);
                    this.selectedAll =false;
                    this.closeModal();
                    Swal.fire('Success', 'The status has been changed', 'success');
                });;
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

    // select answer
    selectAll() {
        this.updateStatus = [];
        for (let i = 0; i < this.answerList.length; i++) {
            this.answerList[i].selected = this.selectedAll;
            this.updateStatus.push(this.answerList[i]);
        }
    }

    checkIfAllSelected() {
        this.updateStatus = [];
        this.selectedAll = this.answerList.every(function (item: any) {
            return item.selected === true;

        });
        for (let i = 0; i < this.answerList.length; i++) {
            if (this.answerList[i].selected === true) {
                this.updateStatus.push(this.answerList[i]);
            }
        }

    }



    validate() {
        if (this.insAnswer['answer'].trim().length < 5) {
            this.toastr.error("Answer has more than 5 letters");
            return false;
        }
        if (this.insAnswer['point'] < 0 || this.insAnswer['point'] > 6) {
            this.toastr.error("Point must be in range from 1 to 6");
            return false;
        }
        this.checkAdd = true;
        return true;
    }

    validateUpdate() {

        if (this.updAnswer['answer'].trim().length < 5) {
            this.toastr.error("Answer has more than 5 letters");
            this.checkUpd = false;
            return false;
        }
        if (this.updAnswer['point'] < 0 || this.updAnswer['point'] > 6) {
            this.toastr.error("Point must be in range from 1 to 6");
            this.checkUpd = false;
            return false;
        }
        this.checkUpd = true;
        return true;
    }

}
