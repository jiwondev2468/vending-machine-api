import { Module } from '@nestjs/common';
import { AdminController } from '../controller/admin.controller';
import { UserModule } from './user.module';
import { ArtModule } from './art.module';
import { GalleryModule } from './gallery.module';
import { UserService } from 'src/service/user.service';
import { ArtService } from 'src/service/art.service';
import { GalleryService } from 'src/service/gallery.service';

@Module({
  imports: [UserModule, ArtModule, GalleryModule],
  controllers: [AdminController],
  providers: [],

})
export class AdminModule { }
