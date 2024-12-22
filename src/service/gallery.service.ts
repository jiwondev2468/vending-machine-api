import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
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
import { Prisma } from '@prisma/client';

@Injectable()
export class GalleryService {
  private readonly logger: Logger = new Logger(GalleryService.name);

  constructor(
    // private readonly userService: UserService,
    // private readonly configService: ConfigService,
    // private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) { }

  async createGallery({
    galleryName,
    galleryDescription,
    galleryType,
    fileUrl,
    position,
    rotation,
  }: CreateGalleryInDto): Promise<CreateGalleryOutDto> {
    try {

      return await this.prismaService.gallery.create({
        data: {
          galleryName,
          galleryDescription,
          galleryType,
          fileUrl,
          positionX: position?.x,
          positionY: position?.y,
          positionZ: position?.z,
          rotationX: rotation?.x,
          rotationY: rotation?.y,
          rotationZ: rotation?.z,
          ownerId: 1,
        },
      });
    } catch (e) {
      this.logger.debug(e)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {

        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
      }
      return e;
    }
  }

  async getGalleries(getGalleryInDto: GetGalleryInDto): Promise<GetGalleryOutDto> {
    try {
      // 갤러리 이름, 설명 모두 검색 조건에 없을 시, 모든 갤러리 리스트 응답.
      if (!getGalleryInDto.galleryName && !getGalleryInDto.galleryDescription) {
        // return await this.prismaService.gallery.findMany({
        //   include: {
        //     arts: true
        //   }
        // });

        return await this.prismaService.gallery.findMany({

          include: {
            arts: {
              select: {
                artName: true,
                artDescription: true,
                fileUrl: true,
                owner: {
                  select: {
                    username: true,
                    role: true
                  }
                }
              }
            }
          }

        })
      }

      return await this.prismaService.gallery.findMany({
        where: {
          OR: [
            { galleryName: { contains: getGalleryInDto.galleryName } },
            { galleryDescription: { contains: getGalleryInDto.galleryDescription } },
          ],

        },
        include: {
          arts: true
        }

      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {

        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
      }
      return e;
    }
  }

  async updateGallery(updateGalleryInDto: UpdateGalleryInDto): Promise<UpdateGalleryOutDto> {
    try {
      return await this.prismaService.gallery.update({
        where: {
          id: updateGalleryInDto.galleryId
        },
        data: {
          galleryName: updateGalleryInDto.galleryName,
          galleryDescription: updateGalleryInDto.galleryDescription,
          rotationX: updateGalleryInDto.rotation?.x,
          rotationY: updateGalleryInDto.rotation?.y,
          rotationZ: updateGalleryInDto.rotation?.z,
          positionX: updateGalleryInDto.position?.x,
          positionY: updateGalleryInDto.position?.y,
          positionZ: updateGalleryInDto.position?.z,
        }
      })
    }
    catch (e) {
      this.logger.debug(e)

      if (e instanceof Prisma.PrismaClientKnownRequestError) {

        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
      }
      else {
        this.logger.error(e)
      }
      return e;
    }
  }

  async deleteGallery({ galleryId }: DeleteGalleryInDto): Promise<DeleteGalleryOutDto> {
    try {

      return await this.prismaService.gallery.delete({
        where: {
          id: galleryId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {

        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
      }
      return e;
    }
  }

  // async getArtsInGallery({ galleryId }: GetArtsInGalleryInDto) {
  //   try {
  //     return await this.prismaService.art.findMany({
  //       where: {
  //         belongsGalleryId: galleryId,
  //       },
  //     });
  //   } catch (e) {
  //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //       this.logger.error(e);
  //       if (e.code === 'P2002') {
  //         this.logger.error(e.meta.target[0]);
  //         throw new BadRequestException();
  //       }
  //       return e;
  //     }
  //   }
  // }
}
