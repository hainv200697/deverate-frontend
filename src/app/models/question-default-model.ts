import { AnswerModel } from './answer-model';

export class QuestionDefaultModel{
    DefaultQuestionId : number
    catalogueDefaultId : number
    question : string
    point: number
    isActive : boolean
    answer :Array<AnswerModel> = []
}
