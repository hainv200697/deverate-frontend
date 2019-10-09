import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
        private toastr: ToastrService
    ) {
    }
    // excel param
    arrayBuffer: any;
    file: File;
    create = 0;
    listDataExcel = [];
    eachAnswer = {}
    listAnswer:Array<AnswerModel>=[];
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
    // Catalogue
    catalogue = [];
    allQuestions =[];


    // Import excel file
    changeIns(key) {
        this.create = key;
    }
    incomingfile(event) {
        this.file = event.target.files[0];
    }

    readExcel() {


        let fileReader = new FileReader();
        fileReader.onload = (e) => {

            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.listDataExcel = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            this.formatExcel(this.listDataExcel);
            
        }
        fileReader.readAsArrayBuffer(this.file);
    }

    formatExcel(list) {


        list.forEach(element => {
            let questionObj = new QuestionModel();
            
            this.listAnswer = [];
            questionObj.Question = element['Question'];
            questionObj.Status = true;
            questionObj.Create_by =1;
            questionObj.CategoryID = 15;
            for (var i = 0; i <= 5; i++) {
                let answerObj = new AnswerModel();
                if (i == 0) {

                    answerObj.Answer = element['answer'];
                    answerObj.Point = element['point'];
                    this.listAnswer.push(answerObj);
                } else if (element['answer_' + i] != null || element['answer_' + i] != undefined) 
                {
                    answerObj.Answer = element['answer_' + i];
                    answerObj.Point = element['point_' + i];
                    this.listAnswer.push(answerObj);
                }
            }
            questionObj.Answer = this.listAnswer;
            this.listInsert.push(questionObj);
            
        });
        // console.log(this.listInsert);
    }
    // End import
    next() {
        if (this.create === 0) {
            this.insAnswer = this.answerForm.controls['answers'].value;
            let check = true;
            const catalog = this.insQuestion['CatalogueId'];
            if (catalog === "" || catalog === undefined || catalog === null) {
                this.toastr.error('Message', 'Cataloguecan not be blank!');
                $('#ins_question_cate_id').css('border-color', 'red');
                $('#ins_question_cate_id').focus();
                return;
            }
            const question = this.insQuestion['question'];
            if (question === "" || question === undefined || question === null) {
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
                if (check == true) {
                    var ans = element['Answer'];
                    if (ans === "" || ans.length < 5) {
                        this.toastr.error('Message', 'Answer must be more than 5 characters!');
                        check = false;
                        $('.ans-' + i).css('border-color', 'red');
                        $('.ans-' + i).focus();
                        return;
                    }
                    const mark: number = element['mark'];
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
                }
                else {
                    return;
                }
            });
            if (check == true) {
                this.stepper.next();
                this.index++;
            }
        }
        else {
            this.readExcel();
            this.questionService.insertQuestionByExcel(this.listInsert).subscribe(
                (results) => {
                    console.log(results);
                }
            );
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
        this.getAllQuestion();
        this.getAllCatalogue();

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
        }
        else {
            this.toastr.error('Message', 'Can not create more than 5 answers!');
        }

    }

    addAnswerForm(): FormGroup {
        this.answersForm = this.formBuilder.group({
            Answer: ['', Validators.required],
            mark: ['', Validators.required]
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
            Answer: ['', Validators.required],
            mark: ['', Validators.required],
            AnswerId: ['', Validators.required],
        });
    }

    onAddUpdateAnswers() {
        (<FormArray>this.answerForm.controls['answers']).push(this.updateAnswerForm());
    }

    //Endynamic form 

    //Open modal 
    open(content) {
        this.index = 1;
        this.modalService.open(content, { size: 'lg', windowClass: "myCustomModalClass" });
        var a = document.querySelector('#stepper1');
        this.stepper = new Stepper(a, {
            linear: false,
            animation: true
        });
    }

    closeModal() {
        this.modalService.dismissAll();
        this.getAllQuestion();
    }

    openUpdate(item, update) {
        this.count = 0;
        this.answerForm = this.formBuilder.group({
            answers: this.formBuilder.array([
            ])
        });
        this.index = 1;

        this.getAnswerByQuestionId(item['QuestionId']);
        this.updQuestion['QuestionId'] = item['QuestionId'];
        this.updQuestion['CatalogueId'] = item['CatalogueId'];
        this.updQuestion['Question'] = item['Question'];

        this.modalService.open(update, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
        var a = document.querySelector('#stepper1');
        this.stepper = new Stepper(a, {
            linear: false,
            animation: true
        });
    }

    closeUpdateModal() {
        this.index = 0;
        this.modalService.dismissAll();
        this.getAllQuestion();
    }


    // checkbox
    selectAll() {
        this.updateStatus = [];
        for (var i = 0; i < this.allQuestions.length; i++) {
            this.allQuestions[i].selected = this.selectedAll;
            this.updateStatus.push(this.allQuestions[i])
        }
    }

    checkIfAllSelected() {
        this.updateStatus = [];
        this.selectedAll = this.allQuestions.every(function (item: any) {
            return item.selected == true;

        })
        for (var i = 0; i < this.allQuestions.length; i++) {
            if (this.allQuestions[i].selected == true) {
                this.updateStatus.push(this.allQuestions[i])
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
                for (var i = 0; i < this.updateStatus.length; i++) {
                    this.updateStatus[i].IsActive = status;
                }
                this.questionService.removeQuestion(this.updateStatus).subscribe(
                    (results) => {
                        this.getAllQuestion();
                    }
                );
                this.getAllQuestion();

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


    // end Modal
    insertQuestionSubmit() {
        this.addQuestion();
        this.closeModal();
        this.getAllQuestion();
    }

    clickButtonRefresh(refesh) {
        refesh.classList.add('spin-animation');
        setTimeout(function () {
            refesh.classList.remove('spin-animation');
        }, 500)
        this.getAllQuestion();
    }

    addQuestion() {
        this.insQuestion['IsActive'] = true;
        this.insQuestion['create_by'] = 1;
        this.questionService.insertQuestion(this.insQuestion).subscribe(
            (results) => {
                const QuestionId = results['data']['data'];
                if (QuestionId != null) {
                    this.insAnswer.forEach(element => {
                        element['QuestionId'] = QuestionId;
                        this.answerService.insertAnswer(element).subscribe(
                            (results) => {
                                this.getAllQuestion();
                            }
                        );
                    });
                }
            }
        );
        this.getAllQuestion();
    }

    addQuestionByExcel() {
        
        this.getAllQuestion();
    }

    updateQuestionSubmit() {
        this.updateQuestion();
        const disable = this.disableAnswer();
        if (disable === true) {
            this.updateAnser();
        }

        this.closeUpdateModal();

    }

    updateQuestion() {
        this.updQuestion['IsActive'] = true;
        this.updQuestion['create_by'] = 1;
        this.updQuestion['CatalogueId'] = parseInt(this.updQuestion['CatalogueId']);
        this.questionService.updateQuestion(this.updQuestion).subscribe(
            (results) => {
                this.getAllQuestion();
            }
        );
    }

    updateAnser() {
        this.updAnswer.forEach(element => {
            element['QuestionId'] = this.updQuestion['QuestionId'];
            this.answerService.updateAnswer(element).subscribe(
                (results) => {
                    console.log(results);
                }
            );
        });
        this.getAllQuestion();
    }

    disableAnswer() {
        this.updQuestion['answer'].forEach(element => {
            this.anwserDel.push(element['AnswerId']);
        });
        // this.answerService.disableAnswer(element['AnswerId']).subscribe(
        //     (results) => {
        //         console.log(results);
        //     }
        // );
        return true;
    }

    // Get all question
    getAllQuestion() {
        this.questionService.getAllQuestion().subscribe(
            (data:any[]) => {
                this.allQuestions = data;
            }
        );
    }

    // Get all catalogue
    getAllCatalogue() {
        this.catelogueService.getAllCatalogue().subscribe(
            (data) => {

                this.catalogue = data['data']['data'];
            }
        );
    }

    getAnswerByQuestionId(id: Number) {
        let questId = id + '';
        this.answerService.getAllAnswerByQuestioId(questId).subscribe(
            (data) => {

                this.updAnswer = data['data']['data'];
                this.updAnswer.forEach(item => {
                    this.ansForm = this.updateAnswerForm();
                    this.ansForm.setValue({
                        "Answer": item['Answer'],
                        "mark": item['mark'],
                        "AnswerId": item['AnswerId']
                    });

                    (<FormArray>this.answerForm.controls['answers']).push(this.ansForm);
                    this.count++;
                });
            }
        );

        return true;
    }

    getCatalogById(id: Number) {

        this.catalogue.forEach(element => {
            if (element.CatalogueId == id) {
                this.insQuestion['catalogue_name'] = element.Name;
            }
        });
    }

    // reset
    reset() {
        this.count = 1;
        this.insQuestion = {};
        this.insAnswer = [];
    }


    ngAfterViewInit() {
        $('input').focusout(function () {
            $(this).css("border-color", "#ced4da");;
        });

    }
}