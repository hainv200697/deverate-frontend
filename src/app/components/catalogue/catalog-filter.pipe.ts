import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CatalogueFilterPipe' })
export class CatalogueFilterPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      console.log(value);
      return value.filter(item => {
          return (
            (item.name.search(searchText) !== -1)
          );
      });
    }
  }
}