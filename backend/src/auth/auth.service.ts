import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { PasswordSignupDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 15;

  constructor(
    @InjectModel(User.name) private mongodbService: Model<UserDocument>,
  ) {}

  async signup(dto: PasswordSignupDto) {
    const { name, email, password } = dto;

    const genSalt = await bcrypt.genSalt(this.SALT_ROUND);
    const hashPassword = await bcrypt.hash(password.trim(), genSalt);

    try {
      await this.mongodbService.create({
        userId: uuidv4(),
        name: name.trim(),
        email: email,
        password: hashPassword,
        active: {
          code: nanoid(64)
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('error-auth-00001');
      } else {
        throw new BadRequestException('error-auth-00000');
      }
    }

    return;
  }

  async signin() {

  }
}
