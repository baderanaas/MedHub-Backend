import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }

  async register(userDto: RegisterDto): Promise<Partial<RegisterDto>> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);
    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    newUser.age = this.calculateAge(newUser);

    if (userDto.role === 'patient') {
      const newPatient = this.patientRepository.create({
        ...newUser,
        height: userDto.height,
        weight: userDto.weight,
        bloodType: userDto.bloodType,
      });
      const patient = await this.patientRepository.save(newPatient);
      await this.userRepository.save(newUser);
      return patient;
    } else if (userDto.role === 'doctor') {
      const newDoctor = this.doctorRepository.create({
        ...newUser,
        matricule: userDto.matricule,
        speciality: userDto.speciality,
        location: userDto.location
      });
      const doctor = await this.doctorRepository.save(newDoctor);
      await this.userRepository.save(newUser);
      return doctor;
    }
  }
  calculateAge(user: Partial<RegisterDto>) {
    const today = new Date();
    const birthDate = new Date(user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() == birthDate.getMonth() &&
        today.getDate() > birthDate.getDate())
    ) {
      age = age - 1;
    }
    console.log(age);
    return age;
  }
}
