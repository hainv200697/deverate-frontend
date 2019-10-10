import { AnswerModel } from './answer-model';

export class QuestionModel{
    QuestionId : number
    CategoryId : number
    Question1 : string
    Status : boolean
    CreateBy: number
    Answer :Array<AnswerModel> = []
}