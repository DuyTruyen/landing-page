import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../constants/constants';

@Pipe({ name: 'visitSession' })
export class VisitSessionPipe implements PipeTransform {
  constructor() {}
  transform(value: number): string {
    let sessions = Constants.SESSION;
    let session = sessions.filter((t) => t.value == value);
    if (session.length) {
        return session[0].label
    }

    return '';
  }
}
