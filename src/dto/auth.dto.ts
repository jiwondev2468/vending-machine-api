import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Role } from 'src/common/const/role';

export class SignInInDto {
  @ApiProperty({
    default: 'superadmin',
    required: true,
    description: '로그인 아이디',
  })
  @IsString()
  readonly loginId: string;

  @ApiProperty({
    default: 'qwer1234!',
    required: true,
    description: '패스워드',
  })
  @IsString()
  @Length(6, 30, {
    message: '패스워드 길이는 6자 이상, 30자 이하로 입력해주세요.',
  })
  readonly password: string;
}

export class SignInOutDto {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly userData: any;
}

export class SignUpInDto {
  @ApiProperty({
    default: 'user',
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
}

export class SignUpOutDto {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AccessPayload {
  readonly id: number;
  readonly username: string;
}

export interface RefreshPaylaod {
  readonly id: number;
}
