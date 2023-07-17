import { DatePipe } from '@angular/common';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

export type SortOrder = 'asc' | 'desc';

@Injectable()
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {

  constructor(private datePipe?: DatePipe) {}

  transform(value: any[], sortOrder: SortOrder | string = 'asc', sortKey?: string): any {
    sortOrder = sortOrder && (sortOrder.toLowerCase() as any);

    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) return value;

    let numberArray = [];
    let stringArray = [];
    let objectArray = [];

    if (!sortKey) {
      numberArray = value.filter(item => typeof item === 'number').sort();
      stringArray = value.filter(item => typeof item === 'string').sort();
      objectArray = value.filter(item => typeof item === 'object');
    } else {
      numberArray = value.filter(item => typeof item[sortKey] === 'number').sort((a, b) => a[sortKey] - b[sortKey]);


      stringArray = value
        .filter(item => typeof item[sortKey] === 'string')
        .sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return -1;
            else if (a[sortKey] > b[sortKey]) return 1;
            else return 0;
        });


      objectArray = value
        .filter(item => typeof item[sortKey] === 'object')
        .sort((a, b) => {
            if(sortKey === 'modifiedDate'){
                let a_time = this.datePipe? this.datePipe.transform(a[sortKey], 'dd/MM/yyyy HH:mm:ss') : a[sortKey];
                let b_time = this.datePipe? this.datePipe.transform(b[sortKey], 'dd/MM/yyyy HH:mm:ss') : b[sortKey];
                a_time = a_time ? a_time : '';
                b_time = b_time ? b_time : '';
                if (a_time < b_time) return -1;
                else if (a_time > b_time) return 1;
                else return 0;
            }else{
                if (a[sortKey] < b[sortKey]) return -1;
                else if (a[sortKey] > b[sortKey]) return 1;
                else return 0;
            }
        });




    }
    const sorted = numberArray.concat(stringArray).concat(objectArray);
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }
}
