import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SignUpInDto } from '../dto/auth.dto';
import { PrismaService } from './prisma.service';
import { User, Prisma, Token } from '@prisma/client';
import { CreateUserInDto, GetUsersInDto, GetUsersOutDto, UpdateUserInDto } from '../dto/user.dto';
import { getCurrentDate } from '../common/util/date.util';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) { }

  async signUp(signUpInDto: SignUpInDto): Promise<User | null> {
    try {
      return await this.prismaService.user.create({
        data: {
          loginId: signUpInDto.loginId,
          password: signUpInDto.password,
          username: signUpInDto.username,
        } as Prisma.UserCreateInput,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
      }
    }
  }

  async createUser(createUserInDto: CreateUserInDto): Promise<User | null> {
    try {
      return await this.prismaService.user.create({
        data: {
          loginId: createUserInDto.loginId,
          password: this.getHashedPassword(createUserInDto.password),
          username: createUserInDto.username,
          role: createUserInDto.userRole,
        } as Prisma.UserCreateInput,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
      }
    }
  }

  async getUsers(getUsersInDto: GetUsersInDto): Promise<GetUsersOutDto> {
    try {
      return this.prismaService.user.findMany({
        where: {
          username: { contains: getUsersInDto.username },
        },
        select: {
          id: true,
          loginId: true,
          password: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
      }
    }
  }

  async updateUser(updateUserInDto: UpdateUserInDto): Promise<User | null> {
    return this.prismaService.user.update({
      where: {
        id: 1,
      },
      data: {
        username: updateUserInDto.username,
        createdAt: getCurrentDate(),
      },
    });
  }



  async getUserByLoginId(loginId: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        loginId: loginId,
      },
    });
  }

  async getUserByToken(token: Token): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        id: token.userId,
      },
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
}
