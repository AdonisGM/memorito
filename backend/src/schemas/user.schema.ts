import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// nested schema
@Schema({ _id: false })
export class Active extends Document {
  @Prop({ required: true, default: false })
  status: boolean;

  @Prop({ required: true })
  code: string;
}

export const ActiveSchema = SchemaFactory.createForClass(Active);

@Schema({ _id: false })
export class RefreshToken {
  @Prop({ required: true })
  value: string;

  @Prop({ required: false })
  ip?: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ required: false })
  device?: string;

  @Prop({required: true})
  exp: number;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// parent schema
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: true, default: [] })
  refreshTokens: RefreshToken[];

  @Prop({ required: true })
  active: Active;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
