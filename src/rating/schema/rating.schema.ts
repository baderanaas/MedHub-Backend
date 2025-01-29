import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Rating extends Document {
  @Prop({ required: true })
  score: number;

  @Prop({ required: false })
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date | null;

  @Prop({ required: true })
  doctorId: number;

  @Prop({ required: true })
  patientId: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
