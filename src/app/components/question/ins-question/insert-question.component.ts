import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionApiService } from '../../../services/question-api.service';
import { CatalogueApiService } from '../../../services/catalogue-api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { element } from 'protractor';
import Stepper from 'bs-stepper';
import { AnswerApiService } from '../../../services/answer-api.service';
import { ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'ts-xlsx';
import { AnswerModel } from '../../../models/answer-model';
import { QuestionModel } from '../../../models/question-model';
@Component({
    selector: 'app-insert-question',
    templateUrl: './insert-question.component.html',
    styleUrls: ['./insert-question.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InsertQuestionComponent implements OnInit, AfterViewInit {
    constructor(
        private translate: TranslateService,
        public router: Router,
        private questionService: QuestionApiService,
        private catelogueService: CatalogueApiService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private answerService: AnswerApiService,
        private toastr: ToastrService,
        private activeRoute: ActivatedRoute
    ) {
    }
    iconIsActive: boolean;
    // catalogue
    id: number = this.activeRoute.snapshot.params.id;
    // excel param
    checkFile=true;
    searchText = '';
    arrayBuffer: any;
    file: File;
    create = 0;
    listDataExcel = [];
    eachAnswer = {};
    listAnswer: Array<AnswerModel> = [];
    // stepper
    private stepper: Stepper;
    selectedAll: any;
    updateStatus = [];
    checkDup = 0;
    ansForm: FormGroup;
    answersForm: FormGroup;
    form: any;
    count = 1;
    answerForm: FormGroup;
    submitted = false;
    index = 1;
    // Question
    question = {};
    answer = {};
    // inscrease Question
    insQuestion = {};
    insAnswer = [];
    listInsert: Array<QuestionModel> = [];
    // update Question
    updQuestion = {};
    updAnswer = [];
    anwserDel = [];
    allQuestions = [];

    // Import excel file
    changeIns(key) {
        this.create = key;
    }
    incomingfile(event) {
        this.checkFile=true;
        this.file = event.target.files[0];
        if(this.file.size > 200000){
            this.checkFile=false;
            this.toastr.error('File must be smaller than 20MB');
        }
    }

    readExcel() {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {

                this.arrayBuffer = fileReader.result;
                let data = new Uint8Array(this.arrayBuffer);
                let arr = new Array();
                for (let i = 0; i != data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
                const bstr = arr.join('');
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const first_sheet_name = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[first_sheet_name];
                this.listDataExcel = XLSX.utils.sheet_to_json(worksheet, { raw: true });



                resolve(this.listDataExcel);
            };
            fileReader.readAsArrayBuffer(this.file);
        });
    }

    async formatExcel() {
        try {
            let list: any;
            list = await this.readExcel();
            list.forEach(element => {
                const questionObj = new QuestionModel();

                this.listAnswer = [];
                questionObj.question1 = element['Question'];
                questionObj.isActive = true;
                questionObj.createBy = 1;
                questionObj.catalogueId = this.id;
                for (let i = 0; i <= 5; i++) {
                    const answerObj = new AnswerModel();
                    if (i === 0) {

                        answerObj.answer1 = element['answer'];
                        answerObj.point = element['point'];
                        answerObj.isActive = true;
                        this.listAnswer.push(answerObj);
                    } else if (element['answer_' + i] != null || element['answer_' + i] !== undefined) {
                        answerObj.answer1 = element['answer_' + i];
                        answerObj.point = element['point_' + i];
                        answerObj.isActive = true;
                        this.listAnswer.push(answerObj);
                    }
                }
                questionObj.maxPoint =  Math.max.apply(Math, this.listAnswer.map(function(o) { return o.point; }));
                questionObj.answer = this.listAnswer;
                this.listInsert.push(questionObj);
            });
        } catch (err) {
            console.log(err);
        }

    }
    // End import
    next(key) {
        if (key === 'ins') {

            this.insAnswer = this.answerForm.controls['answers'].value;
            let check = true;
            this.insAnswer.forEach(element => {
                element['isActive'] = true;
            });
            this.insQuestion['MaxPoint'] = Math.max.apply(Math, this.insAnswer.map(function(o) { return o.point; }));
            this.insQuestion['Answer'] = this.insAnswer;
            const catalog = this.id;
            console.log(this.insQuestion);
            if (catalog === undefined || catalog === null) {
                this.toastr.error('Message', 'Cataloguecan not be blank!');
                $('#ins_question_cate_id').css('border-color', 'red');
                $('#ins_question_cate_id').focus();
                return;
            }
            const question = this.insQuestion['question1'];
            if (question === '' || question === undefined || question === null) {
                this.toastr.error('Message', 'Question can not be blank!');
                $('#ins_question_question').css('border-color', 'red');
                $('#ins_question_question').focus();
                return;
            }

            if (question.length < 10) {
                this.toastr.error('Message', 'question must be more than 10 characters!');
                $('#ins_question_question').css('border-color', 'red');
                $('#ins_question_question').focus();
                return;
            }

            if (question.length > 300) {
                this.toastr.error('Message', 'question must be less than 300 characters!');
                $('#ins_question_question').css('border-color', 'red');
                $('#ins_question_question').focus();
                return;
            }


            let i = -1;
            this.insAnswer.forEach(element => {
                i++;
                if (check === true) {
                    const ans = element['answer1'];
                    if (ans === '' || ans.length < 5) {
                        this.toastr.error('Message', 'Answer must be more than 5 characters!');
                        check = false;
                        $('.ans-' + i).css('border-color', 'red');
                        $('.ans-' + i).focus();
                        return;
                    }
                    const mark: number = element['point'];
                    if (mark === null || mark === undefined) {
                        this.toastr.error('Message', 'Mark can not be blank!');
                        check = false;
                        $('.mark-' + i).css('border-color', 'red');
                        $('.mark-' + i).focus();
                        return;
                    }
                    if (6 < mark || mark < 1) {
                        this.toastr.error('Message', 'Mark can not be bigger than 6!');
                        check = false;
                        $('.mark-' + i).css('border-color', 'red');
                        $('.mark-' + i).focus();
                        return;
                    }
                    if (mark < 1) {
                        this.toastr.error('Message', 'Mark can not be smaller than 1!');
                        check = false;
                        $('.mark-' + i).css('border-color', 'red');
                        $('.mark-' + i).focus();
                        return;
                    }
                } else {
                    return;
                }
            });
            if (check === true) {
                this.stepper.next();
                this.index++;
            }

        } else {
            this.updAnswer = this.answerForm.controls['answers'].value;
            let check = true;
            this.updQuestion['MaxPoint'] = Math.max.apply(Math, this.updAnswer.map(function(o) { return o.point; }));
            this.updQuestion['answer'] = this.updAnswer;
            const catalog = this.id;
            if (catalog === undefined || catalog === null) {
                this.toastr.error('Message', 'Cataloguecan not be blank!');
                $('#upd_question_cate_id').css('border-color', 'red');
                $('#upd_question_cate_id').focus();
                return;
            }
            const question = this.updQuestion['question1'];
            if (question === '' || question === undefined || question === null) {
                this.toastr.error('Message', 'Question can not be blank!');
                $('#upd_question_question').css('border-color', 'red');
                $('#upd_question_question').focus();
                return;
            }

            if (question.length < 10) {
                this.toastr.error('Message', 'question must be more than 10 characters!');
                $('#upd_question_question').css('border-color', 'red');
                $('#upd_question_question').focus();
                return;
            }

            if (question.length > 300) {
                this.toastr.error('Message', 'question must be less than 300 characters!');
                $('#upd_question_question').css('border-color', 'red');
                $('#upd_question_question').focus();
                return;
            }
            if (check === true) {
                this.stepper.next();
                this.index++;
            }
        }
    }

    back() {
        this.stepper.previous();
    }

    onSubmit() {
        return false;
    }
    ngOnInit() {
        this.insQuestion['Answer'] = [];
        this.mainForm();
        for (let i = 0; i <= 1; i++) {
            this.count++;
            (<FormArray>this.answerForm.controls['answers']).push(this.addAnswerForm());
        }
        this.question['question'] = '';
        this.question['cate_id'] = '';
        this.getQuestionById(true);
        this.insQuestion['CatalogueId'] = this.id;
        this.updQuestion['CatalogueId'] = this.id;
    }

    // dynamic form

    mainForm() {
        this.answerForm = this.formBuilder.group({
            answers: this.formBuilder.array([
                this.addAnswerForm()
            ])
        });

    }

    onAddAnswers() {

        this.count++;
        if (this.count < 6) {
            (<FormArray>this.answerForm.controls['answers']).push(this.addAnswerForm());
        } else {
            this.toastr.error('Message', 'Can not create more than 5 answers!');
        }

    }

    addAnswerForm(): FormGroup {
        this.answersForm = this.formBuilder.group({
            answer1: ['', Validators.required],
            point: ['', Validators.required]
        });
        return this.answersForm;
    }
    removeUnit(i: number) {
        this.count--;
        const control = <FormArray>this.answerForm.controls['answers'];
        control.removeAt(i);
    }

    updateAnswerForm(): FormGroup {
        return this.formBuilder.group({
            answer1: ['', Validators.required],
            point: ['', Validators.required],
            answerId: ['', Validators.required],
        });
    }

    onAddUpdateAnswers() {
        (<FormArray>this.answerForm.controls['answers']).push(this.updateAnswerForm());
    }

    // Endynamic form

    // Open modal
    open(content) {
        this.index = 1;
        this.modalService.open(content, { size: 'lg', windowClass: 'myCustomModalClass' });
        const a = document.querySelector('#stepper1');
        this.stepper = new Stepper(a, {
            linear: false,
            animation: true
        });
    }

    openModalExcel(excel) {
        this.index = 1;
        this.modalService.open(excel, { size: 'lg', windowClass: 'myCustomModalClass' });
    }
    closeModal() {
        this.modalService.dismissAll();
        this.reset();
    }

    openUpdate(item, update) {
        this.count = 0;
        this.answerForm = this.formBuilder.group({
            answers: this.formBuilder.array([
            ])
        });

        this.index = 1;
        this.updQuestion['catalogueName'] = item['catalogueName'];
        this.updQuestion['answer'] = item['answer'];
        this.getAnswerByQuestionId();
        this.updQuestion['QuestionId'] = item['QuestionId'];
        this.updQuestion['question1'] = item['question1'];
        this.updQuestion['isActive'] = true;
        this.updQuestion['createBy'] = 1;
        console.log(this.updQuestion);
        this.modalService.open(update, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
        const a = document.querySelector('#stepper1');
        this.stepper = new Stepper(a, {
            linear: false,
            animation: true
        });
    }

    closeUpdateModal() {
        this.index = 0;
        this.reset();
        this.modalService.dismissAll();
    }
    closeExcel() {
        this.modalService.dismissAll();
    }


    // checkbox
    selectAll() {
        this.updateStatus = [];
        for (let i = 0; i < this.allQuestions.length; i++) {
            this.allQuestions[i].selected = this.selectedAll;
            this.updateStatus.push(this.allQuestions[i]);
        }
    }

    checkIfAllSelected() {
        this.updateStatus = [];
        this.selectedAll = this.allQuestions.every(function (item: any) {
            return item.selected === true;

        });
        for (let i = 0; i < this.allQuestions.length; i++) {
            if (this.allQuestions[i].selected === true) {
                this.updateStatus.push(this.allQuestions[i]);
            }
        }

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
                console.log(this.updateStatus);
                this.questionService.removeQuestion(this.updateStatus).subscribe(
                    (results) => {
                        this.getQuestionById(this.iconIsActive);
                    }
                );

                Swal.fire(
                    'Deleted',
                    '',
                    'success'
                );

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.updateStatus = [];
                Swal.fire(
                    'Cancelled',
                    '',
                    'error'
                );
            }
        });
    }


    // end Modal
    insertQuestionSubmit(key) {
        if (key === 'excel') {
            this.addQuestionByExcel();
        } else {
            this.addQuestion();
        }
        this.closeModal();
    }

    clickButtonRefresh(refesh) {
        refesh.classList.add('spin-animation');
        setTimeout(function () {
            refesh.classList.remove('spin-animation');
        }, 500);
        this.getQuestionById(this.iconIsActive);
    }

    addQuestion() {
        this.insQuestion['isActive'] = true;
        this.insQuestion['createBy'] = 1;
        this.questionService.insertQuestion(this.insQuestion).subscribe(
            (results) => {
                this.getQuestionById(this.iconIsActive);
                this.toastr.success(results['message']);
            }
        );
    }

    async addQuestionByExcel() {
        await this.formatExcel();
        const data = JSON.stringify(this.listInsert);
        this.insQuestion = JSON.parse(data);
        this.questionService.insertQuestionByExcel(this.insQuestion).subscribe(
            (results) => {
                this.getQuestionById(this.iconIsActive);
            }
        );
    }

    updateQuestionSubmit() {
        console.log(this.updQuestion);
        this.updateQuestion();

        this.closeUpdateModal();

    }

    updateQuestion() {
        console.log(this.updQuestion);
        this.questionService.updateQuestion(this.updQuestion).subscribe(
            (results) => {
                this.getQuestionById(this.iconIsActive);
            }
        );
    }



    // Get all question
    getQuestionById(status) {
        this.iconIsActive = status;
        this.questionService.getQuestion(this.id,this.iconIsActive).subscribe(
            (data: any) => {
                console.log(data);
                this.allQuestions = data;
                this.insQuestion['catalogueName'] = this.allQuestions[0]['catalogueName'];
                
            }
        );
    }


    getAnswerByQuestionId() {
        this.updQuestion['answer'].forEach(item => {
            this.ansForm = this.updateAnswerForm();
            this.ansForm.setValue({
                'answer1': item['answer1'],
                'point': item['point'],
                'answerId': item['answerId']
            });
            (<FormArray>this.answerForm.controls['answers']).push(this.ansForm);
            this.count++;
        });

        return true;
    }


    // reset
    reset() {
        this.count = 1;
        this.insQuestion = {};
        this.insAnswer = [];
    }


    ngAfterViewInit() {
        $('input').focusout(function () {
            $(this).css('border-color', '#ced4da');
        });

    }

    getQuestionStatus(status) {
        console.log(status);
        this.questionService.getQuestionByStatus(status, this.id).subscribe(
            (data: any) => {
                console.log(data);
                this.allQuestions = data;
            }
        );
    }
    viewAnswer(item){
        this.router.navigate(['/manage-answer/', item['QuestionId']]);
    }
}
