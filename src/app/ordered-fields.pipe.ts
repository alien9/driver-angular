import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderedFields'
})
export class OrderedFieldsPipe implements PipeTransform {

  transform(properties: unknown, ...args: unknown[]): unknown {
      return Object.keys(properties).filter((fu)=>!properties[fu].options || !properties[fu].options['hidden'])
  }

}
