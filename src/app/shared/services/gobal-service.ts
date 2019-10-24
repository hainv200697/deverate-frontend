import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GobalService {
    constructor() { }

    shuffleAnswer(listAnswer: []){
        let newListAnswer =[];
        let randomIndex= 0;
        while(listAnswer.length > 0){
            randomIndex = this.random(0,listAnswer.length-1);
            newListAnswer.push(listAnswer[randomIndex]);
            listAnswer.splice(randomIndex,1);
        }
        return newListAnswer;
    }

    random(min,max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
