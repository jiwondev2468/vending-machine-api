import { Module } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { PrismaService } from '../service/prisma.service';
import { AuthModule } from './auth.module';
import { AuthService } from 'src/service/auth.service';

@Module({
  imports: [],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
