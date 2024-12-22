import { Controller, Get, HttpCode, HttpStatus, Logger, Param, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Role } from 'src/common/const/role';
import { Roles } from 'src/decorator/roles.decorator';
import { FileTypeInDto, GetPresignedUploadUrlInDto } from 'src/dto/aws.dto';
import { ResponseDto } from 'src/dto/response.dto';
import { AwsService } from 'src/service/aws.service';

@ApiTags('AWS')
@ApiBearerAuth('JWT_ACCESS')
@ApiBearerAuth('JWT_REFRESH')
@Controller('/v1/aws')
export class AwsController {
    private readonly logger: Logger = new Logger(AwsController.name);

    constructor(
        private readonly awsService: AwsService
    ) { }

    @Get('/get-presigned-url/')
    @HttpCode(HttpStatus.OK)
    async getPresignedUrl(
        @Request() request: any,
        @Query() { fileType, fileName }: GetPresignedUploadUrlInDto
    ): Promise<ResponseDto<string>> {
        try {


            const presignedUrl = await this.awsService.getPresignedUploadUrl({ fileType, fileName });

            return {
                code: 0,
                message: 'success',
                path: request.path,
                data: presignedUrl,
            };
        }
        catch (err) {
            console.log(err)
        }
    }
}
