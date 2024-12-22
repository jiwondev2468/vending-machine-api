import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ArtController } from 'src/controller/art.controller';
import { AuthGuard } from 'src/guard/auth.guard';
import { ArtService } from 'src/service/art.service';
import { UserService } from 'src/service/user.service';
import { AwsModule } from './aws.module';
import { AwsService } from 'src/service/aws.service';

@Module({
  imports: [AwsModule],
  providers: [ArtService, UserService, AwsService],
  controllers: [ArtController],
  exports: [ArtService],
})
export class ArtModule { }
