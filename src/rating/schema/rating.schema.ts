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
  docMat: number;

  @Prop({ required: true })
  patientUsername: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
