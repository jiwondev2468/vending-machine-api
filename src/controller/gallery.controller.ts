import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/const/role';
import { Roles } from 'src/decorator/roles.decorator';
import {
  CreateGalleryInDto,
  CreateGalleryOutDto,
  DeleteGalleryInDto,
  DeleteGalleryOutDto,
  GetGalleryInDto,
  GetGalleryOutDto,
  UpdateGalleryInDto,
  UpdateGalleryOutDto,
} from 'src/dto/gallery.dto';
import { ResponseDto } from 'src/dto/response.dto';
import { GalleryService } from 'src/service/gallery.service';

@ApiTags('Gallery')
@ApiBearerAuth('JWT_ACCESS')
@ApiBearerAuth('JWT_REFRESH')
@Controller('/v1/galleries')
export class GalleryController {
  private readonly logger: Logger = new Logger(GalleryController.name);

  constructor(private readonly galleryService: GalleryService) { }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async createGallery(
    @Request() request: any,
    @Body() createGalleryInDto: CreateGalleryInDto,
  ): Promise<ResponseDto<CreateGalleryOutDto>> {


    const createGalleryOutDto: CreateGalleryOutDto = await this.galleryService.createGallery(createGalleryInDto);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: createGalleryOutDto,
    };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getGalleries(
    @Request() request: any,
    @Query() getGalleryInDto: GetGalleryInDto,
  ): Promise<ResponseDto<GetGalleryOutDto>> {
    const getGalleryOutDto: GetGalleryOutDto = await this.galleryService.getGalleries(getGalleryInDto);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: getGalleryOutDto,
    };
  }

  @Patch('/')
  @HttpCode(HttpStatus.OK)
  async updateGallery(
    @Request() request: any,
    @Body() updateGalleryInDto: UpdateGalleryInDto
  ): Promise<ResponseDto<UpdateGalleryOutDto>> {
    const updateGalleryOutDto: UpdateGalleryOutDto = await this.galleryService.updateGallery(updateGalleryInDto);

    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: updateGalleryOutDto
    }
  }

  @Delete('/')
  @HttpCode(HttpStatus.OK)
  async deleteGallery(
    @Request() request: any,
    @Body() deleteGalleryInDto: DeleteGalleryInDto,
  ): Promise<ResponseDto<DeleteGalleryOutDto>> {
    const deleteGalleryOutDto: DeleteGalleryOutDto = await this.galleryService.deleteGallery(deleteGalleryInDto);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: deleteGalleryOutDto,
    };
  }
}
