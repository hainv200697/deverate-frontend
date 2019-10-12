import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CatalogueFilterPipe' })
export class CatalogueFilterPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(item => {
          return (
            (item.Name.search(searchText) !== -1) ||
            (item.Description.search(searchText) !== -1)
          );
      });
    }
  }
}