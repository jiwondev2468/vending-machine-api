import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsController } from 'src/controller/aws.controller';
import { AwsService } from 'src/service/aws.service';

@Module({
  imports: [ConfigModule],
  providers: [AwsService],
  controllers: [AwsController],
  exports: [AwsService],
})
export class AwsModule { }
