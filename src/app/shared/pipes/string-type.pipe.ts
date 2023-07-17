import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringType'
})
export class StringType implements PipeTransform {
    constructor() {
    }

    transform(value: any,  args?: string): any {
        switch (args){
            case 'isEmpty' :
                return  (
                    value === undefined ||
                    value === null ||
                    (typeof value === "string" && value.trim().length === 0) ||
                    (Array.isArray(value) && value.length === 0) ||
                    (typeof value === "object" && Object.keys(value).length === 0)
                  );
                break;
        }
    }
}
