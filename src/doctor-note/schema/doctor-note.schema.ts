import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class DoctorNote extends Document {
  @Prop({ required: true })
  prescription: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date | null;

  @Prop({ required: true })
  appointmentId: number;

  @Prop({ type: [{ type: String }] })
  medications: string[];
}

export const DoctorNoteSchema = SchemaFactory.createForClass(DoctorNote);
