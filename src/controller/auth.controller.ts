import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Req, Request } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInInDto, SignInOutDto, SignUpInDto, SignUpOutDto } from '../dto/auth.dto';
import { ResponseDto } from '../dto/response.dto';
import { PermitAll } from '../decorator/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/v1/auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) { }

  @PermitAll()
  @Post('/sign-up')
  @HttpCode(HttpStatus.OK)
  async signUp(@Request() request: any, @Body() signUpInDto: SignUpInDto): Promise<ResponseDto<SignUpOutDto>> {
    const signUpOutDto: SignUpOutDto = await this.authService.signUp(signUpInDto);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: signUpOutDto,
    };
  }

  @PermitAll()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Request() request: any, @Body() signInInDto: SignInInDto): Promise<ResponseDto<SignInOutDto>> {
    const signInOutDto: SignInOutDto = await this.authService.signIn(signInInDto.loginId, signInInDto.password);
    return {
      code: 0,
      message: 'success',
      path: request.path,
      data: signInOutDto,
    };
  }
}
