import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, // ✅ Import this
} from '@nestjs/common';
import { DoctorNoteService } from './doctor-note.service';
import { CreateDoctorNoteDto } from './dto/create-doctor-note.dto';
import { UpdateDoctorNoteDto } from './dto/update-doctor-note.dto';

@Controller('doctor-notes')
export class DoctorNoteController {
  constructor(private readonly doctorNoteService: DoctorNoteService) {}

  @Post()
  async create(
    @Body() createDoctorNoteDto: CreateDoctorNoteDto,
    @Body('doctorId', ParseIntPipe) doctorId: number,
    @Body('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.doctorNoteService.create(createDoctorNoteDto, doctorId, patientId);
  }

  @Get()
  async findAll() {
    return this.doctorNoteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorNoteService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorNoteDto: UpdateDoctorNoteDto,
  ) {
    return this.doctorNoteService.update(id, updateDoctorNoteDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorNoteService.softRemove(id);
  }
}
