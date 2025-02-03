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
import { StatusEnum } from 'src/common/enums/status.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('/appointment')
//@UseGuards(JwtAuthGuard)
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

  //working here
  @Get('/patient/upcoming/:username')
  async getUpcomingAppointments(
    @Param('username') username: string,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getUpcomingAppointments(username);
  }
  @Get('/patient/upcomingNumber/:username')
  async getUpcomingAppointmentsNumber(
    @Param('username') username: string,
  ): Promise<number> {
    return await this.AppointmentService.getUpcomingAppointmentsNumber(username);
  }
  @Get('/patient/requests/:username')
  async getPatientRequests(
    @Param('username') userName: string,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getPatientRequests(userName);
  }

  @Get('/patient/history/:username')
  async getPatientHistory(
    @Param('username') username: string,
  ): Promise<Appointment[]> {
    return await this.AppointmentService.getPatientHistory(username);
  }
  @Get('/patient/next/:username')
  async getPatientNextAppointment(
    @Param('username') username: string,
  ): Promise<Appointment> {
    return await this.AppointmentService.getNextAppointment(username);
  }
  @Get('/patient/notpayed/:username')
  async getPatientNotPayed(
    @Param('username') username: string,
  ): Promise<number> {
    return await this.AppointmentService.getNotPayedAppointments(username);
  }
  

  //till here
  @Get('doctor')
  async getAppointmentsByDoctorName(@Query('name') name: string): Promise<Appointment[]> {
    return await this.AppointmentService.getAppointmentsByDoctorName(name);
  }

  @Get('doctor/:id')
  async getDoctorAppointments(@Param('id') id: number): Promise<Appointment[]> {
    return await this.AppointmentService.getDoctorAppointments(id);
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
    @Body() status: StatusEnum,
  ): Promise<Appointment> {
    return await this.AppointmentService.respondAppointment(id, status);
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

 // @Put('complete/:id')
 // async completeAppointment(@Param('id') id: number): Promise<Appointment> {
  //  return await this.AppointmentService.completedAppointment(id);
 // }
 //forcit el complete and it works
 @Put('complete/:id')
 async completeAppointment(@Param('id') id: number): Promise<Appointment> {
     return await this.AppointmentService.completeAppointment(id);
 }
 
}