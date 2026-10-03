import { Pipe, PipeTransform } from '@angular/core';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(isoDate: string): string {
    const date = new Date(isoDate);
    const diff = Date.now() - date.getTime();

    if (diff < HOUR) {
      const minutes = Math.max(1, Math.round(diff / MINUTE));
      return `Há ${minutes} minuto${minutes === 1 ? '' : 's'}`;
    }

    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const isToday = date.toDateString() === new Date().toDateString();
    if (isToday) {
      return `Hoje às ${time}`;
    }

    const day = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `${day} às ${time}`;
  }
}
