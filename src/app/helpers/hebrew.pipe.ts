import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'hebrew'
})
export class HebrewPipe implements PipeTransform {
  private hebrewWordMask = '.*[קראטוןםפשדגכעיחלךףזסבהנמצתץ].*';
  private separatorsWordMask = new RegExp(' +|\\\+|\\*|/|:|\\\?', 'g');

  hebrewText(str: string): boolean {
    return !!(str || '').match(this.hebrewWordMask);
  }

  transformHebrewWord(str: string): string {
    // console.log(str);
    const arr = str.split(/([()])(.+)([()])/i);
    if (arr.length > 1) {
      return arr.reverse().join('');
    }
    return str;
  }

  transform(str: string): string {
    // console.log(str);
    str = str || '';
    const arrayOfWords = str.split(this.separatorsWordMask);
    // console.log(arrayOfWords);
    return (this.hebrewText(str) ? arrayOfWords : arrayOfWords.reverse())
      .map(w => this.hebrewText(w) ? this.transformHebrewWord(w) : w.split('').reverse().join(''))
      .join(' ');
  }
}
