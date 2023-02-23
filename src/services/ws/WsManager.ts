import WebSocketOpCodeServer from './WebSocketOpCodeServer';
import config from '../../config/config';
import Utils from '../../utils/Utils';
import {
  WebsocketClient,
  WebsocketPacket,
  WebSocketRole,
  WebSocketServerSecuredMessage,
  WebSocketState,
  WsPacketConnectionRequest,
  WsPacketServiceResponse
} from './TypesWebsocket';
import WebSocketOpCodeClient from './WebSocketOpCodeClient';
import { ApplicationError, GeneralErrors, UserRoles, UserType } from '@/Types/GlobalType';
import GlobalStore from '@/utils/GlobalStore';

const callbacks: { [key: string]: any } = {};
export default class WsManager {
  ws: WebsocketClient
  timeOut: any
  onMessage: any

  constructor (user: UserType, userRole: UserRoles, messageCallback: any) {
    this.onMessage = messageCallback;
    this.ws = new WebSocket(config.ws.hostname);
    this.connectWs(user, userRole, messageCallback);
  }

  static sendMessageToServer<DataType> (
    wsClient: WebSocket,
    requestId: string | null,
    serverOpCode: WebSocketOpCodeServer,
    data: WebsocketPacket<DataType>,
    asFinalResponse: boolean,
    onCompletePromise?: any
  ) {
    if (!requestId) {
      requestId = Utils.uniqueId(24);
    }

    if (wsClient.readyState === wsClient.OPEN) {
      if (serverOpCode !== WebSocketOpCodeServer.WSS_FROM_ANY__PONG__REQUEST) {
        console.log('Sending message to server', {
          meta: {
            opCode: serverOpCode,
            requestId,
            packet: data,
            token: Utils.buildHmacSha256SignatureWs(data),
            asFinalResponse
          }
        });
      }

      wsClient.send(
        JSON.stringify({
          opCode: serverOpCode,
          requestId,
          packet: data,
          token: Utils.buildHmacSha256SignatureWs(data),
          asFinalResponse
        })
      );

      if (onCompletePromise) {
        GlobalStore.addItem(requestId, onCompletePromise);
      }
    } else {
      console.log('Message could not be sent because WS was not ready', {
        meta: {
          opCode: serverOpCode,
          requestId,
          packet: data,
          token: Utils.buildHmacSha256SignatureWs(data),
          asFinalResponse
        }
      });
    }
  }

  // static async onMessageReceived (
  //   message: WebSocketServerSecuredMessage<any>,
  //   clientWs: WebSocket,
  //   manager: WsManager
  // ) {
  //   console.log('Message received from websocket server', {
  //     meta: {
  //       message
  //     }
  //   });
  //
  //   if (
  //     typeof message !== 'object' ||
  //     typeof message.token !== 'string' ||
  //     typeof message.requestId !== 'string' ||
  //     typeof message.opCode !== 'string' ||
  //     typeof message.packet !== 'object'
  //   ) {
  //     WsManager.sendMessageToServer<WsPacketServiceResponse>(
  //       clientWs,
  //       'UNKNOWN',
  //       WebSocketOpCodeServer.WSS_FROM_ANY__INVALID__REQUEST,
  //       {
  //         success: false,
  //         data: {
  //           requestId: message.requestId || 'UNKNOWN'
  //         }
  //       },
  //       true
  //     );
  //     return;
  //   }
  //
  //   if (
  //     !Utils.validateHmacSha256SignatureWs(
  //       message.token as string,
  //       message.packet
  //     )
  //   ) {
  //     WsManager.sendMessageToServer(
  //       clientWs,
  //       message.requestId,
  //       WebSocketOpCodeServer.WSS_FROM_ANY__INVALID_SIGNATURE__REQUEST,
  //       {
  //         success: false,
  //         data: {
  //           requestId: message.requestId || 'UNKNOWN'
  //         }
  //       },
  //       true
  //     );
  //     return;
  //   }
  //
  //   let messageTyped: WebSocketServerSecuredMessage<any>;
  //   switch (message.opCode) {
  //     case WebSocketOpCodeClient.WSS_TO_ANY__WS_CONNECTION__RESPONSE:
  //       try {
  //         messageTyped = message as WebSocketServerSecuredMessage<WsPacketConnectionRequest>;
  //         if (messageTyped.packet.success) {
  //           manager.ws.wsKey = messageTyped.packet.data.wsKey;
  //           manager.ws.state = messageTyped.packet.data.state;
  //           manager.ws.role = messageTyped.packet.data.role;
  //           manager.ws.token = messageTyped.packet.data.role;
  //         }
  //       } catch (e) {
  //         Utils.manageError(e as ApplicationError);
  //         return WsManager.sendMessageToServer<ApplicationError>(
  //           clientWs,
  //           message.requestId,
  //           WebSocketOpCodeServer.WSS_FROM_ANY__ERROR_HAS_OCCURRED__RESPONSE,
  //           {
  //             success: false,
  //             data: {
  //               code: GeneralErrors.SYSTEM_ERROR,
  //               message: 'An error has occurred while performing the operation',
  //               details: e
  //             }
  //           },
  //           true
  //         );
  //       }
  //       break;
  //     case WebSocketOpCodeClient.WSS_TO_ANY__INVALID_QUERY__RESPONSE:
  //     case WebSocketOpCodeClient.WSS_TO_ANY__INVALID_OP_CODE__RESPONSE:
  //     case WebSocketOpCodeClient.WSS_TO_ANY__FORBIDDEN_REQUEST__RESPONSE:
  //     case WebSocketOpCodeClient.WSS_TO_ANY__INVALID_TOKEN__RESPONSE:
  //     case WebSocketOpCodeClient.WSS_TO_ANY__SERVICE_NOT_AVAILABLE__RESPONSE:
  //       console.log('ERROR REPORTED BY WS SERVER', { meta: { message } });
  //       break;
  //     default:
  //       console.log('OPCODE NOT DEFINED', {
  //         meta: {
  //           opCode: message.opCode,
  //           message
  //         }
  //       });
  //   }
  // }

  static onClose (message: any, clientWs: WebSocket, manager: WsManager) {
    clearTimeout(manager.timeOut);
    console.log('Connexion has been closed');
    console.log('We will try to reconnect you in 5 seconds');
    setTimeout(function () {
      manager.connectWs(manager.ws.user!, manager.ws.userRole!, manager.onMessage);
    }, 5000);
  }

  static onError (message: any, clientWs: WebSocket, manager: WsManager) {
    console.log('Error has occurred', {
      meta: {
        message,
        clientWs
      }
    });
  }

  static onPing (message: any, clientWs: WebsocketClient, manager: WsManager) {
    const wsKey = clientWs.wsKey ? clientWs.wsKey : clientWs.token;
    console.log('receive pinf from WS');
    clearTimeout(manager.timeOut);
    manager.timeOut = setTimeout(function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      clientWs.terminate();
    }, 30000 + 1000);
  }

  connectWs (user: UserType, userRole: UserRoles, messageCallback: any) {
    console.log('Connexion to WS in progress');
    this.ws = new WebSocket(config.ws.hostname) as any;
    this.ws.id = Utils.shortId();
    this.ws.user = user;
    this.ws.userRole = userRole;
    this.ws.wsKey = user.wsToken;
    this.ws.timeOut = setTimeout;
    this.ws.state = WebSocketState.DISCONNECTED;
    this.ws.role = WebSocketRole.UNKNOWN;
    this.ws.onopen = e => {
      console.log('Connection successfully');
      WsManager.sendMessageToServer(
        this.ws,
        null,
        WebSocketOpCodeServer.WSS_FROM_ANY__WS_CONNECTION__REQUEST,
        {
          success: true,
          data: {
            userToken: this.ws.user!.wsToken
          }
        },
        true
      );
    };

    this.ws.onmessage = event =>
      messageCallback(JSON.parse(event.data as any), this.ws, this);

    this.ws.onclose = event => WsManager.onClose(event, this.ws, this);
    this.ws.onerror = error => WsManager.onError(error, this.ws, this);
  }
}
