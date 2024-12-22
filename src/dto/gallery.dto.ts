import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { vector3 } from 'src/common/types';

export class CreateGalleryInDto {
  @ApiProperty({
    default: '갤러리_1',
    description: '갤러리의 이름입니다.',
    required: true,
  })
  @IsString()
  readonly galleryName: string;

  @ApiProperty({
    default: '갤러리 1에 대한 설명',
    description: '갤러리에 대한 설명입니다.',
    required: false,
  })
  @IsString()
  readonly galleryDescription: string;

  @ApiProperty({
    default: 0,
    description: '갤러리 모델 파일 종류 구분자입니다.',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly galleryType: number;

  @ApiProperty({
    default: 'file_server/sample.glb',
    description: '갤러리 모델 파일 url입니다. (현재 기준 미사용)',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly fileUrl: string;

  @ApiProperty({
    default: { x: 0, y: 0, z: 0 },
    description: '작품의 위치 벡터값',
    required: false,
  })
  @IsObject()
  @IsOptional()
  readonly position?: vector3;

  @ApiProperty({
    default: { x: 0, y: 0, z: 0 },
    description: '작품의 회전 벡터값',
    required: false,
  })
  @IsObject()
  @IsOptional()
  readonly rotation?: vector3;
}

export class CreateGalleryOutDto { }

export class GetGalleryInDto {
  @ApiProperty({
    default: '',
    description: '갤러리의 이름입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly galleryName: string;

  @ApiProperty({
    default: '',
    description: '갤러리에 대한 설명입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly galleryDescription: string;
}

export class GetGalleryOutDto { }


export class UpdateGalleryInDto extends OmitType(CreateGalleryInDto, ['fileUrl', 'galleryType']) {
  @ApiProperty({
    description: '업데이트하려는 갤러리의 id입니다.',
    required: true,
  })
  @IsNumber()
  readonly galleryId: number;
}
export class UpdateGalleryOutDto {

}

export class DeleteGalleryInDto {
  @ApiProperty({
    description: '제거하려는 갤러리의 id입니다.',
    required: true,
  })
  @IsNumber()
  readonly galleryId: number;
}

export class DeleteGalleryOutDto { }
