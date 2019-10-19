import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { AnswerApiService } from 'src/app/services/answer-api.service';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-answer',
    templateUrl: './answer.component.html',
    styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {
    constructor(
        private apiService: ApiService,
        private answerService: AnswerApiService,
        private activeRoute: ActivatedRoute
    ) { }

    answerList =[];
    id: number = this.activeRoute.snapshot.params.id;
    ngOnInit() {
        this.getAnswerById();
    }

    getAnswerById() {
        this.answerService.getAllAnswerByQuestioId(this.id).subscribe(
            (data: any) => {
                console.log(data);
                this.answerList = data;
            }
        );
    }
}
