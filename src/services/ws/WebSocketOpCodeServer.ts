enum WebSocketOpCodeServer {

  WSS_FROM_ANY__JOIN_GAME__REQUEST = 'WSS_FROM_ANY__JOIN_GAME__REQUEST',
  WSS_FROM_ANY__JOIN_TEAM__REQUEST = 'WSS_FROM_ANY__JOIN_TEAM__REQUEST',
  WSS_FROM__TEAM_NEW_MESSAGE__REQUEST = 'WSS_FROM__TEAM_NEW_MESSAGE__REQUEST',
  WSS_FROM__ALL_NEW_MESSAGE__REQUEST = 'WSS_FROM__ALL_NEW_MESSAGE__REQUEST',
  WSS_FROM_ANY__GAME_START__REQUEST = 'WSS_FROM_ANY__GAME_START__REQUEST',
  WSS_FROM_ANY__PONG__REQUEST = 'WSS_FROM_ANY__PONG__REQUEST',
  WSS_FROM_ANY__DISTRIBUTE_DECK__REQUEST = 'WSS_FROM_ANY__DISTRIBUTE_DECK__REQUEST',

  WSS_FROM_ANY__WS_DISCONNECTION__RESPONSE = 'WSS_FROM_ANY__WS_DISCONNECTION__RESPONSE',
  WSS_FROM_ANY__WS_CONNECTION__REQUEST = 'WSS_FROM_ANY__WS_CONNECTION__REQUEST',
  WSS_FROM_ANY__INVALID__REQUEST = 'WSS_FROM_ANY__INVALID__REQUEST',
  WSS_FROM_ANY__ERROR_HAS_OCCURRED__RESPONSE = 'WSS_FROM_ANY__ERROR_HAS_OCCURRED__RESPONSE',
  WSS_FROM_ANY__INVALID_SIGNATURE__REQUEST = 'WSS_FROM_ANY__INVALID_SIGNATURE__REQUEST',
  WSS_TO_API__MOBILE_MESSAGE__RESPONSE = 'WSS_TO_API__MOBILE_MESSAGE__RESPONSE'
}

export default WebSocketOpCodeServer;
