import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'AnswerFilterPipe' })
export class AnswerFilterPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(item => {
          return (
            (item.answer.search(searchText) !== -1) ||
            (item.point.toString().search(searchText) !== -1)
          );
      });
    }
  }
}