import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('/doctor')
//@UseGuards(JwtAuthGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  
  @Get()
  async getDoctors(): Promise<Doctor[]> {
    return await this.doctorService.getDoctors();
  }
  // @Get('/:mat')
  // async getDoctor(@Param('mat') matricule: number): Promise<Doctor> {
  //   return await this.doctorService.getDoctorByMat(matricule);
  // }
  @Get('/one')
  async getDoctorByName(@Query('name') name): Promise<Doctor[]> {
    return this.doctorService.getDoctorByName(name);
  }


  //here
  @Get('username/:username')
  async getDoctor(@Param('username') username: string) {
    console.log(username);
    return await this.doctorService.getDoctorByUserName(username);
  }

  


}
