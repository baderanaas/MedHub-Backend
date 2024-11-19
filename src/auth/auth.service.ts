import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity'; // Assuming you have a Doctor entity

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>, // Inject Doctor repository
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { id : user.id , username: user.username, email: user.email,role:user.role};
    return {
      token:this.jwtService.sign(payload,{secret:process.env.JWT_SECRET})
    };
  }

  async register(userDto: RegisterDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    // Create and save the User
    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    // Based on the role, create a Patient or Doctor entity
    if (userDto.role === 'patient') {
      // Create Patient from User
      const newPatient = this.patientRepository.create({
        ...newUser, // Spread the properties of the User to Patient
      });
      await this.patientRepository.save(newPatient);
    } else if (userDto.role === 'doctor') {
      // Create Doctor from User
      const newDoctor = this.doctorRepository.create({
        ...newUser, // Spread the properties of the User to Doctor
      });
      await this.doctorRepository.save(newDoctor);
    }

    return newUser;
  }
}
