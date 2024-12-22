import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class FileTypeInDto {
    @ApiProperty({
        description: '업로드할 파일의 형식입니다. (타입/확장자)',
        default: 'image/png',
        required: true,
    })
    @IsString()
    readonly fileType: string;
}


export class GetPresignedUploadUrlInDto extends FileTypeInDto {

    @ApiProperty({
        description: '업로드된 작품 파일의 이름',
        default: '2.jpeg',
        required: true,
    })
    @IsString()
    readonly fileName: string;

}

