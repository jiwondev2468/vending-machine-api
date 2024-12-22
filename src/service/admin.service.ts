import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersInDto } from 'src/dto/user.dto';

@Injectable()
export class AdminService {
    private readonly logger: Logger = new Logger(AdminService.name);

    constructor(private readonly userService: UserService) { }




}
