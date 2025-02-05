import {
  Body,
  Controller,
  // Delete,
  Get,
  Param,
  Post,
  // Put,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';

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

  @Get('completed/doctor/:doctorUsername')
  async getPatientsByDoctorUsername(
    @Param('doctorUsername') doctorUsername: string,
  ): Promise<Patient[]> {
    return this.patientService.getPatientsByDoctorUsername(doctorUsername);
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