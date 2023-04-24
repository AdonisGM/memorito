import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {PermissionService} from "./permission.service";
import {
  AddPermissionToRoleDto,
  AssignUserToRoleDto,
  CreatePermissionDto,
  CreateRoleDto,
  UpdatePermissionDto,
  UpdateRoleDto
} from "./dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('permission')
export class PermissionController {
  constructor(
    private permissionService: PermissionService,
  ) {}

  @Get('')
  async getAll() {
    await this.permissionService.checkPermission();
    return this.permissionService.getAll();
  }

  @Post('create')
  async create(@Body() dto: CreatePermissionDto) {
    await this.permissionService.checkPermission();
    return this.permissionService.create(dto);
  }

  @Post('update')
  async update(@Body() dto: UpdatePermissionDto) {
    await this.permissionService.checkPermission();
    return this.permissionService.update(dto);
  }

  @Get('role')
  async getAllRole() {
    await this.permissionService.checkPermission();
    return this.permissionService.getAllRole();
  }

  @Post('role/create')
  async createRole(@Body() dto: CreateRoleDto) {
    await this.permissionService.checkPermission();
    return this.permissionService.createRole(dto);
  }

  @Post('role/update')
  async updateRole(@Body() dto: UpdateRoleDto) {
    await this.permissionService.checkPermission();
    return this.permissionService.updateRole(dto);
  }

  @Post('role/add-permission')
  async addPermissionToRole(@Body() dto: AddPermissionToRoleDto) {
    await this.permissionService.checkPermission();
    return this.permissionService.addPermissionToRole(dto);
  }

  @Post('role/assign-user')
  async assignUserToRole(@Body() dto: AssignUserToRoleDto) {
    await this.permissionService.checkPermission();
    return this.permissionService.assignUserToRole(dto);
  }
}
