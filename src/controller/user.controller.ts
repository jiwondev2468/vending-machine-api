import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Patch, Post, Query, Request } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ResponseDto } from '../dto/response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserInDto, CreateUserOutDto, GetUsersInDto, GetUsersOutDto, UpdateUserInDto } from '../dto/user.dto';
import { User } from '@prisma/client';
import { PermitAll } from '../decorator/auth.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/common/const/role';
import { AuthService } from 'src/service/auth.service';

@ApiTags('User')
@Controller('/v1/users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService
  ) { }

  @PermitAll()
  @Patch('/')
  async updateUser(@Request() request: any, @Body() body: UpdateUserInDto): Promise<ResponseDto<User>> {
    const user = await this.userService.updateUser(body);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: user,
    };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT_ACCESS')
  @ApiBearerAuth('JWT_REFRESH')
  @Post('/')
  async createUser(
    @Request() request: any,
    @Body() createUserInDto: CreateUserInDto,
  ): Promise<ResponseDto<CreateUserOutDto>> {
    const createUserOutDto = await this.userService.createUser(createUserInDto);

    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: createUserOutDto,
    };
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth('JWT_ACCESS')
  @ApiBearerAuth('JWT_REFRESH')
  @Get('/')
  async getUsers(@Request() request: any, @Query() getUsersInDto: GetUsersInDto): Promise<ResponseDto<GetUsersOutDto>> {
    const getUsersOutDto = await this.userService.getUsers(getUsersInDto);

    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: getUsersOutDto,
    };
  }
}
