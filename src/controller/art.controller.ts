import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Role } from 'src/common/const/role';
import { PermitAll } from 'src/decorator/auth.decorator';
import { Roles } from 'src/decorator/roles.decorator';
import {
  CreateArtInDto,
  CreateArtOutDto,
  DeleteArtInDto,
  DeleteArtOutDto,
  GetArtsInDto,
  GetArtsInGalleryInDto,
  GetArtsInGalleryOutDto,
  GetArtsOutDto,
  GetUserArtsInDto,
  GetUserArtsOutDto,
  InstallArtInDto,
  InstallArtOutDto,
  RemoveArtFromGalleryInDto,
  RemoveArtFromGalleryOutDto,
  UpdateArtInDto,
  UpdateArtOutDto,
} from 'src/dto/art.dto';
import { ResponseDto } from 'src/dto/response.dto';
import { ArtService } from 'src/service/art.service';

@ApiTags('Art')
@ApiBearerAuth('JWT_ACCESS')
@ApiBearerAuth('JWT_REFRESH')
@Controller('/v1/arts')
export class ArtController {
  private readonly logger: Logger = new Logger(ArtService.name);

  constructor(private readonly artService: ArtService) { }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async createArt(
    @Request() request: any,
    @Body() createArtInDto: CreateArtInDto,
  ): Promise<ResponseDto<CreateArtOutDto>> {
    const userId = (request['member'] as User).id;
    const createArtOutDto: CreateArtOutDto = await this.artService.createArt({ ...createArtInDto, userId });
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: createArtOutDto,
    };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getArts(@Request() request: any, @Query() getArtsInDto: GetArtsInDto): Promise<ResponseDto<GetArtsOutDto>> {
    const getArtsOutDto: GetArtsOutDto = await this.artService.getArts(getArtsInDto);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: getArtsOutDto,
    };
  }

  @Patch('/')
  @HttpCode(HttpStatus.OK)
  async updateArt(@Request() request: any, @Body() updateArtInDto: UpdateArtInDto): Promise<ResponseDto<UpdateArtOutDto>> {
    const updateArtOutDto: UpdateArtOutDto = await this.artService.updateArt(updateArtInDto);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: updateArtOutDto,
    }
  }



  @Delete('/')
  @HttpCode(HttpStatus.OK)
  async deleteArt(
    @Request() request: any,
    @Body() deleteArtInDto: DeleteArtInDto,
  ): Promise<ResponseDto<DeleteArtOutDto>> {
    const deleteArtOutDto: DeleteArtOutDto = await this.artService.deleteArt(deleteArtInDto);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: deleteArtOutDto,
    };
  }

  @Patch('/install-art')
  async installArt(
    @Request() request: any,
    @Body() installArtInDto: InstallArtInDto,
  ): Promise<ResponseDto<InstallArtOutDto>> {
    const userId = (request['member'] as User).id;
    const installArtOutDto: InstallArtOutDto = await this.artService.installArt({ ...installArtInDto, userId });
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: installArtOutDto,
    };
  }

  @Delete('/remove-art-from-gallery')
  @HttpCode(HttpStatus.OK)
  async removeArtFromGallery(
    @Request() request: any,
    @Body() removeArtFromGalleryInDto: RemoveArtFromGalleryInDto,
  ): Promise<ResponseDto<RemoveArtFromGalleryOutDto>> {
    const removeArtFromGalleryOutDto: RemoveArtFromGalleryOutDto = await this.artService.removeArtFromGallery(
      removeArtFromGalleryInDto,
    );
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: removeArtFromGalleryOutDto,
    };
  }

  // 갤러리 내에 설치된 작품을 조회합니다.
  @Get('/gallery/:galleryId')
  @HttpCode(HttpStatus.OK)
  async getArtsInGallery(
    @Request() request: any,
    @Param('galleryId') galleryId: string,
  ): Promise<ResponseDto<GetArtsInGalleryOutDto>> {
    const getArtsInGalleryOutDto: GetArtsInGalleryOutDto = await this.artService.getArtsInGallery(galleryId);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: getArtsInGalleryOutDto,
    };
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  async getUserArts(
    @Request() request: any,
    @Query() getUserArtsInDto: GetUserArtsInDto,
  ): Promise<ResponseDto<GetUserArtsOutDto>> {
    const ownerId = request['member'].id;
    const getUserArtsOutDto: GetUserArtsOutDto = await this.artService.getUserArts({ ...getUserArtsInDto, ownerId });
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: getUserArtsOutDto
    }
  }

}
