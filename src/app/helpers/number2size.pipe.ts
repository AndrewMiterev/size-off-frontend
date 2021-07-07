import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'number2size'
})
export class Number2sizePipe implements PipeTransform {
  transform(value: number = 0): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let multi = 0;
    let currentValue = value;
    while (currentValue >= 1024 && ++multi) {
      currentValue = currentValue / 1024;
    }
    let afterPoint = 3;
    if (currentValue > 100 || currentValue === 0) {
      afterPoint = 0;
    } else {
      if (currentValue > 10) {
        afterPoint = 1;
      } else {
        if (currentValue > 1) {
          afterPoint = 2;
        }
      }
    }
    return (`${currentValue.toFixed(afterPoint)} ${sizes[multi]}`);
  }
}
