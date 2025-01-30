import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entity/appointment.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
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

  @Get('patient/:username')
  async getPatientAppointments(
    @Param('username') userName: string,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getPatientAppointment(userName);
  }
  @Get('/patient/requests/:username')
  async getPatientRequests(
    @Param('username') userName: string,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getPatientRequests(userName);
  }
  @Get('/patient/hisory/:username')
  async getPatientHistory(
    @Param('username') username: string,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getPatientUpcomingAppointments(
      username,
    );
  }

  @Get('doctor/:id')
  async getDoctorAppointments(@Param('id') id: number): Promise<Appointment[]> {
    return await this.AppointmentService.getDoctorAppointments(id);
  }
  @Get('doctor')
  async getDoctorAppointmentsbyName(
    @Query('name') name,
  ): Promise<Appointment[]> {
    return this.AppointmentService.getByDoctorName(name);
  }

  @Post(':patientUserName/:doctorId')
  async createAppointment(
    @Body() date: CreateAppointmentDto,
    @Param('patientUserName') patientUserName: string,
    @Param('doctorId') doctorMat: number,
  ): Promise<Appointment> {
    return await this.AppointmentService.addAppointment(
      date,
      patientUserName,
      doctorMat,
    );
  }

  @Put('patient/:id/:username')
  async updateAppointmentByPatient(
    @Param('id') id: number,
    @Param('username') username: string,
    @Body() data: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return await this.AppointmentService.updateAppointmentByPatient(
      id,
      data,
      username,
    );
  }

  @Put('doctor/:id/:matricule')
  async updateAppointmentByDoctor(
    @Param('id') id: number,
    @Param('matricule') matricule: number,
    @Body() data: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return await this.AppointmentService.updateAppointmentByDoctor(
      id,
      data,
      matricule,
    );
  }

  @Delete('patient/:id/:username')
  async deleteAppointmentByPatient(
    @Param('id') id: number,
    @Param('username') username: string,
  ) {
    await this.AppointmentService.deleteAppointmentByPatient(id, username);
  }

  @Delete('doctor/:id/:matricule')
  async deleteAppointmentByDoctor(
    @Param('id') id: number,
    @Param('matricule') matricule: number,
  ) {
    await this.AppointmentService.deleteAppointmentByDoctor(id, matricule);
  }

  @Get('availableSessions')
  async getAvailableSessions(
    @Query('date') date: string,
    @Query('username')
    username: string,
  ): Promise<number[]> {
    console.log('query param' + date + username);
    const availableSessions = { date, username };
    return await this.AppointmentService.getAvailableSessions(
      availableSessions,
    );
  }

  @Put('complete/:id')
  async completeAppointment(@Param('id') id: number) {
    await this.AppointmentService.completedAppointment(id);
  }
}
