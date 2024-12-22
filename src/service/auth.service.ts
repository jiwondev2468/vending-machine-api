import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessPayload, SignInOutDto, SignUpInDto, SignUpOutDto } from '../dto/auth.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/const/role';
import { User } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) { }

  async signUp(signUpInDto: SignUpInDto): Promise<SignUpOutDto> {
    await this.userService.signUp(signUpInDto);
    const user = await this.userService.getUserByLoginId(signUpInDto.loginId);

    if (user) {
      throw new BadRequestException();
    }

    console.log(signUpInDto);

    const newUser = await this.prismaService.user.create({
      data: {
        loginId: signUpInDto.loginId,
        password: this.getHashedPassword(signUpInDto.password),
        username: signUpInDto.username,
        role: Role.USER,
      },
    });

    const accessToken = this.getAccessToken(newUser);
    const refreshToken = this.getRefreshToken(newUser);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(loginId: string, password: string): Promise<SignInOutDto> {
    const user = await this.userService.getUserByLoginId(loginId);


    if (this.verifyPassword(user?.password, password) === false) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: 'member.loginId',
      role: user.role,
      username: user.username,
      id: user.id
    };

    delete user.password;

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
      userData: user,
    };
  }

  /**
   * Access Token을 생성합니다.
   * @param user
   */
  getAccessToken(user: User): string {
    const payload: AccessPayload = {
      id: user.id,
      username: user.username,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
    });
  }

  /**
   * Refresh Token을 생성합니다.
   * @param user
   */
  getRefreshToken(user: User): string {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  getHashedPassword(password: string): string {
    const salt = crypto.randomBytes(10).toString('base64');
    const hashedPassword = this.encrypt(password, salt);
    return `${salt}$${hashedPassword}`;
  }

  encrypt(text: string, salt: string): string {
    return crypto.pbkdf2Sync(text, salt, 103237, 32, 'sha512').toString('base64');
  }

  verifyPassword(dbPassword: string, inputPassword: string): boolean {
    const [salt, hashedPassword] = dbPassword.split('$');
    const inputHashedPassword = this.encrypt(inputPassword, salt);
    return hashedPassword === inputHashedPassword;
  }
}
