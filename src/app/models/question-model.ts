import { AnswerModel } from './answer-model';

export class QuestionModel{
    QuestionId : number
    cicid : number
    question1 : string
    maxPoint: number
    isActive : boolean
    accountId: number
    answer :Array<AnswerModel> = []
}
