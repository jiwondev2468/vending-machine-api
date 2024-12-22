// aws.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { GetPresignedUploadUrlInDto } from 'src/dto/aws.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


@Injectable()
export class AwsService {
  private readonly logger: Logger = new Logger(AwsService.name);

  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    // AWS S3 클라이언트 초기화. 환경 설정 정보를 사용하여 AWS 리전, Access Key, Secret Key를 설정.
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'), // AWS Region
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_FILESERVER_ACCESS'), // Access Key
        secretAccessKey: this.configService.get('AWS_S3_FILESERVER_SECRET'), // Secret Key
      },
    });


  }

  async getPresignedUploadUrl({ fileName, fileType }: GetPresignedUploadUrlInDto): Promise<string> {
    try {
      const extName = fileType.split('/')[1];	// type은 file.type이다. 즉, image/jpeg 또는 image/png가 들어오기 때문에 extName에는 파일의 확장자가 들어가게 된다.
      // 내가 S3에 하려는 작업을 명시한다.
      const command = new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_FILESERVER_NAME'),
        Key: `arts/${fileName}.${extName}`,
        ContentType: fileType,
      });

      // Presigned URL을 생성해서 반환한다.
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 10,
      });
      return signedUrl;
    }
    catch (err) {
      this.logger.error(err);
      return err;
    }

  }

  // async imageUploadToS3({
  //   fileName,  // 업로드될 파일의 이름
  //   file,  // 업로드할 파일
  //   ext  // 파일 확장자
  // }: ImageUploadToS3InDto) {
  //   // AWS S3에 이미지 업로드 명령을 생성합니다. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정합니다.
  //   const command = new PutObjectCommand({
  //     Bucket: this.configService.get(process.env.AWS_S3_FILESERVER_NAME), // S3 버킷 이름
  //     Key: fileName, // 업로드될 파일의 이름
  //     Body: file.buffer, // 업로드할 파일
  //     ACL: 'public-read', // 파일 접근 권한
  //     ContentType: `image/${ext}`, // 파일 타입
  //   });

  //   // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
  //   await this.s3Client.send(command);

  //   // 업로드된 이미지의 URL을 반환합니다.
  //   return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  // }

}