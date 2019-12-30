import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'SemesterFilterPipe' })
export class SemesterFilterPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(item => {
          return (
            (item.username.search(searchText) !== -1)
          );
      });
    }
  }
}