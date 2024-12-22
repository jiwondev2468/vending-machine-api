import { BadRequestException, Inject, Injectable, Logger, Scope, UnauthorizedException } from '@nestjs/common';
import { AccessPayload, SignInOutDto, SignUpInDto, SignUpOutDto } from '../dto/auth.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/const/role';
import { Prisma, User } from '@prisma/client';
import crypto from 'crypto';
import { PrismaService } from './prisma.service';
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
import { AwsService } from './aws.service';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class ArtService {
  private readonly logger: Logger = new Logger(ArtService.name);

  constructor(
    private readonly userService: UserService,
    // private readonly configService: ConfigService,
    // private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly awsService: AwsService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async createArt({
    artName,
    artDescription,
    artPrice,
    fileName,
    userId,
    artAuthor,
  }: CreateArtInDto & { userId: number }): Promise<CreateArtOutDto> {
    try {
      // const user = this.request['member'];

      // const userId = user.id;

      // const presignedUrl = await this.awsService.getPresignedUploadUrl({ userId, fileType });

      const result = await this.prismaService.art.create({
        data: {
          artName,
          artDescription,
          artPrice,
          fileUrl: `/arts/${fileName}`,
          artAuthor,
          // positionX: position.x,
          // positionY: position.y,
          // positionZ: position.z,
          // rotationX: rotation.x,
          // rotationY: rotation.y,
          // rotationZ: rotation.z,
          ownerId: userId,
        },
      });

      return {
        ...result,
      };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(e);
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
      }
      return e;
    }
  }

  async getArts(getArtsInDto: GetArtsInDto): Promise<GetArtsOutDto> {
    try {
      // 작품 이름, 설명 모두 검색 조건에 없을 시, 모든 작품 리스트 응답.
      if (!getArtsInDto.artName && !getArtsInDto.artDescription) {
        return await this.prismaService.art.findMany({
          select: {
            artName: true,
            artDescription: true,
            fileUrl: true,
            artPrice: true,
            owner: true,
          },
        });
      }
      return await this.prismaService.art.findMany({
        where: {
          OR: [
            { artName: { contains: getArtsInDto.artName } },
            { artDescription: { contains: getArtsInDto.artDescription } },
          ],
        },
        select: {
          id: true,
          artName: true,
          artDescription: true,
          fileUrl: true,
          artPrice: true,
          owner: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(e);
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
        return e;
      }
    }
  }

  async updateArt(updateArtInDto: UpdateArtInDto): Promise<UpdateArtOutDto> {
    try {
      return this.prismaService.art.update({
        where: {
          id: updateArtInDto.artId,
        },
        data: {
          artName: updateArtInDto.artName,
          artPrice: updateArtInDto.artPrice,
          artDescription: updateArtInDto.artDescription,
          artAuthor: updateArtInDto.artAuthor,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(e);
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
        return e;
      }
    }
  }

  async deleteArt({ artId }: DeleteArtInDto): Promise<DeleteArtOutDto> {
    try {
      return await this.prismaService.art.delete({
        where: {
          id: artId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(e);
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
        return e;
      }
    }
  }

  async installArt(installArtInDto: InstallArtInDto & { userId: number }): Promise<InstallArtOutDto> {
    try {
      const createArtPosition = new Promise(async (resolve, reject) => {
        const result = this.prismaService.artPosition.upsert({
          where: {
            artId_galleryId: { artId: installArtInDto.artId, galleryId: installArtInDto.galleryId },
          },
          create: {
            positionX: installArtInDto.position.x,
            positionY: installArtInDto.position.y,
            positionZ: installArtInDto.position.z,
            rotationX: installArtInDto.rotation.x,
            rotationY: installArtInDto.rotation.y,
            rotationZ: installArtInDto.rotation.z,
            gallery: {
              connect: { id: installArtInDto.galleryId },
            },
            art: {
              connect: { id: installArtInDto.artId },
            },
          },

          update: {
            positionX: installArtInDto.position.x,
            positionY: installArtInDto.position.y,
            positionZ: installArtInDto.position.z,
            rotationX: installArtInDto.rotation.x,
            rotationY: installArtInDto.rotation.y,
            rotationZ: installArtInDto.rotation.z,
          },
        });
        if (result) {
          resolve(result);
        }
      });

      const updateArt = new Promise((resolve, reject) => {
        const result = this.prismaService.art.update({
          where: {
            id: installArtInDto.artId,
          },
          data: {
            galleries: {
              connect: {
                id: installArtInDto.galleryId,
              },
            },
          },
        });

        if (result) {
          resolve(result);
        }
      });

      const result = await Promise.all([createArtPosition, updateArt]);
      const updatedArtInfo = result[1]
      return updatedArtInfo;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(e);
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
        return e;
      }
    }
  }

  async removeArtFromGallery(
    removeArtFromGalleryInDto: RemoveArtFromGalleryInDto,
  ): Promise<RemoveArtFromGalleryOutDto> {
    try {
      const removeArt = new Promise((resolve, reject) => {
        const result = this.prismaService.artPosition.delete({
          where: {
            artId_galleryId: {
              artId: removeArtFromGalleryInDto.artId,
              galleryId: removeArtFromGalleryInDto.galleryId,
            },
          },
        });

        if (result) {
          resolve(result);
        }
      });

      const updateArt = new Promise((resolve, reject) => {
        const result = this.prismaService.art.update({
          where: {
            id: removeArtFromGalleryInDto.artId,
          },
          data: {
            galleries: {
              disconnect: {
                id: removeArtFromGalleryInDto.galleryId,
              },
            },
          },
        });

        if (result) {
          resolve(result);
        }
      });

      return await Promise.all([removeArt, updateArt]);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(e);
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
        return e;
      }
    }
  }

  async getArtsInGallery(galleryId: string) {
    try {
      return await this.prismaService.art.findMany({
        where: {
          galleries: {
            some: {
              id: Number(galleryId),
            },
          },
        },
        select: {
          id: true,
          artName: true,
          artDescription: true,
          fileUrl: true,
          artPrice: true,
          artPosition: {
            where: {
              galleryId: Number(galleryId),
            },
            select: {
              positionX: true,
              positionY: true,
              positionZ: true,
              rotationX: true,
              rotationY: true,
              rotationZ: true,
            },
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(e);
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
        return e;
      }
    }
  }

  async getUserArts(getUserArtsInDto: GetUserArtsInDto & { ownerId: number }): Promise<GetUserArtsOutDto> {
    try {
      // 작품 이름, 설명 모두 검색 조건에 없을 시, 모든 작품 리스트 응답.
      if (!getUserArtsInDto.artName) {
        return await this.prismaService.art.findMany({
          where: {
            ownerId: getUserArtsInDto.ownerId,
          },
        });
      }
      return await this.prismaService.art.findMany({
        where: {
          AND: [{ artName: { contains: getUserArtsInDto.artName } }, { ownerId: getUserArtsInDto.ownerId }],
        },
        select: {
          id: true,
          artName: true,
          artDescription: true,
          fileUrl: true,
          artPrice: true,
          artPosition: true,
          artAuthor: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(e);
        if (e.code === 'P2002') {
          this.logger.error(e.meta.target[0]);
          throw new BadRequestException();
        }
        return e;
      }
    }
  }
}
