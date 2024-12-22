import { Controller, Get, Logger, Query, Request } from '@nestjs/common';
import { Roles } from '../decorator/roles.decorator';
import { Role } from '../common/const/role';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/service/user.service';
import { GetUsersInDto } from 'src/dto/user.dto';
import { GalleryService } from 'src/service/gallery.service';
import { GetGalleryInDto } from 'src/dto/gallery.dto';

@ApiTags('Admin')
@ApiBearerAuth('JWT_ACCESS')
@ApiBearerAuth('JWT_REFRESH')
@Controller('/v1/admin')
export class AdminController {

  private readonly logger: Logger = new Logger(AdminController.name);

  constructor(
    private readonly userService: UserService,
    private readonly galleryService: GalleryService,

  ) { }

  @Roles(Role.SUPER_ADMIN)
  @Roles(Role.ADMIN)
  @Get('/search/users')
  async searchUsers(@Request() request: any, @Query() getUsersInDto: GetUsersInDto) {
    return this.userService.getUsers(getUsersInDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Roles(Role.ADMIN)
  @Get('/search/galleries')
  async searchGalleries(@Request() request: any, @Query() getGalleryInDto: GetGalleryInDto) {
    return this.galleryService.getGalleries(getGalleryInDto);
  }
}
