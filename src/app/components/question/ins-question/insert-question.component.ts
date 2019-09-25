import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionApiService } from '../../../services/question-api.service';

@Component({
    selector: 'app-insert-question',
    templateUrl: './insert-question.component.html',
    styleUrls: ['./insert-question.component.scss']
})
export class InsertQuestionComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        public router: Router,
        private questionService: QuestionApiService
    ) {
    }

    question ={};
    allQuestions =[];

    ngOnInit() {
        this.question['question_name']='';
        this.question['cate_id']='';
        this.getAllQuestion();
    }

    insertQuestionSubmit(){
        this.addQuestion();
    }

    addQuestion(){
        this.question['create_by'] = 1;
        console.log(this.question);
        // this.apiService.insertQuestion
    }

    getAllQuestion(){
        this.questionService.getAllQuestion().subscribe(
            (data) => {

                this.allQuestions = data['data']['data'];
                console.log(JSON.stringify(this.allQuestions));
            }
        );
    }
}