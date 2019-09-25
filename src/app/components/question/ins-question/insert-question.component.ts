import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionApiService } from '../../../services/question-api.service';
import { CatalogueApiService } from '../../../services/catalogue-api.service';

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
    ) {
    }

    question ={};
    allQuestions =[];
    catalogue={};
    
    ngOnInit() {
        
        this.question['question_name']='';
        this.question['cate_id']='';
        this.getAllQuestion();
    }

    insertQuestionSubmit(){
        this.addQuestion();
    }

    addQuestion(){
        this.question['status']= +this.question['status'];
        this.question['create_by'] = 1;
        console.log(this.question);
        this.questionService.insertQuestion(this.question).subscribe(
            (results) => {

                console.log(results);
            }
        );
    }

    getAllQuestion(){
        this.questionService.getAllQuestion().subscribe(
            (data) => {

                this.allQuestions = data['data']['data'];
                console.log(JSON.stringify(this.allQuestions));
            }
        );
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