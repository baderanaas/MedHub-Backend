import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class DoctorNote extends Document {
  @Prop({ required: true })
  sickness: string;

  @Prop({ required: true })
  prescription: string;

  @Prop()
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date | null;

  @Prop({ required: true })
  appointmentId: number;
}

export const DoctorNoteSchema = SchemaFactory.createForClass(DoctorNote);
