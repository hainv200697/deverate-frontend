import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ConfigurationFilterPipe' })
export class ConfigurationFilterPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(item => {
          return (
            (item.title.search(searchText) !== -1)
          );
      });
    }
  }
}