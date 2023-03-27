import { Moment } from 'moment';
export enum ClientErrors {
  AXIOS_NO_RESPONSE = 'AXIOS_NO_RESPONSE',
  BACKEND_ERROR = 'BACKEND_ERROR',
  BACKEND_NOT_RESPONDING = 'BACKEND_NOT_RESPONDING',
  BACKEND_GENERAL_ERROR = 'BACKEND_GENERAL_ERROR',
  PROXY_UNKNOWN_ERROR = 'PROXY_UNKNOWN_ERROR',
}

export enum GeneralErrors {
  UNHANDLED_ERROR = 'UNHANDLED_ERROR',
  PACKET_NOT_AUTHENTIC = 'PACKET_NOT_AUTHENTIC',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  METHOD_NOT_IMPLEMENTED = 'METHOD_NOT_IMPLEMENTED'
}

export enum AuthenticationErrors {
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED',
  ACCOUNT_PENDING_EDIT_VERIFICATION = 'ACCOUNT_PENDING_EDIT_VERIFICATION',
  AUTH_BLOCKED = 'AUTH_BLOCKED',
  AUTH_MUST_BE_LOGGED_OFF = 'AUTH_MUST_BE_LOGGED_OFF',
  AUTH_MUST_BE_LOGGED_ON = 'AUTH_MUST_BE_LOGGED_ON',
  AUTH_NO_TOKEN_PROVIDED = 'AUTH_NO_TOKEN_PROVIDED',
  AUTH_TOKEN_IS_NOT_AUTHENTIC = 'AUTH_TOKEN_IS_NOT_AUTHENTIC',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_NO_ROLE_ALLOWED = 'AUTH_NO_ROLE_ALLOWED',
  AUTH_USER_CLIENT_CONVERSION_FAILED = 'AUTH_USER_CLIENT_CONVERSION_FAILED',
  AUTH_ACCESS_TO_INTRANET_NOT_ALLOWED = 'AUTH_ACCESS_TO_INTRANET_NOT_ALLOWED',
  AUTH_DISABLED_ACCOUNT = 'AUTH_DISABLED_ACCOUNT',
  ACCESS_NOT_AUTHORIZED = 'ACCESS_NOT_AUTHORIZED'
}

export enum UserErrors {
  USER_PSEUDO_MUST_BE_UNIQUE = 'USER_PSEUDO_MUST_BE_UNIQUE',
  USER_EMAIL_MUST_BE_UNIQUE = 'USER_EMAIL_MUST_BE_UNIQUE',
  PSEUDO_OR_EMAIL_NOT_FOUND = 'PSEUDO_OR_EMAIL_NOT_FOUND',
}

export type ApplicationErrorType =
  | ClientErrors
  | GeneralErrors
  | AuthenticationErrors
  | UserErrors;

export interface ApplicationError {
  code: ApplicationErrorType;
  message: string;
  details?: any;
}

export type ApplicationReject = (error: ApplicationError) => void;

export interface ApplicationResponse<DataType> {
  success: boolean;
  data?: DataType;
  error?: ApplicationError;
}

export enum UserRoles {
  USER_ADMIN = 'USER_ADMIN',
  USER_ANONYMOUS = 'USER_ANONYMOUS',
  USER_LOGGED = 'USER_LOGGED'
}

export interface UserType {
  id: number;
  pseudo: string;
  email: string;
  password: string;
  registrationDate: Moment;
  lastConnexionDate: Moment;
  profilePath: string | null;
  wsToken: string;
  isArchived: boolean,
  role: UserRoles
}

export enum Teams {
  TEAM_BLUE= 'TEAM_BLUE',
  TEAM_RED= 'TEAM_RED'
}

export interface TeamType {
  key: Teams;
  name: string;
}

export interface ApplicationDecryptedToken {
  currentUser: UserType;
  token: string;
}

export interface Game {
  id: number;
  token: string;
  joiningKey: string;
  startDate: Moment | null;
  endDate: Moment | null;
  winnerTeam: Teams | null;
  isFinished: boolean;
  isFull: boolean;
}

export interface GameUser {
  id: number;
  teamId: Teams;
  userId: number;
  joiningGameDate: Moment;
  gameId: number;
  position: number;
  isFinished: boolean;
}

export interface PositionGame {
  teamId: Teams;
  position: number;
  pseudo: string;
  selectable: boolean;
  nbrCards: number;
}

export enum MessageErrorType {
  COMMAND_NOT_FOUND = 'COMMAND_NOT_FOUND'
}

export enum STATE_VALIDATION {
  'HIDE' = 'HIDE',
  'ERROR' = 'ERROR',
  'VALID' = 'VALID'
}
