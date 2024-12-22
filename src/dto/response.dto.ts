export interface ResponseDto<T> {
  readonly code: number;
  readonly path: string;
  readonly message: string;
  readonly data?: T | T[];
}

export interface EmptyResponseDto {
  readonly code: number;
  readonly path: string;
  readonly message: string;
}
