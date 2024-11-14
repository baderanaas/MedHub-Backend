import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entity/appointment.entity';
import { User } from 'src/decorators/user.decorator';
import { AddAppointment } from './dto/add-appointment.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { DoctorEntity } from 'src/doctor/entity/doctor.entity';
import { PatientEntity } from 'src/patient/entity/patient.entity';
import { UpdateAppointment } from './dto/update-appointment.dto';
import { App } from 'supertest/types';
import { Doctor } from 'src/decorators/doctor.decorator';
import { StatusEnum } from 'src/enums/status.enum';
import { promises } from 'dns';
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly AppointmentService: AppointmentService) {}

  // @Get()
  // async getAppointments(@User() user): Promise<Appointment[]> {
  //   return await this.AppointmentService.getAppointments(user);
  // }

  @Get(':id')
  async getAppointment(
    @User() user,
    @Param('id') id: number,
  ): Promise<Appointment> {
    return await this.AppointmentService.getAppointment(id, user);
  }

  @Post()
  async createAppointment(
    @User() user: UserEntity,
    @Body() data: AddAppointment,
  ): Promise<Appointment> {
    return await this.AppointmentService.createAppointment(user, data);
  }

  @Put(':id')
  async updateAppointment(
    @Param('id') id: number,
    @User() user: UserEntity,
    @Body() data: UpdateAppointment,
  ): Promise<Appointment> {
    return await this.AppointmentService.updateAppointment(id, data, user);
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: number, @User() user: UserEntity) {
    return await this.AppointmentService.deleteAppointment(id, user);
  }

  @Put('respond/:id')
  async respondAppointment(
    @Param('id') id: number,
    @Doctor() doctor: DoctorEntity,
    @Body() status: StatusEnum,
  ): Promise<Appointment> {
    return await this.AppointmentService.respondAppointment(id, doctor, status);
  }

  @Put('complete/:id')
  async completeAppointment(@Param('id') id: number): Promise<Appointment> {
    return this.AppointmentService.completedAppointment(id);
  }
}
