import { AnswerModel } from './answer-model';

export class QuestionModel{
    QuestionID : number
    CategoryID : number
    Question : string
    Status : boolean
    Create_by: number
    Answer :Array<AnswerModel> = []
}