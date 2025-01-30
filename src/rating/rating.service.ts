import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './schema/rating.schema';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
    private doctorService: DoctorService,
    private patientService: PatientService,
  ) {}

  async create(
    createRatingDto: CreateRatingDto,
    matricule: number,
    patientUsername: string,
  ): Promise<Rating> {
    const doctorExists = await this.doctorService.getDoctorByMat(matricule);
    if (!doctorExists) {
      throw new NotFoundException('Doctor not found');
    }

    const patientExists =
      await this.patientService.getPatientByUserName(patientUsername);
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }

    const rating = new this.ratingModel({
      ...createRatingDto,
      docMat: matricule,
      patientUsername: patientUsername,
    });

    return rating.save();
  }

  async findAll(): Promise<Rating[]> {
    return this.ratingModel.find({ deletedAt: null }).exec();
  }

  async findOne(id: string): Promise<Rating> {
    const rating = await this.ratingModel
      .findOne({ _id: id, deletedAt: null })
      .exec();

    if (!rating) {
      throw new NotFoundException(`Rating with ID "${id}" not found`);
    }
    return rating;
  }

  async findOneByQuery(query): Promise<Rating[]> {
    if (!query.docMat && !query.patientUsername) {
      return await this.findAll();
    }
    if (!query.docMat) {
      const ratings = await this.ratingModel
        .find({ patientUsername: query.patientUsername, deletedAt: null })
        .exec();
      return ratings.map((rating) => rating.toObject() as Rating);
    }
    if (!query.patientUsername) {
      const ratings = await this.ratingModel
        .find({ docMat: query.docMat, deletedAt: null })
        .exec();
      return ratings.map((rating) => rating.toObject() as Rating);
    }
    const ratings = await this.ratingModel
      .find({
        docMat: query.docMat,
        patientUsername: query.patientUsername,
        deletedAt: null,
      })
      .exec();
    return ratings.map((rating) => rating.toObject() as Rating);
  }

  async update(id: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, updateRatingDto, {
        new: true,
      })
      .exec();

    if (!rating) {
      throw new NotFoundException(
        `Rating with ID "${id}" not found or it has been deleted`,
      );
    }

    return rating;
  }

  async remove(id: string): Promise<void> {
    const result = await this.ratingModel
      .findOneAndDelete({ _id: id, deletedAt: null })
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Rating with ID "${id}" not found or it has been deleted`,
      );
    }
  }

  async softDelete(id: string): Promise<Rating> {
    const rating = await this.ratingModel
      .findOne({ _id: id, deletedAt: null })
      .exec();

    if (!rating) {
      throw new NotFoundException(
        `Rating with ID "${id}" not found or it has already been deleted`,
      );
    }

    rating.deletedAt = new Date();
    return rating.save();
  }
}
