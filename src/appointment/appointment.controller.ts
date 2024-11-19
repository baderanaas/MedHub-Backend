import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entity/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { StatusEnum } from 'src/common/enums/status.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('appointment')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly AppointmentService: AppointmentService) {}

  @Get()
  async getAppointments(): Promise<Appointment[]> {
    return await this.AppointmentService.getAppointments();
  }

  @Get(':id')
  async getAppointment(@Param('id') id: number): Promise<Appointment> {
    return await this.AppointmentService.getAppointment(id);
  }

  @Post(':patientId/doctorId')
  async createAppointment(
    @Body() data: CreateAppointmentDto,
    @Param('patientId') patientId: number,
    @Param('doctorId') doctorId: number,
  ): Promise<Appointment> {
    return await this.AppointmentService.addAppointment(
      data,
      patientId,
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
    @Body() status: StatusEnum,
  ): Promise<Appointment> {
    return await this.AppointmentService.respondAppointment(id, status);
  }

  @Put('complete/:id')
  async completeAppointment(@Param('id') id: number): Promise<Appointment> {
    return this.AppointmentService.completedAppointment(id);
  }
}
