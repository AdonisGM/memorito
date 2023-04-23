import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  information (@Request() req: any) {
    return this.userService.getInformation(req.user);
  }
}
