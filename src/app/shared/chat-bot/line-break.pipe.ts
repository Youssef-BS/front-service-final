import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreakTransform',
  standalone: true
})
export class LineBreakPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br>');
  }
} 