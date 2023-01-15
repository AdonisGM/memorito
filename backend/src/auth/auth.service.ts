import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from '../schemas/user.schema';
import {PasswordSignupDto} from './dto';
import {v4 as uuidv4} from 'uuid';
import {nanoid} from 'nanoid';
import * as bcrypt from 'bcrypt';
import {PasswordSigninDto} from "./dto/signin.dto";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";
import {RenewTokenDto} from "./dto/renewToken.dto";

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 15;
  private readonly ONE_HOUR = '1h';
  private readonly SEVEN_DAYS = '7d';

  constructor(
    @InjectModel(User.name) private mongodbService: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {
  }

  async signup(dto: PasswordSignupDto) {
    const {name, email, password} = dto;

    const genSalt = await bcrypt.genSalt(this.SALT_ROUND);
    const hashPassword = await bcrypt.hash(password.trim(), genSalt);

    try {
      await this.mongodbService.create({
        userId: uuidv4(),
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashPassword,
        active: {
          code: nanoid(64)
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('error_auth_00001');
      } else {
        throw new BadRequestException('error_auth_00000');
      }
    }

    return;
  }

  async signin(dto: PasswordSigninDto) {
    const user = await this.mongodbService.findOne({
      email: dto.email.toLowerCase()
    })

    if (!user) throw new BadRequestException('error_auth_00005')

    const validPassword = await bcrypt.compare(dto.password.trim(), user.password)
    if (!validPassword) throw new BadRequestException('error_auth_00005')

    if (!user.active.status) throw new BadRequestException('error_auth_00006')

    const accessToken = this.newAccessToken(user)
    const refreshToken = this.newRefreshToken(user)

    return {
      accessToken, refreshToken
    }
  }

  async renewToken(dto: RenewTokenDto) {

  }

  private newAccessToken(user: User): string {
    return this.jwtService.sign({
      userId: user.userId
    }, {
      expiresIn: this.ONE_HOUR,
      secret: process.env.JWT_SECRET_KEY
    })
  }

  private newRefreshToken(user: User): string {
    return this.jwtService.sign({
      userId: user.userId
    }, {
      expiresIn: this.SEVEN_DAYS,
      secret: process.env.JWT_SECRET_REFRESH_KEY
    })
  }
}
