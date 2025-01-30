import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorNoteDto } from './dto/create-doctor-note.dto';
import { UpdateDoctorNoteDto } from './dto/update-doctor-note.dto';
import { DoctorNote } from './entities/doctor-note.entity';
import { AppointmentService } from '../appointment/appointment.service';

@Injectable()
export class DoctorNoteService {
  constructor(
    @InjectRepository(DoctorNote)
    private readonly doctorNoteRepository: Repository<DoctorNote>,
    private readonly appointmentService: AppointmentService,
  ) {}

  async create(createDoctorNoteDto: CreateDoctorNoteDto, doctorId: number, patientId: number): Promise<DoctorNote> {
    const appointment = await this.appointmentService.getAppointment(createDoctorNoteDto.appointmentId);

    if (!appointment) {
      throw new BadRequestException('Appointment not found.');
    }

    const doctorNote = this.doctorNoteRepository.create({
      ...createDoctorNoteDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.doctorNoteRepository.save(doctorNote);
  }

  async findAll(): Promise<DoctorNote[]> {
    return this.doctorNoteRepository.find({ where: { deletedAt: null } });
  }

  async findOne(id: number): Promise<DoctorNote> {
    const doctorNote = await this.doctorNoteRepository.findOne({ where: { id, deletedAt: null } });

    if (!doctorNote) {
      throw new BadRequestException(`DoctorNote with ID ${id} not found.`);
    }

    return doctorNote;
  }

  async update(id: number, updateDoctorNoteDto: UpdateDoctorNoteDto): Promise<DoctorNote> {
    await this.findOne(id); // Ensure the note exists

    await this.doctorNoteRepository.update(id, {
      ...updateDoctorNoteDto,
      updatedAt: new Date(),
    });

    return this.findOne(id);
  }

  async softRemove(id: number): Promise<DoctorNote> {
    await this.findOne(id); // Ensure the note exists

    await this.doctorNoteRepository.update(id, { deletedAt: new Date() });

    return this.findOne(id);
  }
}
