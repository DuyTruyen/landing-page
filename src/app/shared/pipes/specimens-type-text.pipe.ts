import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'specimensTypeText'
})
export class SpecimensTypeTextPipe implements PipeTransform {
    constructor(){}
    transform(specimensType: any): string {
        const parsed = parseInt(specimensType);
        switch (parsed) {
            case 1:
                return 'Tế bào học';
            case 2:
                return 'Mô bệnh học';
            case 3:
                return 'Pap Smear';
            default:
                return '';
        }
    }


}
