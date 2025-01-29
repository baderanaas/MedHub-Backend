import {
  Body,
  Controller,
  // Delete,
  Get,
  Param,
  Post,
  // Put,
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('patient')
//@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async getPatients() {
    return await this.patientService.getPatients();
  }

  @Get(':username')
  async getPatient(@Param('username') username: string) {
    return await this.patientService.getPatientByUserName(username);
  }

  @Post()
  async addPatient(@Body() patientDto: CreatePatientDto) {
    return await this.patientService.addPatient(patientDto);
  }

  // @Put(':id')
  // async updatePatient(
  //   @Body() patientDto: CreatePatientDto,
  //   @Param('id') id: number,
  // ) {
  //   return await this.patientService.updatePatient(patientDto, id);
  // }

  // @Delete(':id')
  // async deletePatient(@Param('id') id: number) {
  //   return await this.patientService.deletePatient(id);
  // }
}
