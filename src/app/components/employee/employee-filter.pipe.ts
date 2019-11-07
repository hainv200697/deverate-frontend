import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'EmployeeFilterPipe' })
export class EmployeeFilterPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(item => {
          return (
            (item.fullname.search(searchText) !== -1) ||
            (item.username.search(searchText) !== -1) ||
            (item.email.toString().search(searchText) !== -1)
          );
      });
    }
  }
}