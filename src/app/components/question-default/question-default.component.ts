import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { QuestionApiService } from '../../services/question-api.service';
import { CatalogueApiService } from '../../services/catalogue-api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { element } from 'protractor';
import Stepper from 'bs-stepper';
import { AnswerApiService } from '../../services/answer-api.service';
import { ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'ts-xlsx';
import { QuestionDefaultModel } from '../../models/question-default-model';
import { AnswerDefaultModel } from '../../models/answer-default-model';
@Component({
    selector: 'app-question-default',
    templateUrl: './question-default.component.html',
    styleUrls: ['./question-default.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuestionDefaultComponent implements OnInit, AfterViewInit {
    constructor(
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
    catalogueName = '';
    accountId = Number(localStorage.getItem('AccountId'))
    // excel param
    checkFile = true;
    searchText = '';
    arrayBuffer: any;
    file: File;
    create = 0;
    listDataExcel = [];
    eachAnswer = {};
    listAnswer: Array<AnswerDefaultModel> = [];
    // stepper
    private stepper: Stepper;
    selectedAll: any;
    selected = false;
    updateStatus = [];
    checkDup = 0;
    ansForm: FormGroup;
    answersForm: FormGroup;
    form: any;
    count = 3;
    answerForm: FormGroup;
    submitted = false;
    index = 1;
    // Question
    question = {};
    answer = {};
    // inscrease Question
    insQuestion = {};
    insAnswer = [];
    listInsert: Array<QuestionDefaultModel> = [];
    // update Question
    updQuestion = {};
    updAnswer = [];
    anwserDel = [];
    allQuestions = [];
    insertQuestion = [];
    public loading = false;
    check = true;
    public message: Array<string> = [];
    allError = [];
    listCatalogue;
    catalogueIdExcel;

    // Import excel file
    changeIns(key) {
        this.create = key;
    }
    incomingfile(event) {
        this.checkFile = true;
        this.file = event.target.files[0];
        let name = this.file.name.split('.');
        let type = name[name.length - 1] + "";
        if (type != 'xlsx') {
            this.checkFile = false;
            this.toastr.error('File must be a excel file');
        }
        if (this.file.size > 200000) {
            this.checkFile = false;
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
            this.checkFile = true;
            this.message = [];
            let listQues = [];
            this.allError = [];
            let existedQues: string[] = [];
            list = await this.readExcel();
            var valueArr = list.map(function (item) {
                var existItem = listQues.some(Question => Question == item.Question);
                if (existItem) {
                    existedQues.push("Question  " + item.Question + " is duplicated");
                }
                else {
                    listQues.push(item.Question);
                }
            });
            list.forEach(element => {
                this.allQuestions.forEach(ques => {
                    if (element.Question.trim() == ques.question1) {
                        existedQues.push("Question  " + element.Question + " is existed");
                    }
                });
            });
            if (existedQues != null && existedQues.length != 0) {
                let duplicate = {};
                duplicate['row'] = "Question duplicated:";
                duplicate['error'] = existedQues;
                this.allError.push(duplicate);
                this.checkFile = false;
            }
            list.forEach((element, ind) => { 
                const countAnswer = Object.keys(element).length / 2 - 1;
                this.message = [];
                let errorRow = {};
                ind = ind + 1;
                const questionObj = new QuestionDefaultModel();
                this.listAnswer = [];
                questionObj.point = element['QuestionPoint'];
                if (questionObj.point === null || questionObj.point === undefined) {
                    this.message.push("Percent of question #" + ind + " is blank");
                    this.checkFile = false;
                } else if (questionObj.point < 0 || questionObj.point > 100) {
                    this.message.push("Percent of question #" + ind + " must be in range from 0 to 100");
                    this.checkFile = false;
                }
                questionObj.question = $.trim(element['Question']);
                questionObj.catalogueDefaultId = this.catalogueIdExcel;
                questionObj.isActive = true;
                if (element['Question'] == null) {
                    this.message.push("Question at # " + ind + " is blank");
                    this.checkFile = false;
                }
                for (let i = 0; i < countAnswer; i++) {
                    const answerObj = new AnswerDefaultModel();
                    if (i == 0) {
                        answerObj.answerText = element['Answer'];
                        answerObj.percent = element['Point'];
                        answerObj.isActive = true;
                    } else {
                        answerObj.answerText = element['Answer_' + i];
                        answerObj.percent = element['Point_' + i];
                        answerObj.isActive = true;
                    }
                    this.listAnswer.push(answerObj);
                }
                for (let i = this.listAnswer.length - 1; i >= 0; i--) {
                    if (this.listAnswer[i].answerText == null && this.listAnswer[i].percent == null) {
                        this.listAnswer.splice(i, 1);
                    }
                    else {
                        break;
                    }
                }
                let ans = [];
                let dupAns: string[] = []
                this.listAnswer.map(function (item) {
                    var existItem = ans.find(x => x.answer == item.answerText);
                    if (existItem) {
                        dupAns.push("Question #" + ind + " has duplicated answer");
                    } else {
                        ans.push(item);
                    }
                });

                if (dupAns != null && dupAns.length != 0) {
                    dupAns.forEach(element => {
                        this.message.push(element);
                    });
                    this.checkFile = false;
                }
                this.listAnswer.forEach((element, index) => {
                    index++;
                    const answer = $.trim(element.answerText);
                    if (answer === null || answer === undefined) {
                        this.message.push("Answer #" + index + " is blank");
                        this.checkFile = false;
                    } else if (answer.length < 3 || answer.length > 200) {
                        this.message.push("Answer #" + index + " must be in range from 3 to 200 characters ");
                        this.checkFile = false;
                    }
                    if (element.percent === null || element.percent === undefined) {
                        this.message.push("Percent of answer #" + index + " is blank!");
                        this.checkFile = false;
                    } else if (isNaN(element.percent)) {
                        this.message.push("Percent of answer #" + index + " is not a number!");
                        this.checkFile = false;
                    }
                    else if (element.percent < 0 || element.percent > 100) {
                        this.message.push("Percent of answer #" + index + " must be in range from 0 to 100! ");
                        this.checkFile = false;
                    }
                });
                questionObj.answer = this.listAnswer;
                errorRow['row'] = "Row: " + ind;
                errorRow['error'] = this.message;
                if (this.message.length > 0) {
                    this.allError.push(errorRow);
                }
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
            if(this.insQuestion['catalogueDefaultId'] == 0){
                this.toastr.error('Message', 'Please choose catalogue!');
                $('#ins_question_cate_id').css('border-color', 'red');
                $('#ins_question_cate_id').focus();
                return;
            }
            this.insAnswer.forEach(element => {
                element['isActive'] = true;
            });
            if (this.insQuestion['catalogueDefaultId'] === undefined || this.insQuestion['catalogueDefaultId'] === null) {
                this.toastr.error('Message', 'Please choose catalogue!');
                $('#ins_question_cate_id').css('border-color', 'red');
                $('#ins_question_cate_id').focus();
                return;
            }
            const question = $.trim(this.insQuestion['question']);
            if (question === '' || question === undefined || question === null) {
                this.toastr.error('Message', 'Question can not be blank!');
                $('#ins_question_question').css('border-color', 'red');
                $('#ins_question_question').focus();
                return;
            } else if (question.length < 3) {
                this.toastr.error('Message', 'question must be more than 3 characters!');
                $('#ins_question_question').css('border-color', 'red');
                $('#ins_question_question').focus();
                return;
            } else if (question.length > 200) {
                this.toastr.error('Message', 'question must be less than 200 characters!');
                $('#ins_question_question').css('border-color', 'red');
                $('#ins_question_question').focus();
                return;
            }
            const point = this.insQuestion['point'];
            if (point == null || point == undefined) {
                this.toastr.error('Message', 'Point of question can not be blank!');
                $('#ins_question_point').css('border-color', 'red');
                $('#ins_question_point').focus();
                return;
            } else if (point < 1 || point > 20) {
                this.toastr.error('Message', 'Point of question must be in range from 1 to 20!');
                $('#ins_question_point').css('border-color', 'red');
                $('#ins_question_point').focus();
                return;
            }

            let i = -1;
            let checkDup = [];
            this.insAnswer.forEach(element => {
                i++;
                if (check === true) {
                    const ans = $.trim(element['answerText']);
                    element['answer'] = ans;
                    if (ans === '' || ans.length < 3 || ans.length > 200) {
                        this.toastr.error('Message', 'Answer must be more than 3 characters!');
                        check = false;
                        $('.ans-' + i).css('border-color', 'red');
                        $('.ans-' + i).focus();
                        return;
                    }
                    checkDup.forEach(element => {
                        if (ans == element) {
                            this.toastr.error('Message', 'Answer is exist!');
                            check = false;
                            $('.ans-' + i).css('border-color', 'red');
                            $('.ans-' + i).focus();
                            return;
                        }
                    });
                    const percent: number = element['Percent'];
                    if (percent === null || percent === undefined) {
                        this.toastr.error('Message', 'Percent can not be blank!');
                        check = false;
                        $('.mark-' + i).css('border-color', 'red');
                        $('.mark-' + i).focus();
                        return;
                    }
                    if (100 < percent) {
                        this.toastr.error('Message', 'Percent can not be bigger than 100!');
                        check = false;
                        $('.mark-' + i).css('border-color', 'red');
                        $('.mark-' + i).focus();
                        return;
                    }
                    if (percent < 0) {
                        this.toastr.error('Message', 'Percent can not be smaller than 0!');
                        check = false;
                        $('.mark-' + i).css('border-color', 'red');
                        $('.mark-' + i).focus();
                        return;
                    }
                    checkDup.push(ans);
                } else {
                    return;
                }
            });
            if (check === true) {
                this.insQuestion['Answer'] = this.insAnswer;
                this.stepper.next();
                this.index = 2;
            }

        } else {
            let check = true;
            const question = $.trim(this.updQuestion['question']);
            if (question === '' || question === undefined || question === null) {
                this.toastr.error('Message', 'Question can not be blank!');
                $('#upd_question_question').css('border-color', 'red');
                $('#upd_question_question').focus();
                return;
            }
            else if (question.length < 3) {
                this.toastr.error('Message', 'question must be more than 3 characters!');
                $('#upd_question_question').css('border-color', 'red');
                $('#upd_question_question').focus();
                return;
            } else if (question.length > 200) {
                this.toastr.error('Message', 'question must be less than 200 characters!');
                $('#upd_question_question').css('border-color', 'red');
                $('#upd_question_question').focus();
                return;
            }

            if (check === true) {
                this.stepper.next();
                this.index = 2;
            }
        }
    }

    back() {
        this.listInsert = [];
        this.message = [];
        this.index = 1;
        this.stepper.previous();
    }

    async nextExcel() {
        this.listInsert = [];
        this.message = [];
        if (this.catalogueIdExcel  == 0) {
            this.toastr.error("Please choose catalogue!");
            this.checkFile = false;
        }else if (this.file != null) {
            await this.formatExcel();
            if (this.checkFile == false) {
                this.toastr.error("View list to see details", "File input is wrong fotmat!");
            } else {
                this.index = 2;
                this.stepper.next();
                const data = JSON.stringify(this.listInsert);
                this.insertQuestion = JSON.parse(data);
            }
        }
        else {
            this.toastr.error("Please input file!");
        }

    }

    onSubmit() {
        return false;
    }
    ngOnInit() {
        this.iconIsActive = true;
        if (this.accountId == null) {
            this.router.navigate(['login']);
        }
        this.insQuestion['Answer'] = [];
        this.question['question'] = '';
        this.question['cate_id'] = '';
        this.getQuestionById(true);
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
        (<FormArray>this.answerForm.controls['answers']).push(this.addAnswerForm());

    }

    addAnswerForm(): FormGroup {
        this.answersForm = this.formBuilder.group({
            answerText: ['', Validators.required],
            Percent: ['', Validators.required]
        });
        return this.answersForm;
    }
    removeUnit(i: number) {
        this.count--;
        const control = <FormArray>this.answerForm.controls['answers'];
        control.removeAt(i);
    }



    // Endynamic form

    // Open modal
    open(content) {
        this.index = 1;
        this.listInsert = [];
        this.mainForm();
        this.insQuestion['catalogueDefaultId'] = this.id;
        for (let i = 0; i < this.count - 1; i++) {
            (<FormArray>this.answerForm.controls['answers']).push(this.addAnswerForm());
        }
        this.modalService.open(content, { size: 'lg', backdrop: 'static', windowClass: 'myCustomModalClass' });
        const a = document.querySelector('#stepper1');
        this.stepper = new Stepper(a, {
            linear: false,
            animation: true
        });
    }

    openModalExcel(excel) {
        this.index = 1;
        this.message = [];
        this.allError = [];
        this.listInsert = [];
        this.catalogueIdExcel = this.id;
        this.modalService.open(excel, { size: 'lg', backdrop: 'static', windowClass: 'myCustomModalClass' });
        const a = document.querySelector('#stepper1');
        this.stepper = new Stepper(a, {
            linear: false,
            animation: true
        });
    }
    closeModal() {
        this.listInsert = [];
        this.modalService.dismissAll();
        this.reset();
    }

    openUpdate(item, update) {
        this.index = 1;
        this.updQuestion['QuestionDefaultId'] = item['QuestionDefaultId'];
        this.updQuestion['point'] = item['point'];
        this.updQuestion['catalogueDefaultId'] = item['catalogueDefaultId'];
        this.updQuestion['question'] = item['question'];
        this.updQuestion['catalogueName'] = item['catalogueName'];
        this.updQuestion['isActive'] = true;
        this.catalogueName = item['catalogueName'];
        this.modalService.open(update, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
        const a = document.querySelector('#stepper1');
        this.stepper = new Stepper(a, {
            linear: false,
            animation: true
        });
    }

    closeUpdateModal() {
        this.index = 1;
        this.reset();
        this.modalService.dismissAll();
    }
    closeExcel() {
        this.message = [];
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
                this.selected = true;
                this.updateStatus.push(this.allQuestions[i]);
            }
        }

    }

    clickButtonChangeStatus(status: boolean) {
        if (this.selectedAll == true || this.selected == true) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'This catalogue will be changed!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Change it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    for (let i = 0; i < this.updateStatus.length; i++) {
                        this.updateStatus[i].IsActive = status;
                    }
                    this.loading = true;
                    this.questionService.removeQuestionDefault(this.updateStatus).subscribe(
                        (results) => {
                            this.selectedAll = false;
                            this.getQuestionById(this.iconIsActive);
                            this.toastr.success("Changed success");
                        }
                        , (error) => {
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
    }


    // end Modal
    insertQuestionSubmit(key) {
        if (key === 'excel') {
            this.addQuestionByExcel();
        } else {
            this.addQuestion();
        }
    }

    clickButtonRefresh(refesh) {
        refesh.classList.add('spin-animation');
        setTimeout(function () {
            refesh.classList.remove('spin-animation');
        }, 500);
        this.getQuestionById(this.iconIsActive);
    }

    addQuestion() {
        this.loading = true;
        this.insQuestion['isActive'] = true;
        this.insertQuestion = [];
        this.insertQuestion.push(this.insQuestion);
        this.questionService.insertQuestionDefault(this.insertQuestion).subscribe(
            (results) => {
                this.getQuestionById(this.iconIsActive);
                this.toastr.success(results['message']);
                this.closeModal();
            },
            (error) => {
                if (error.status == 0) {
                    this.toastr.error("System is not available");
                }
                if (error.status == 400) {
                    if (error.error != null) {
                        this.toastr.error("Questions : " + error.error + " is existed!");
                    }
                    else {
                        this.toastr.error("Input is invalid");
                    }
                }
                if (error.status == 500) {
                    this.toastr.error("System error");
                }
                this.loading = false;
            }
        );
    }

    async addQuestionByExcel() {
        this.questionService.insertQuestionDefault(this.insertQuestion).subscribe(
            (results) => {
                this.getQuestionById(this.iconIsActive);
                this.toastr.success(results['message']);
                this.closeModal();
            },
            (error) => {
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

    updateQuestionSubmit() {
        this.updateQuestion();
        this.closeUpdateModal();

    }

    updateQuestion() {
        this.questionService.updateQuestionDefault(this.updQuestion).subscribe(
            (results) => {
                this.getQuestionById(this.iconIsActive);
                this.toastr.success(results['message']);
            },
            (error) => {
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



    // Get all question
    getQuestionById(status) {
        this.loading = true;
        this.iconIsActive = status;
        this.questionService.getQuestionDefault(this.id, this.iconIsActive).subscribe(
            (data: any) => {
                this.loading = false;
                this.allQuestions = data;
                this.selected = false;
                this.selectedAll = false;
            },
            (error: any) => {
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

    // reset
    reset() {
        this.count = 3;
        this.insQuestion = {};
        this.insAnswer = [];
    }


    ngAfterViewInit() {
        $('input').focusout(function () {
            $(this).css('border-color', '#ced4da');
        });

    }

    viewAnswer(item) {
        this.router.navigate(['/manage-answer-default/', item['QuestionDefaultId']]);
    }

    downloadTemplate() {
        let link = document.createElement("a");
        link.download = "Question_Template";
        link.href = "/assets/file/question.xlsx";
        link.click();
    }

    getAllCatalogue() {
        this.loading = true;
        this.catelogueService.getAllCatalogueDefault(true).subscribe(
            (data: any[]) => {
                this.loading = false;
                this.listCatalogue = data;
                console.log(data);
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

    changeCatalogueName(name){
        this.catalogueName = name;
    }
}
