import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CompanyFilterPipe' })
export class CompanyFilterPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(item => {
          return (
            (item.name.search(searchText) !== -1) ||
            (item.phone.toString().search(searchText) !== -1)
          );
      });
    }
  }
}