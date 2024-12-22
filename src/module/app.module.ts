import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin.module';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { PrismaService } from '../service/prisma.service';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma.module';
import { ArtModule } from './art.module';
import { AuthGuard } from 'src/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { GalleryModule } from './gallery.module';
import { AwsModule } from './aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    AdminModule,
    GalleryModule,
    ArtModule,
    AwsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },

  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
