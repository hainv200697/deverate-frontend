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

    stringToOpjectDate(date){
        let time = {
            year: 0,
            month: 0,
            day: 0
        }
        const dateArr = date.split('-',3);
        time.year = parseInt(dateArr[0]);
        time.month = parseInt(dateArr[1]);
        time.day = parseInt(dateArr[2]);
        return time;
    }
}
