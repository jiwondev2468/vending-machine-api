// id             Int    @id @default(autoincrement())
// artName        String @default("Untitled") @db.VarChar(255)
// artDescription String @default("-") @db.VarChar(255)
// fileUrl        String @default("") @db.VarChar(255)
// artPrice       Float  @default(0) @db.Float()
// positionX      Float  @db.Double()
// positionY      Float  @db.Double()
// positionZ      Float  @db.Double()
// rotationX      Float  @db.Double()
// rotationY      Float  @db.Double()
// rotationZ      Float  @db.Double()

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Token, User } from '@prisma/client';
import { IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { vector3 } from 'src/common/types';

// owner   User @relation(fields: [ownerId], references: [id])
// ownerId Int  @map("owner_id")

// createdAt DateTime @default(dbgenerated("NOW()")) @map("created_at")
// updatedAt DateTime @default(dbgenerated("NOW()")) @updatedAt @map("updated_at")

export class CreateArtInDto {
  @ApiProperty({
    default: '무제',
    description: '작품의 이름',
    required: true,
  })
  @IsString()
  readonly artName: string;

  @ApiProperty({
    default: '-',
    description: '작품의 설명 / 내용',
    required: true,
  })
  @IsString()
  readonly artDescription: string;

  @ApiProperty({
    default: '2.jpeg',
    description: '업로드된 작품 파일의 경로',
    required: true,
  })
  @IsString()
  readonly fileName: string;

  @ApiProperty({
    default: 0,
    description: '작품의 가격',
    required: true,
  })
  @IsNumber()
  readonly artPrice: number;

  @ApiProperty({
    default: '',
    description: '',
    required: true,
  })
  @IsString()
  readonly artAuthor: string;

  // @ApiProperty({
  //   default: { x: 0, y: 0, z: 0 },
  //   description: '작품의 위치 벡터값',
  //   required: false,
  // })
  // @IsObject()
  // readonly position: vector3;

  // @ApiProperty({
  //   default: { x: 0, y: 0, z: 0 },
  //   description: '작품의 회전 벡터값',
  //   required: false,
  // })
  // @IsObject()
  // readonly rotation: vector3;

  // @ApiProperty({
  //   description: '설치할 갤러리의 id',
  //   required: false,
  // })
  // @IsNumber()
  // readonly galleryId: number;
}

export class CreateArtOutDto {
  readonly artName;
  readonly artDescription;
  readonly fileUrl;
  readonly artPrice;
}

export class GetArtsInDto {
  @ApiProperty({
    default: '',
    description: '작품 이름 (like 검색)',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly artName: string;

  @ApiProperty({
    default: '',
    description: '작품에 대한 설명 (like 검색)',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly artDescription: string;
}

export class GetArtsOutDto { }

export class UpdateArtInDto extends OmitType(CreateArtInDto, ["fileName"]) {

  @ApiProperty({
    description: "업데이트할 작품의 id 입니다.",
    required: true,
  })
  @IsNumber()
  readonly artId: number;


}

export class UpdateArtOutDto {

}

export class DeleteArtInDto {
  @ApiProperty({
    description: '제거할 작품의 id 입니다.',
    required: true,
  })
  @IsNumber()
  readonly artId: number;
}

export class DeleteArtOutDto { }

export class InstallArtInDto {
  @ApiProperty({
    description: '설치할 작품의 ID 입니다.',
    required: true,
  })
  @IsNumber()
  readonly artId: number;

  @ApiProperty({
    description: '작품을 설치할 갤러리의 ID 입니다.',
    required: true,
  })
  @IsNumber()
  readonly galleryId: number;

  @ApiProperty({
    default: { x: 0, y: 0, z: 0 },
    description: '갤러리 내에 작품이 설치될 새로운 위치값입니다.',
    required: false,
  })
  @IsObject()
  readonly position: vector3;

  @ApiProperty({
    default: { x: 0, y: 0, z: 0 },
    description: '갤러리 내에 작품이 설치될 새로운 회전값입니다.',
    required: false,
  })
  @IsObject()
  readonly rotation: vector3;
}

export class RemoveArtFromGalleryInDto {
  @ApiProperty({
    description: '제거할 작품의 ID입니다.',
    required: true
  })
  artId: number;

  @ApiProperty({
    description: '제거할 작품을 보유한 갤러리의 ID입니다.',
    required: true
  })
  galleryId: number;
}

export class RemoveArtFromGalleryOutDto {

}

export class InstallArtOutDto { }

export class GetArtsInGalleryInDto {
  @ApiProperty({
    description: '조회할 갤러리의 ID 입니다.',
    required: true,
  })
  @IsNumber()
  readonly galleryId: number;
}

export class GetArtsInGalleryOutDto { }

export class GetUserArtsInDto extends PickType(GetArtsInDto, ['artName']) { }

export class GetUserArtsOutDto { }