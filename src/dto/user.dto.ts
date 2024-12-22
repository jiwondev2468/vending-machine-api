import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { Role } from 'src/common/const/role';

export class UpdateUserInDto {
  readonly username: string;
}

export class GetUsersInDto {
  @ApiProperty({
    default: '',
    description: '유저명',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly username: string;
}

export class CreateUserInDto {
  @ApiProperty({
    default: 'admin',
    required: true,
    description: '로그인 아이디',
  })
  @IsString()
  @Length(3, 20)
  readonly loginId: string;

  @ApiProperty({
    default: 'qwer1234!',
    required: true,
    description: '패스워드',
  })
  @IsString()
  @Length(3, 30)
  readonly password: string;

  @ApiProperty({
    default: '김민수',
    required: true,
    description: '유저명',
  })
  @IsString()
  readonly username: string;

  @ApiProperty({
    default: Role.ADMIN,
    required: false,
    description: `유저 권한: ${Object.values(Role)}`,
  })
  readonly userRole: string;
}

export class CreateUserOutDto {}

export class GetUsersOutDto {}
