import { AnswerDefaultModel } from './answer-default-model';

export class QuestionDefaultModel{
    DefaultQuestionId : number
    catalogueDefaultId : number
    question : string
    point: number
    isActive : boolean
    answer :Array<AnswerDefaultModel> = []
}
