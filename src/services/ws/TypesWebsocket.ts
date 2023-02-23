import WebSocketOpCodeClient from './WebSocketOpCodeClient';
import WebSocketOpCodeServer from './WebSocketOpCodeServer';
import { Game, GameUser, Teams, TeamType, UserRoles, UserType } from '@/Types/GlobalType';
import { Moment } from 'moment';
import { DeckCard } from '@/Types/CardsType'

export enum WebSocketState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
  OTHER = 'OTHER'
}

export enum TsConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED'
}

export enum WebSocketRole {
  UNKNOWN = 'UNKNOWN',
  ANONYMOUS = 'ANONYMOUS',
  CLIENT = 'CLIENT',
  REST_SERVICE = 'REST_SERVICE'
}

export interface WebsocketPacket<DataType> {
  serviceCommunicationToken?: string;
  success: boolean;
  data: DataType;
}

export interface WebSocketClientSecuredMessage<DataType> {
  opCode: WebSocketOpCodeServer;
  requestId: string | null;
  token: string;
  packet: {
    success: boolean;
    data: DataType;
  };
  hasFinalResponse: boolean;
}

export interface WebSocketServerSecuredMessage<DataType> {
  opCode: WebSocketOpCodeClient;
  requestId: string | null;
  token?: string;
  packet: WebsocketPacket<DataType>;
  hasFinalResponse: boolean;
}

export enum WebSocketCodeError {
  GAME_NOT_EXIST= 'GAME_NOT_EXIST'
}

export interface WebsocketClient extends WebSocket {
  id?: string;
  token?: string;
  role?: WebSocketRole;
  wsKey?: string;
  user?: UserType;
  userRole?: UserRoles;
  state?: WebSocketState;
  timeOut?: any;
  hasFinalResponse?: boolean;
}

export interface WsPacketConnectionRequest {
  state: WebSocketState;
  initialToken: string;
  wsKey: string;
  role: WebSocketRole;
}

// Packets
export interface WsPacketServiceResponse {
  requestId: string;
}

export interface AvailableTeamPlace {
  isFull: boolean;
  nbrUsers: number;
  teamId: string;
  places: {
    pseudo: string;
    position: number;
    selectable: boolean;
  }[];
}

export interface GameMessage {
  id: number;
  text: string;
  userId: number;
  gameId: number;
  date: Moment;
  isAll: boolean;
}

export interface WsPacketJoinGameResponse {
  availableTeamPlaces: AvailableTeamPlace[],
  game: Game;
  gameUser: GameUser;
  messages: {isSystem: boolean; pseudo: string; msg: string;}[],
  isGameStarted: boolean;
}

export interface WsPacketDeckCardsResponse {
  deckCards: DeckCard[];
  trumpPosition: number;
}

export interface WsPacketAddNewMessage {
  msg: string;
  pseudo: string;
}
