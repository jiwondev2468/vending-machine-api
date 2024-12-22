import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionObject } from '../common/const/exception-code';

export class CustomUnauthorizedExpcetion extends HttpException {
  constructor(exceptionObject: ExceptionObject) {
    super(exceptionObject, HttpStatus.UNAUTHORIZED);
  }
}
