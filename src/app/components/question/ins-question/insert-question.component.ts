import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionApiService } from '../../../services/question-api.service';
import { CatalogueApiService } from '../../../services/catalogue-api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
declare var $: any;
@Component({
    selector: 'app-insert-question',
    templateUrl: './insert-question.component.html',
    styleUrls: ['./insert-question.component.scss']
})
export class InsertQuestionComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        public router: Router,
        private questionService: QuestionApiService,
        private catelogueService: CatalogueApiService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {
    }
    count=1;
    answerForm: FormGroup;
    submitted = false;
    index = 0;
    question = {};
    allQuestions = [];
    catalogue = {};
    catalogueList = [
        {
            'CatalogueID': 1,
            'Catalogue_name': "hihhihi"
        },
        {
            'CatalogueID': 2,
            'Catalogue_name': "hahahah"
        },
        {
            'CatalogueID': 3,
            'Catalogue_name': "hâhahah"
        }
    ];
    ngOnInit() {
        this.answerForm = this.formBuilder.group({
            answers: this.formBuilder.array([
                this.addAnswerForm()
            ])
        });
        this.question['question_name'] = '';
        this.question['cate_id'] = '';
        this.getAllQuestion();
        console.log(this.catalogueList);
    }
    // dynamic form


    onAddAnswers() {
        this.count++;
        console.log(this.count);            
        (<FormArray>this.answerForm.controls['answers']).push(this.addAnswerForm());
    }

    addAnswerForm(): FormGroup {
        return this.formBuilder.group({
            answers: ['', Validators.required],
            mark: ['', Validators.required]
        })
    }

    removeUnit(i: number) {
        this.count--;
        const control = <FormArray>this.answerForm.controls['answers'];
        control.removeAt(i);
    }

    //Endynamic form 


    open(content) {
        this.modalService.open(content, { size: 'lg', backdrop: 'static',   ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

        });
    }

    next() {
        if (this.index == 1) {
            $('.next').css('display', 'none');
        }
        else {
            $('.next').css('display', 'block');
            $('.back').css('display', 'block');
        }
        this.index += 1;
    }

    back() {
        if (this.index == 1) {
            $('.back').css('display', 'none');
        }
        else {
            $('.back').css('display', 'block');
            $('.next').css('display', 'block');
            
        }
        this.index -= 1;
    }

    // insertQuestionSubmit() {
    //     this.addQuestion();
    // }

    addQuestion() {
        this.question['status'] = +this.question['status'];
        this.question['create_by'] = 1;
        console.log(this.question);
        this.questionService.insertQuestion(this.question).subscribe(
            (results) => {

                console.log(results);
            }
        );
    }

    getAllQuestion() {
        this.questionService.getAllQuestion().subscribe(
            (data) => {

                this.allQuestions = data['data']['data'];
                console.log(JSON.stringify(this.allQuestions));
            }
        );
    }

    addformQuestion(){

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