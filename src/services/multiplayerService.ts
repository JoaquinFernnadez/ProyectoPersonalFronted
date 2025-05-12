import socket from '../sockets/socket'
import { GameEnd, GameUpdate, joinedGame, TurnData } from "../models/Game"


export class SocketGameService {
  connect() {
    if (!socket.connected) {
      socket.connect()
    }
  }

  disconnect() {
    socket.disconnect()
  }

  //  EMITS
  createGame(password?: string) {
    socket.emit('create-game', password)
  }

  joinGame(gameId: number, password?: string) {
    socket.emit('join-game', gameId, password)
  }

  sendTurn(turnData: TurnData) {
    socket.emit('game-update', turnData)
  }

  //  LISTENERS (ON)
  onJoinedGame(callback: (data: joinedGame) => void) {
    socket.on('join-game', callback)
  }

  onGameUpdate(callback: (data: GameUpdate) => void) {
    socket.on('game-update', callback)
  }

  onGameEnd(callback: (data: GameEnd) => void) {
    socket.on('game-ended', callback)
  }

  //  Limpiar listeners
  removeAllListeners() {
    socket.off('join-game')
    socket.off('game-update')
    socket.off('game-ended')
  }
}

const socketGameService = new SocketGameService()
export default socketGameService
