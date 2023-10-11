import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
})
export class Page extends Document {
  @Prop({
    required: true,
  })
  _id: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 100,
  })
  title: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 100,
  })
  slug: string;

  @Prop({
    maxlength: 500,
  })
  content: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);

export type PageDocument = Page & Document;
