import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'AnswerDefaultFilterPipe' })
export class AnswerDefaultFilterPipe implements PipeTransform {
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