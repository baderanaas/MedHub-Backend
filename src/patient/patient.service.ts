import { Injectable, NotFoundException, Delete } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddPatientDto } from './dto/add-patient.dto';
import { Role } from 'src/enums/role.enum';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>,
      ) {}

    async getPatients():Promise<Patient[]> {
        return this.patientRepository.find();
    }
    async getPatient(id:number):Promise<Patient>{
        const patient=await this.patientRepository.findOne({where:{id:id}})
        if(!patient){ throw new NotFoundException('Patient not found'); 
        }
        return patient;
    }
    async addPatient(patientDto: AddPatientDto): Promise<Patient> {
       const patient = this.patientRepository.create({...patientDto,role:Role.PATIENT});
       return this.patientRepository.save(patient);
      }
      async updatePatient(patientDto: UpdatePatientDto,id:number): Promise<Patient> {
      const patient=await this.getPatient(id);
      this.patientRepository.merge(patient,patientDto);
      return this.patientRepository.save(patient);
      }  
    async deletePatient(id:number):Promise<void>{ 
        const patient= await this.getPatient(id);
        if (!patient){
            throw new NotFoundException('Patient not found');
        }
        await this.patientRepository.delete(id);
    }

}