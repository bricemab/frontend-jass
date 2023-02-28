<template>
  <Loader v-if="isLoading" :msg="loaderMsg"/>
  <div :class="isChatBoxOpen ? 'chatbox open' : 'chatbox'">
    <div class="message-list">
      <div v-for="(message, index) in messages" v-bind:key="index" :class="message.isSystem ? 'system-message' : ''"><b>{{
          message.pseudo
        }}</b>: <span class="message">{{ message.msg }}</span></div>
    </div>
    <div id="chat-add-msg" class="">
      <input type="text" class="input" @keypress.enter="addUserMessage" v-model="msg"
             :placeholder="$t('games.addMessageInput')" id="input-add-msg">
    </div>
  </div>
  <div class="play">
    <div class="board">
      <img src="@/assets/board.jpg" alt="board"/>
      <span class="chatbox-toggle icon fa" @click="toggleChatBox">
        <font-awesome-icon icon="message"/>
        <span v-if="notificationsCounter > 0" class="notification">{{ notificationsCounter }}</span>
      </span>
      <div v-if="chooseTeams"
           :class="'player player-'+getPositionOnBoard(value.position) + (value.selectable ? ' selectable' : '')"
           v-for="(value, key) in positions" @click="joinTeam(value)" v-bind:key="key">
        <div class="nbr-cards">
          <img :src="getBackPathCard()" alt="back card">
          <span>{{value.nbrCards}}</span>
        </div>
        {{ value.pseudo }}
      </div>
      <div class="distribute-cards" v-if="deck.length !== 0 && cardsPositionsOnBoard.length !== 0">
        <img :src="getBackPathCard()" class="card" v-for="index in 36" :key="index" :style="getCardDeckPosition(index)">
      </div>
      <div class="distribute-cards" v-else>
        <img :src="getBackPathCard()" class="card" :style="getCardDeckPosition(0)">
      </div>
      <div class="deck" :data-id="deck.length">
        <div v-if="isDistributeCardsFinished && !activeCardsVisible" :class="!cardsVisible ? 'card-flip-inner' : 'card-flip-inner is-flipped'" v-for="cardObject in deck" v-bind:key="cardObject.card">
          <div class="card-flip-back">
            <img :src="getBackPathCard()"/>
          </div>
          <div class="card-flip-front">
            <img :class="selectedCardClass(cardObject.card)" :alt="getCardName(cardObject.card)" :src="getPathCard(cardObject.card)">
          </div>
        </div>
        <img v-for="cardObject in deck" v-bind:key="cardObject.card" v-if="activeCardsVisible" :class="selectedCardClass(cardObject.card)" :alt="getCardName(cardObject.card)" :src="getPathCard(cardObject.card)" @click="selectCard(cardObject)">
      </div>
    </div>
  </div>
  <div class="footer">
    © Copyright {{ date }} Brice Mabillard.
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import WsManager from '@/services/ws/WsManager';
import store from '@/store';
import {
  AvailableTeamPlace,
  WebsocketPacket,
  WebSocketServerSecuredMessage,
  WebSocketState, WsPacketAddNewMessage,
  WsPacketConnectionRequest, WsPacketDeckCardsResponse, WsPacketJoinGameResponse,
  WsPacketServiceResponse
} from '@/services/ws/TypesWebsocket';
import WebSocketOpCodeServer from '@/services/ws/WebSocketOpCodeServer';
import Utils from '@/utils/Utils';
import WebSocketOpCodeClient from '@/services/ws/WebSocketOpCodeClient';
import { ApplicationError, Game, GameUser, GeneralErrors, PositionGame, Teams } from '@/Types/GlobalType';
import Loader from '../Loader.vue';
import GlobalStore from '@/utils/GlobalStore';
import { DeckCard } from '@/Types/CardsType';

@Options({
  components: {
    Loader
  }
})
export default class PlayLayout extends Vue {
  public isChatBoxOpen = false
  public chooseTeams = false
  public wsManager: WsManager | undefined
  public loaderMsg = ''
  public msg = ''
  public isLoading = false
  public notificationsCounter = 0
  public availableTeamPlaces: AvailableTeamPlace[] = []
  public game: Game | undefined
  public gameUser: GameUser | undefined
  public deck: DeckCard[] = []
  public trumpPosition = 0;
  public cardsPositionsOnBoard: {top: string; left: string;}[] = [];
  public distributeCardsCounter = 0;
  public selectedCard: DeckCard | undefined;
  public cardsVisible = false;
  public isDistributeCardsFinished = false;
  public activeCardsVisible = false;
  public currentPositionDistribute = 0;
  public async distributeCardsDynamicly () {
    for (let i = this.cardsPositionsOnBoard.length - 1; i >= 0; i--) {
      let v = this.distributeCardsCounter * 0.25 - 4;
      if (this.distributeCardsCounter % 3 === 0) {
        this.currentPositionDistribute = Utils.getNextPositionFromCurrent(this.currentPositionDistribute);
      }
      switch (this.currentPositionDistribute) {
        case 1:
          this.cardsPositionsOnBoard[i].left += 'left: calc(50% + ' + v + 'px + 13px);';
          this.cardsPositionsOnBoard[i].top += 'top: calc(-335px + ' + v + 'px);';
          break;
        case 2:
          this.cardsPositionsOnBoard[i].left += 'left: calc(500px + ' + v + 'px); ';
          this.cardsPositionsOnBoard[i].top += 'top: calc(50% + ' + v + 'px);';
          break;
        case 3:
          v += 10;
          this.cardsPositionsOnBoard[i].left += 'left: calc(50% + ' + v + 'px);';
          this.cardsPositionsOnBoard[i].top += 'top: calc(285px + ' + v + 'px);';
          break;
        case 4:
          this.cardsPositionsOnBoard[i].left += 'left: calc(-498px + ' + v + 'px);';
          this.cardsPositionsOnBoard[i].top += 'top: calc(50% + ' + v + 'px);';
          break;
      }
      this.distributeCardsCounter++;
      await Utils.createTimeOut(50);
    }
    this.currentPositionDistribute = this.trumpPosition;
    await Utils.createTimeOut(300);
    this.isDistributeCardsFinished = true;
    for (let i = this.cardsPositionsOnBoard.length - 1; i >= 0; i--) {
      if (this.distributeCardsCounter % 3 === 0) {
        this.currentPositionDistribute = Utils.getNextPositionFromCurrent(this.currentPositionDistribute);
      }
      switch (this.currentPositionDistribute) {
        case 3:
          this.cardsPositionsOnBoard[i].left += 'display:none';
          break;
      }
      this.distributeCardsCounter++;
    }
    await Utils.createTimeOut(500);
    await this.reveleCards();
  }

  public positions = [{
    position: 1,
    pseudo: Utils.translate('games.availablePosition', { team: Utils.translate('global.teams.red') }),
    teamId: Teams.TEAM_RED,
    selectable: true,
    nbrCards: 9
  }, {
    position: 2,
    pseudo: Utils.translate('games.availablePosition', { team: Utils.translate('global.teams.blue') }),
    teamId: Teams.TEAM_BLUE,
    selectable: true,
    nbrCards: 9
  }, {
    position: 3,
    pseudo: Utils.translate('games.availablePosition', { team: Utils.translate('global.teams.red') }),
    teamId: Teams.TEAM_RED,
    selectable: true,
    nbrCards: 9
  }, {
    position: 4,
    pseudo: Utils.translate('games.availablePosition', { team: Utils.translate('global.teams.blue') }),
    teamId: Teams.TEAM_BLUE,
    selectable: true,
    nbrCards: 9
  }] as PositionGame[]

  public messages: { pseudo: string; msg: string; isSystem: boolean }[] = []

  public toggleChatBox () {
    this.isChatBoxOpen = !this.isChatBoxOpen;
    this.notificationsCounter = 0;
  }

  public showLoader (txt: string) {
    this.isLoading = true;
    this.loaderMsg = Utils.translate(txt);
  }

  public getCardDeckPosition (i: number) {
    if (i === 0) {
      const v = i * 0.25 - 4;
      return {
        top: 'top: calc(50% - ' + v + 'px)',
        left: 'calc(50% - ' + v + 'px)'
      };
    }
    return this.cardsPositionsOnBoard[i - 1].top + ' ' + this.cardsPositionsOnBoard[i - 1].left;
  }

  public async reveleCards () {
    this.cardsVisible = true;
    await Utils.createTimeOut(1000);
    this.activeCardsVisible = true;
  }

  public addSystemMessage (message: string) {
    if (!this.isChatBoxOpen) {
      this.notificationsCounter++;
    }
    this.messages.push({
      msg: Utils.translate(message),
      pseudo: Utils.translate('global.system'),
      isSystem: true
    });
  }

  public selectedCardClass (key: string) {
    return this.selectedCard && this.selectedCard.card === key ? 'cards selected' : 'cards';
  }

  public selectCard (card: DeckCard) {
    this.selectedCard = card;
    this.$forceUpdate();
  }

  public getCardName (key: string) {
    const cards = Utils.getCards();
    for (const card of cards) {
      if (card.key === key) {
        const nameSplit = key.split('_');
        return Utils.translate('games.cards.' + nameSplit[0].toLowerCase()) + ' ' +
          Utils.translate('games.cards.' + nameSplit[1].toLowerCase()) + ' ' +
          Utils.translate('games.cards.' + nameSplit[2].toLowerCase());
      }
    }
  }

  public getPathCard (key: string) {
    return Utils.getCardPath(key);
  }

  public getBackPathCard () {
    return Utils.getCardPath('', true);
  }

  public hideLoader () {
    this.isLoading = false;
    this.loaderMsg = '';
  }

  public async joinNewGame () {
    return new Promise((resolve) => {
      this.showLoader('games.loadingMessage.lookingForGame');

      const wsCallbackFunction = async function (packet: any) {
        if (packet.success && packet.data) {
          resolve({
            success: true,
            data: packet.data
          });
        } else {
          resolve(packet);
        }
      };

      WsManager.sendMessageToServer(
        this.wsManager!.ws,
        Utils.uniqueId(24),
        WebSocketOpCodeServer.WSS_FROM_ANY__JOIN_GAME__REQUEST,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        {},
        true,
        wsCallbackFunction
      );
    });
  }

  public async startGame () {
    return new Promise((resolve) => {
      // this.showLoader('games.loadingMessage.lookingForGame');

      const wsCallbackFunction = async function (packet: any) {
        console.log(packet);
        if (packet.success && packet.data) {
          resolve({
            success: true,
            data: packet.data
          });
        } else {
          resolve(packet);
        }
      };

      WsManager.sendMessageToServer(
        this.wsManager!.ws,
        Utils.uniqueId(24),
        WebSocketOpCodeServer.WSS_FROM_ANY__GAME_START__REQUEST,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        {},
        true,
        wsCallbackFunction
      );
    });
  }

  public async addUserMessage () {
    const msgResponse = Utils.manageCommandsMessage(this.msg);
    if (!msgResponse.success && !msgResponse.data) {
      Utils.toastError('', Utils.translate('games.errorMessages.commandMsgNotFound'));
      this.msg = '';
    }
    const {
      opCode,
      msg
    } = msgResponse.data!;
    this.addUserMessageToWs(opCode, msg!);
  }

  public addUserMessageToWs (opCode: WebSocketOpCodeServer, msg: string) {
    WsManager.sendMessageToServer(
      this.wsManager!.ws,
      Utils.uniqueId(24),
      opCode,
      {
        success: true,
        data: {
          msg,
          gameToken: this.game!.token
        }
      },
      true
    );
  }

  public async joinTeam (pos: PositionGame) {
    return new Promise((resolve) => {
      if (!pos.selectable) {
        return resolve({
          success: true,
          data: {}
        });
      }
      // this.addSystemMessage('games.loadingMessage.waitingSelectionTeamOtherPlayers');
      pos.selectable = false;
      pos.pseudo = store.getters.user.pseudo;

      const wsCallbackFunction = async (packet: any) => {
        if (packet.success && packet.data) {
          const {
            availableTeamPlaces,
            game,
            gameUser
          } = packet.data;
          this.game = game;
          this.gameUser = gameUser;
          this.availableTeamPlaces = availableTeamPlaces;
          this.fillPositionsAlreadyTaken();
          // this.addSystemMessage('test');
          resolve({
            success: true,
            data: packet.data
          });
        } else {
          resolve(packet);
        }
      };

      WsManager.sendMessageToServer(
        this.wsManager!.ws,
        Utils.uniqueId(24),
        WebSocketOpCodeServer.WSS_FROM_ANY__JOIN_TEAM__REQUEST,
        {
          success: true,
          data: {
            gameToken: this.game!.token,
            teamId: pos.teamId,
            position: pos.position
          }
        },
        true,
        wsCallbackFunction
      );
    });
  }

  public addUserMessageToList (msg: string, pseudo: string) {
    if (!this.isChatBoxOpen) {
      this.notificationsCounter++;
    }
    this.messages.push({
      msg,
      pseudo,
      isSystem: false
    });
  }

  async onMessageReceived (
    message: WebSocketServerSecuredMessage<any>,
    clientWs: WebSocket,
    manager: WsManager
  ) {
    if (message && message.opCode && message.opCode !== WebSocketOpCodeClient.WSS_TO_ANY__PING__REQUEST) {
      console.log('Message received from websocket server', {
        meta: {
          message
        }
      });
    }

    if (
      typeof message !== 'object' ||
      typeof message.token !== 'string' ||
      typeof message.requestId !== 'string' ||
      typeof message.opCode !== 'string' ||
      typeof message.packet !== 'object'
    ) {
      WsManager.sendMessageToServer<WsPacketServiceResponse>(
        clientWs,
        'UNKNOWN',
        WebSocketOpCodeServer.WSS_FROM_ANY__INVALID__REQUEST,
        {
          success: false,
          data: {
            requestId: message.requestId || 'UNKNOWN'
          }
        },
        true
      );
      return;
    }

    if (
      !Utils.validateHmacSha256SignatureWs(
        message.token as string,
        message.packet
      )
    ) {
      WsManager.sendMessageToServer(
        clientWs,
        message.requestId,
        WebSocketOpCodeServer.WSS_FROM_ANY__INVALID_SIGNATURE__REQUEST,
        {
          success: false,
          data: {
            requestId: message.requestId || 'UNKNOWN'
          }
        },
        true
      );
      return;
    }

    let messageTyped: WebSocketServerSecuredMessage<any>;
    let callback: any;
    switch (message.opCode) {
      case WebSocketOpCodeClient.WSS_TO_ANY__WS_CONNECTION__RESPONSE:
        try {
          messageTyped = message as WebSocketServerSecuredMessage<WsPacketConnectionRequest>;
          if (messageTyped.packet.success) {
            manager.ws.wsKey = messageTyped.packet.data.wsKey;
            manager.ws.state = messageTyped.packet.data.state;
            manager.ws.role = messageTyped.packet.data.role;
            manager.ws.token = messageTyped.packet.data.role;
            this.hideLoader();
          }
        } catch (e) {
          Utils.manageError(e as ApplicationError);
          return WsManager.sendMessageToServer<ApplicationError>(
            clientWs,
            message.requestId,
            WebSocketOpCodeServer.WSS_FROM_ANY__ERROR_HAS_OCCURRED__RESPONSE,
            {
              success: false,
              data: {
                code: GeneralErrors.SYSTEM_ERROR,
                message: 'An error has occurred while performing the operation',
                details: e
              }
            },
            true
          );
        }
        break;
      case WebSocketOpCodeClient.WSS_TO_ANY__TEAM_NEW_MESSAGE__RESPONSE:
        messageTyped = message as WebSocketServerSecuredMessage<WsPacketAddNewMessage>;
        this.addUserMessageToList(messageTyped.packet.data.msg, messageTyped.packet.data.pseudo);
        this.msg = '';
        break;
      case WebSocketOpCodeClient.WSS_TO_ANY__ALL_NEW_MESSAGE__RESPONSE:
        messageTyped = message as WebSocketServerSecuredMessage<WsPacketAddNewMessage>;
        this.addUserMessageToList(messageTyped.packet.data.msg, messageTyped.packet.data.pseudo);
        this.msg = '';
        break;
      case WebSocketOpCodeClient.WSS_TO_ANY__JOIN_TEAM__RESPONSE:
        messageTyped = message as WebSocketServerSecuredMessage<WsPacketJoinGameResponse>;
        this.game = messageTyped.packet.data.game;
        this.gameUser = messageTyped.packet.data.gameUser;
        this.availableTeamPlaces = messageTyped.packet.data.availableTeamPlaces;
        this.fillPositionsAlreadyTaken();
        break;
      case WebSocketOpCodeClient.WSS_TO_ANY__JOIN_GAME__RESPONSE:
        callback = GlobalStore.getItem(message.requestId);
        if (
          callback &&
          typeof callback === 'function'
        ) {
          await callback(message.packet);
          GlobalStore.removeItem(message.requestId);
        } else {
          if (!callback) {
            console.log(
              `The WS request with ${message.opCode} could not be processed correctly, any callback with the id ${message.requestId} was found`
            );
          }
        }
        break;
      case WebSocketOpCodeClient.WSS_TO_ANY__GAME_START__REQUEST:
        messageTyped = message as WebSocketServerSecuredMessage<any>;
        this.chooseTeams = true;
        this.fillPositionsAlreadyTaken();
        await this.getCurrentDeck() as WebsocketPacket<WsPacketDeckCardsResponse>;
        await Utils.createTimeOut(2000);
        this.hideLoader();
        await this.startGame();
        break;
      case WebSocketOpCodeClient.WSS_TO_ANY__PING__REQUEST:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        WsManager.sendMessageToServer(manager.ws, Utils.uniqueId(24), WebSocketOpCodeServer.WSS_FROM_ANY__PONG__REQUEST, {}, true);
        break;
      case WebSocketOpCodeClient.WSS_TO_ANY__DISTRIBUTE_DECK__RESPONSE:
        messageTyped = message as WebSocketServerSecuredMessage<WsPacketDeckCardsResponse>;
        this.chooseTeams = true;
        this.fillPositionsAlreadyTaken();
        await Utils.createTimeOut(2000);
        this.deck = messageTyped.packet.data.deckCards;
        this.trumpPosition = messageTyped.packet.data.trumpPosition;
        this.currentPositionDistribute = messageTyped.packet.data.trumpPosition;
        this.hideLoader();
        await this.distributeCardsDynamicly();
        break;
      case WebSocketOpCodeClient.WSS_TO_ANY__INVALID_QUERY__RESPONSE:
      case WebSocketOpCodeClient.WSS_TO_ANY__INVALID_OP_CODE__RESPONSE:
      case WebSocketOpCodeClient.WSS_TO_ANY__FORBIDDEN_REQUEST__RESPONSE:
      case WebSocketOpCodeClient.WSS_TO_ANY__INVALID_TOKEN__RESPONSE:
      case WebSocketOpCodeClient.WSS_TO_ANY__SERVICE_NOT_AVAILABLE__RESPONSE:
        console.log('ERROR REPORTED BY WS SERVER', { meta: { message } });
        break;
      default:
        console.log('OPCODE NOT DEFINED', {
          meta: {
            opCode: message.opCode,
            message
          }
        });
    }
  }

  async mounted () {
    this.cardsPositionsOnBoard = Utils.getFakeCardsToDistribute();
    this.showLoader('games.loadingMessage.connexionInProgress');
    this.wsManager = new WsManager(store.getters.user, store.getters.userRole, this.onMessageReceived);
    // wait the full connection to WS
    while (this.wsManager.ws.state !== WebSocketState.CONNECTED) {
      await Utils.createTimeOut(500);
    }
    const joinGameResponse = await this.joinNewGame() as WebsocketPacket<WsPacketJoinGameResponse>;
    if (!joinGameResponse.success && !joinGameResponse.data) {
      Utils.toastError(
        '',
        Utils.translate('games.loadingMessage.errorJoin')
      );
    }
    const {
      availableTeamPlaces,
      game,
      gameUser,
      messages,
      isGameStarted
    } = joinGameResponse.data;
    this.game = game;
    this.gameUser = gameUser;
    this.messages = messages;
    this.availableTeamPlaces = availableTeamPlaces;
    if (isGameStarted) {
      this.chooseTeams = true;
      this.fillPositionsAlreadyTaken();
      const deckResponse = await this.getCurrentDeck() as WebsocketPacket<WsPacketDeckCardsResponse>;
      const { deckCards, trumpPosition } = deckResponse.data!;
      await Utils.createTimeOut(2000);
      this.deck = deckCards;
      this.trumpPosition = trumpPosition;
      this.currentPositionDistribute = trumpPosition;
      this.hideLoader();
      await this.distributeCardsDynamicly();
    } else {
      this.hideLoader();
      this.chooseTeams = true;
      this.fillPositionsAlreadyTaken();
    }
  }

  public async getCurrentDeck () {
    return new Promise((resolve) => {
      this.showLoader('games.loadingMessage.loadingDeck');

      const wsCallbackFunction = async (packet: any) => {
        if (packet.success && packet.data) {
          const packetData = packet as WebsocketPacket<WsPacketDeckCardsResponse>;
          this.deck = packetData.data.deckCards;
          this.trumpPosition = packetData.data.trumpPosition;
          this.currentPositionDistribute = packetData.data.trumpPosition;
          resolve({
            success: true,
            data: packet.data
          });
        } else {
          resolve(packet);
        }
      };

      WsManager.sendMessageToServer(
        this.wsManager!.ws,
        Utils.uniqueId(24),
        WebSocketOpCodeServer.WSS_FROM_ANY__DISTRIBUTE_DECK__REQUEST,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        {},
        true,
        wsCallbackFunction
      );
    });
  }

  public fillPositionsAlreadyTaken () {
    for (const place of this.availableTeamPlaces) {
      for (const pos of this.positions) {
        const position = place.places.find(p => p.position === pos.position);
        if (position) {
          pos.pseudo = position.pseudo;
          pos.selectable = position.selectable;
        }
        if (
          this.gameUser &&
          this.gameUser.position &&
          store.getters.user.id === this.gameUser.userId
        ) {
          pos.selectable = false;
        }
      }
    }
  }

  getPositionOnBoard (position: number) {
    let userPosition = 0;
    for (const place of this.availableTeamPlaces) {
      const currUser = place.places.find(p => p.pseudo === store.getters.user.pseudo);
      if (currUser) {
        userPosition = currUser.position;
      }
    }
    if (userPosition === 1) {
      switch (position) {
        case 1:
          return 3;
        case 2:
          return 4;
        case 3:
          return 1;
        case 4:
          return 2;
      }
    } else if (userPosition === 2) {
      switch (position) {
        case 1:
          return 2;
        case 2:
          return 3;
        case 3:
          return 4;
        case 4:
          return 1;
      }
    } else if (userPosition === 3) {
      return position;
    } else if (userPosition === 4) {
      switch (position) {
        case 1:
          return 4;
        case 2:
          return 1;
        case 3:
          return 2;
        case 4:
          return 3;
      }
    } else {
      return position;
    }
  }

  get date () {
    return moment().format('YYYY');
  }
}
</script>

<style scoped>

</style>
