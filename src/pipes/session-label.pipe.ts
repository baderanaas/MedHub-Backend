import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { sessionTime } from 'src/common/enums/sessiontime.enum';

@Injectable()
export class SessionLabelPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1 && value <= sessionTime.length) {
      const session = sessionTime[value - 1];  
      return `${session.start} -> ${session.end}`; 
    }
    throw new BadRequestException(`Session ${value} out of range`);  
  }
}
