import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {
  AddPermissionToRoleDto,
  AssignUserToRoleDto,
  CreatePermissionDto,
  CreateRoleDto,
  UpdatePermissionDto,
  UpdateRoleDto
} from "./dto";
import {Prisma, User} from "@prisma/client";

@Injectable()
export class PermissionService {

  constructor(
    private readonly prisma: PrismaService,
  ) {
  }

  async checkPermission() {
    return true;
  }

  async getAll() {
    return this.prisma.permission.findMany({});
  }

  async getAllRole() {
    return this.prisma.role.findMany({});
  }

  async create(dto: CreatePermissionDto) {
    const name = dto.name.trim();
    const value = dto.value.trim();

    const permissionDb = await this.prisma.permission.findMany({
      where: {
        OR: [
          {name: name},
          {value: value}
        ]
      }
    })
    if (permissionDb.length !== 0) throw new BadRequestException('error_auth_00026');

    await this.prisma.permission.create({
      data: {
        name: name,
        value: value,
      } as Prisma.PermissionCreateInput,
    });

    return;
  }

  async update(dto: UpdatePermissionDto) {
    const name = dto.name.trim();
    const value = dto.value.trim();
    const permissionId = dto.permissionId.trim();

    const permissionDb2 = await this.prisma.permission.findFirst({
      where: {
        permissionId: permissionId,
      }
    })
    if (permissionDb2) throw new BadRequestException('error_auth_00025');

    const permissionDb1 = await this.prisma.permission.findMany({
      where: {
        AND: [
          {
            OR: [
              {name: name},
              {value: value}
            ]
          },
          {
            permissionId: {
              not: permissionId
            }
          }
        ]
      }
    })
    if (permissionDb1.length !== 0) throw new BadRequestException('error_auth_00026');

    await this.prisma.permission.update({
      where: {
        permissionId: permissionId,
      },
      data: {
        name: name,
        value: value,
      } as Prisma.PermissionUpdateInput,
    });

    return;
  }

  async createRole(dto: CreateRoleDto) {
    const name = dto.name.trim();
    const value = dto.value.trim();
    const description = dto.description.trim();

    const roleDb = await this.prisma.role.findMany({
      where: {
        OR: [
          {name: name},
          {value: value}
        ]
      }
    })
    if (roleDb.length !== 0) throw new BadRequestException('error_auth_00030');

    await this.prisma.role.create({
      data: {
        name: name,
        value: value,
        description: description
      } as Prisma.RoleCreateInput,
    });

    return;
  }

  async updateRole(dto: UpdateRoleDto) {
    const roleId = dto.roleId.trim();
    const name = dto.name.trim();
    const value = dto.value.trim();
    const description = dto.description.trim();

    const roleDb1 = await this.prisma.role.findFirst({
      where: {
        roleId: roleId,
      }
    })
    if (roleDb1) throw new BadRequestException('error_auth_00031');

    const roleDb2 = await this.prisma.role.findMany({
      where: {
        AND: [
          {
            OR: [
              {name: name},
              {value: value}
            ]
          },
          {
            roleId: {
              not: roleId
            }
          }
        ]
      }
    })
    if (roleDb2.length !== 0) throw new BadRequestException('error_auth_00030');

    await this.prisma.role.update({
      where: {
        roleId: roleId
      },
      data: {
        name: name,
        value: value,
        description: description
      } as Prisma.RoleCreateInput
    })

    return
  }

  async addPermissionToRole(dto: AddPermissionToRoleDto) {
    const roleId = dto.role;
    const permissionIds = dto.permissions;

    const roleDb = await this.prisma.role.findFirst({
      where: {
        roleId: roleId
      },
      include: {
        permissions: true
      }
    });

    if (!roleDb) throw new BadRequestException('error_auth_00031');

    await this.prisma.role.update({
      where: {
        roleId: roleId
      },
      data: {
        permissions: {
          connect: permissionIds.map(permissionId => {
            return {
              permissionId: permissionId
            }
          }),
        }
      }
    });

    return;
  }

  async assignUserToRole(dto: AssignUserToRoleDto) {
    const userIds = dto.users;
    const roleId = dto.role;

    const roleDb = await this.prisma.role.findFirst({
      where: {
        roleId: roleId
      }
    });

    if (!roleDb) throw new BadRequestException('error_auth_00031');

    const userDbsWait = userIds.map((id) => {
      return this.prisma.user.update({
        where: {
          userId: id,
        },
        data: {
          role: {
            connect: {
              roleId: roleId
            }
          }
        }
      })
    });

    try {
      await Promise.all(userDbsWait);
    } catch (_e) {
      throw new BadRequestException('error_auth_00032');
    }

    return;
  }
}
