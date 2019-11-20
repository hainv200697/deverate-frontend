import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CatalogueDefaultFilterPipe' })
export class CatalogueDefaultFilterPipe implements PipeTransform {
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