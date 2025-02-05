import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoctorNoteService } from './doctor-note.service';
import { CreateDoctorNoteDto } from './dto/create-doctor-note.dto';
import { UpdateDoctorNoteDto } from './dto/update-doctor-note.dto';

@Controller('doctor-notes')
export class DoctorNoteController {
  constructor(private readonly doctorNoteService: DoctorNoteService) {}

  @Post(':doctorId/:patientId')
  async create(
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
    @Body() createDoctorNoteDto: CreateDoctorNoteDto,
  ) {
    return this.doctorNoteService.create(createDoctorNoteDto, doctorId, patientId);
  }
  
  

  @Get()
  async findAll() {
    return this.doctorNoteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.doctorNoteService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDoctorNoteDto: UpdateDoctorNoteDto,
  ) {
    return this.doctorNoteService.update(id, updateDoctorNoteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.doctorNoteService.softRemove(id);
  }
}
