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

  @Prop({ required: true })
  exp: Date;
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

  @Prop({ required: true })
  exp: number;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

export class Password {
  @Prop()
  value?: string;

  @Prop()
  code?: string;

  @Prop()
  expCode?: Date;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);

// parent schema
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: Password;

  @Prop({ required: true, default: [] })
  refreshTokens: RefreshToken[];

  @Prop({ required: true })
  active: Active;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
