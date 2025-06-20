import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  userId: number;

  @Prop()
  name: string;

  @Prop()
  timestamp: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
