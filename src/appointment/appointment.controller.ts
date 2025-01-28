import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  // Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entity/appointment.entity';

import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailableSessionsDto } from './dto/availableSessionsDto';
import { StatusEnum } from 'src/common/enums/status.enum';

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
    return await this.AppointmentService.getPatientAppointments(userName);
  }

  @Get('patient/history/:username/?status=:status?&date=:date?')
  async getPatientAppointmentsHistory(
    @Param('username') username: string,
    @Query('status') status: StatusEnum,
    @Query('date') date: Date,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getPatientAppointmentsHistory(
      username,
      { status, date },
    );
  }
  @Get('patient/upcoming/:username')
  async getPatientUpcomingAppointments(
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

  @Get('doctor/history/:matricule/?status=:status?&date=:date?')
  async getDoctorAppointmentsHistory(
    @Param('matricule') matricule: number,
    @Query('status') status: StatusEnum,
    @Query('date') date: Date,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getDoctorAppointmentsHistory(
      matricule,
      { status, date },
    );
  }

  @Get('doctor/upcoming/:matricule')
  async getDoctorUpcomingAppointments(
    @Param('matricule') matricule: number,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getDoctorUpcomingAppointments(
      matricule,
    );
  }

  @Get('doctor/pending/:matricule')
  async getDoctorPendingAppointments(
    @Param('matricule') matricule: number,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getDoctorPendingAppointments(
      matricule,
    );
  }

  @Post('patient/:patientUserName/:matricule')
  async createAppointmentByPatient(
    @Body() date: CreateAppointmentDto,
    @Param('patientUserName') patientUserName: string,
    @Param('matricule') matricule: number,
  ): Promise<Appointment> {
    return await this.AppointmentService.addAppointmentByPatient(
      date,
      patientUserName,
      matricule,
    );
  }

  @Post('doctor/:matricule/:username')
  async createAppointmentByDoctor(
    @Body() date: CreateAppointmentDto,
    @Param('matricule') matricule: number,
    @Param('username') username: string,
  ): Promise<Appointment> {
    return await this.AppointmentService.addAppointmentByDoctor(
      date,
      matricule,
      username,
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
    @Query('available-sessions') availableSessions: AvailableSessionsDto,
  ): Promise<number[]> {
    return await this.AppointmentService.getAvailableSessions(
      availableSessions,
    );
  }

  @Put('complete/:id')
  async completeAppointment(@Param('id') id: number) {
    await this.AppointmentService.completedAppointment(id);
  }
}
