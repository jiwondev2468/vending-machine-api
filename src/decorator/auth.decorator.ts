import { SetMetadata } from '@nestjs/common';

export const IS_PERMIT_ALL = 'isPermitAll';
export const PermitAll = () => SetMetadata(IS_PERMIT_ALL, true);

export const IS_JWT_REFRESH = 'isJwtRefresh';
export const JwtRefresh = () => SetMetadata(IS_JWT_REFRESH, true);
