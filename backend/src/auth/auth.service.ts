import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { PasswordSignupDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid'
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
    
    const user = await this.mongodbService.create({
      userId: uuidv4(),
      name: name.trim(),
      email: email,
      password: hashPassword,
      active: {
        code: nanoid(64),
        status: true,
      },
    });

    return user;
  }
}
