import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDoctorNoteDto } from './dto/create-doctor-note.dto';
import { UpdateDoctorNoteDto } from './dto/update-doctor-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DoctorNote } from './schema/doctor-note.schema';
import { Model } from 'mongoose';
import { AppointmentService } from 'src/appointment/appointment.service';

@Injectable()
export class DoctorNoteService {
  constructor(
    @InjectModel(DoctorNote.name)
    private readonly doctorNoteModel: Model<DoctorNote>,
    private readonly appointmentService: AppointmentService,
  ) {}

  async create(
    createDoctorNoteDto: CreateDoctorNoteDto,
    doctorId: number,
    patientId: number,
  ): Promise<DoctorNote> {
    const appointment = await this.appointmentService.getAppointment(
      createDoctorNoteDto.appointmentId,
    );

    if (!appointment) {
      throw new BadRequestException('Appointment not found.');
    }

    const appointmentDoctorId = appointment.doctor.id;
    const appointmentPatientId = appointment.patient.id;

    if (
      appointmentDoctorId !== doctorId ||
      appointmentPatientId !== patientId
    ) {
      throw new BadRequestException(
        'Doctor and patient do not match the appointment details.',
      );
    }

    const doctorNote = new this.doctorNoteModel({
      ...createDoctorNoteDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return doctorNote.save();
  }

  async findAll(): Promise<DoctorNote[]> {
    return this.doctorNoteModel.find({ deletedAt: null }).exec();
  }

  async findOne(id: string): Promise<DoctorNote> {
    const doctorNote = await this.doctorNoteModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
    if (!doctorNote) {
      throw new BadRequestException(`DoctorNote with ID ${id} not found.`);
    }
    return doctorNote;
  }

  async update(
    id: string,
    updateDoctorNoteDto: UpdateDoctorNoteDto,
  ): Promise<DoctorNote> {
    const updatedDoctorNote = await this.doctorNoteModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null }, 
        { ...updateDoctorNoteDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!updatedDoctorNote) {
      throw new BadRequestException(
        `DoctorNote with ID ${id} not found or has been deleted.`,
      );
    }

    return updatedDoctorNote;
  }

  async softRemove(id: string): Promise<DoctorNote> {
    const updatedDoctorNote = await this.doctorNoteModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!updatedDoctorNote) {
      throw new BadRequestException(
        `DoctorNote with ID ${id} not found or has been deleted.`,
      );
    }

    return updatedDoctorNote;
  }
}
