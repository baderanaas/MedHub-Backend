import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Medication } from 'src/medication/entities/medication.entity';

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

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Medication' }] })
  medications: Medication[];
}

export const DoctorNoteSchema = SchemaFactory.createForClass(DoctorNote);
