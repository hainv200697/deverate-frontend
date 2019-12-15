import { AnswerModel } from './answer-model';

export class QuestionModel{
    QuestionId : number
    CompanyCatalogueId : number
    question1 : string
    point: number
    isActive : boolean
    accountId: number
    answer :Array<AnswerModel> = []
}
