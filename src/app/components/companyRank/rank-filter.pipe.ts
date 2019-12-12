import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'RankFilterPipe' })
export class RankFilterPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(item => {
          return (
            (item.name.search(searchText) !== -1)
          );
      });
    }
  }
}