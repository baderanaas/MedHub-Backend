import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  // Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entity/appointment.entity';

import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { StatusEnum } from 'src/common/enums/status.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('/appointment')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly AppointmentService: AppointmentService) {}

  @Get()
  async getAppointments(): Promise<Appointment[]> {
    return await this.AppointmentService.getAppointments();
  }

  @Get('/patient/:username')
  async getPatientAppointments(
    @Param('username') userName: string,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getPatientAppointment(userName);
  }
  @Get('/patient/hisory/:username')
  async getPatientHistory(
    @Param('username') username: string,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getPatientHistory(username);
  }
  @Get('doctor/:id')
  async getDoctorAppointments(@Param('id') id: number): Promise<Appointment[]> {
    return await this.AppointmentService.getDoctorAppointments(id);
  }

  @Post(':patientUserName/:doctorId')
  async createAppointment(
    @Body() date: CreateAppointmentDto,
    @Param('patientUserName') patientUserName: string,
    @Param('doctorId') doctorId: number,
  ): Promise<Appointment> {
    return await this.AppointmentService.addAppointment(
      date,
      patientUserName,
      doctorId,
    );
  }

  @Put(':id')
  async updateAppointment(
    @Param('id') id: number,

    @Body() data: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return await this.AppointmentService.updateAppointment(id, data);
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: number) {
    return await this.AppointmentService.deleteAppointment(id);
  }

 
  @Put('respond/:id')
  async respondAppointment(
    @Param('id') id: number,
    @Body() body: { status: StatusEnum }  // Ensure correct format
  ): Promise<Appointment> {
    return await this.AppointmentService.respondAppointment(id, body.status);
  }
  
  

  @Put('complete/:id')
  async completeAppointment(@Param('id') id: number): Promise<Appointment> {
    return this.AppointmentService.completedAppointment(id);
  }
  @Put('pay/:id')
  async payAppointment(@Param('id') id: number): Promise<Appointment> {
  return this.AppointmentService.payAppointment(id);
  }

}
