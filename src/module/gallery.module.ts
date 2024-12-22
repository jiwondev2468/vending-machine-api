import { Module } from "@nestjs/common";
import { GalleryController } from "src/controller/gallery.controller";
import { GalleryService } from "src/service/gallery.service";
import { UserService } from "src/service/user.service";


@Module({
    providers: [GalleryService, UserService],
    controllers: [GalleryController],
    exports: [GalleryService],
})
export class GalleryModule { }