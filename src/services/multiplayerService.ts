// src/services/SocketGameService.ts
import socket from '../sockets/socket'
import { GameEnd, GameUpdate, joinedGame, TurnData } from "../models/Game"

export class SocketGameService {
  connect() {
    if(!socket.connected){
      socket.connect()
    }
    socket.on("connect", () => {
      console.log("Socket conectado desde frontend:", socket.id)
    })

    socket.on("connect_error", (err) => {
      console.error("Error de conexión de socket:", err)
    })

    // Puedes agregar un log para verificar eventos recibidos
    socket.onAny((event, ...args) => {
      console.log(`📩 Evento recibido: ${event}`, args)
    })
  }

  disconnect() {
    socket.disconnect()
  }

  // -------- EMITS --------
  createGame(password: string, userId: number) {
     console.log("📡 Socket conectado:", socket.connected)
    socket.emit('create-game', password, userId)
    console.log("📤 Emitiendo create-game:", password, userId)
  }

  joinGame(gameId: number, player2Id: number, password?: string) {
    socket.emit('join-game', gameId,player2Id, password)
  }

  sendTurn(turnData: TurnData) {
    socket.emit('game-update', turnData)
  }

  // -------- LISTENERS --------
  onJoinedGame(callback: (data: joinedGame) => void) {
    socket.on('join-game', callback)
  }

  onGameUpdate(callback: (data: GameUpdate) => void) {
    socket.on('game-update', callback)
  }

  onGameEnd(callback: (data: GameEnd) => void) {
    socket.on('game-ended', callback)
  }

  // -------- Limpiar listeners --------
  removeAllListeners() {
    socket.off('join-game')
    socket.off('game-update')
    socket.off('game-ended')
  }

  // -------- Test de conexión --------
  testPing() {
    socket.emit('ping-test', 'Hola desde frontend')
  }
}

const socketGameService = new SocketGameService()
export default socketGameService
