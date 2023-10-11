import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
})
export class User extends Document {
  @Prop({
    required: true,
  })
  _id: string;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 100,
  })
  firstName: string;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 100,
  })
  lastName: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 100,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 8,
    maxlength: 20,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
