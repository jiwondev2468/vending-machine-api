export type ExceptionObject = {
  code: number;
  message: string;
  data?: object;
};

function exception(code: number, message: string) {
  return {
    code,
    message,
  };
}

export class CommonError {
  static readonly NOT_FOUND_DATA = exception(1000, '데이터를 찾을 수 없습니다.');
  static readonly INVALID_PARAM = exception(1001, '파라미터를 다시 확인해주세요.');
  static readonly FAILED_UPLOAD_FILE = exception(1002, '파일 업로드에 실패했습니다.');
}

export class AuthError {
  static EMAIL_AUTH_EXPIRED_TIME_OUT = exception(2000, '이메일 인증 유효 시간이 초과되었습니다.');
  static EMAIL_AUTH_FAILED_COUNT_EXCEEDED = exception(2001, '이메일 인증 실패 횟수를 초과했습니다.');
  static EMAIL_AUTH_INVALID_CODE = exception(2002, '이메일 인증 번호를 다시 확인해주세요.');
  static EMAIL_AUTH_UNAVAILABLE = exception(2003, '사용할 수 없는 이메일 인증입니다.');
  static RESET_PASSWORD_TIME_OUT = exception(2004, '비밀번호 재설정 유효 시간이 초과되었습니다.');
  static INVALID_SIGN_IN = exception(2005, '이메일 또는 비빌번호를 다시 확인해주세요.');
  static NOT_FOUND_TOKEN = exception(2006, '토큰 정보를 찾을 수 없습니다.');
  static INVALID_SNS_TYPE = exception(2007, '소셜 로그인 타입이 맞지 않습니다.');
  static INVALID_REFRESH_TOKEN = exception(2008, '리프레시 토큰이 일치하지 않습니다.');
  static INVALID_PASSWORD = exception(2009, '비밀번호가 일치하지 않습니다.');
  static UPDATE_PASSWORD = exception(2010, '비밀번호 설정이 필요합니다.');
}

export class UserError {
  static ALREADY_REGISTERED_EMAIL = exception(3000, '이미 사용중인 이메일입니다.');
  static INVALID_LOGIN_INFO = exception(3001, '아이디 또는 비밀번호를 확인해주세요.');
  static INVALID_PREVIOUS_PASSWORD = exception(3002, '기존 비밀번호를 다시 입력해주세요.');
  static NOT_FOUND_USER = exception(3003, '회원을 찾을 수 없습니다.');
  static INVALID_USER_TYPE = exception(3004, '이메일로 가입된 계정이 아닙니다.');
  static ALREADY_REGISTERED_NICKNAME = exception(3005, '이미 사용중인 닉네임입니다.');
  static ALREADY_WITHDRAWAL_STATUS = exception(3006, '이미 탈퇴된 회원입니다.');
  static INVALID_USER_STATUS = exception(3007, '유효한 회원 상태가 아닙니다');
}
