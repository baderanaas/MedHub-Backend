import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './schema/rating.schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    const rating = new this.ratingModel(createRatingDto);
    return rating.save();
  }

  async findAll(): Promise<Rating[]> {
    return this.ratingModel.find({ deletedAt: null }).exec(); // Exclude soft-deleted records
  }

  async findOne(id: string): Promise<Rating> {
    const rating = await this.ratingModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!rating) {
      throw new NotFoundException(`Rating with ID "${id}" not found`);
    }
    return rating;
  }

  async update(id: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, updateRatingDto, { new: true })
      .exec();
    if (!rating) {
      throw new NotFoundException(`Rating with ID "${id}" not found or it has been deleted`);
    }
    return rating;
  }

  async remove(id: string): Promise<void> {
    const result = await this.ratingModel.findOneAndDelete({ _id: id, deletedAt: null }).exec();
    if (!result) {
      throw new NotFoundException(`Rating with ID "${id}" not found or it has been deleted`);
    }
  }

  async softDelete(id: string): Promise<Rating> {
    const rating = await this.ratingModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date() }, { new: true })
      .exec();
    if (!rating) {
      throw new NotFoundException(`Rating with ID "${id}" not found or it has been deleted`);
    }
    return rating;
  }
}
