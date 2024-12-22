import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionObject } from '../common/const/exception-code';

export class CustomBadRequestException extends HttpException {
  constructor(exceptionObject: ExceptionObject) {
    super(exceptionObject, HttpStatus.BAD_REQUEST);
  }
}
