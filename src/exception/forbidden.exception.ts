import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionObject } from '../common/const/exception-code';

export class CustomForbiddenExpcetion extends HttpException {
  constructor(exceptionObject: ExceptionObject) {
    super(exceptionObject, HttpStatus.FORBIDDEN);
  }
}
