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

    // Desarrollo
    socket.onAny((event, ...args) => {
      console.log(`📩 Evento recibido: ${event}`, args)
    })
  }

  disconnect() {
    socket.disconnect()
  }

  
  createGame(password: string, userId: number) {
     console.log("📡 Socket conectado:", socket.connected)
    socket.emit('create-game', password, userId)
    console.log("📤 Emitiendo create-game:", password, userId)
  }

  joinGame(gameId: number, player2Id: number, password?: string) {
    socket.emit('join-game', gameId, player2Id, password)
  }

  sendTurn(turnData: TurnData) {
    console.log("Enviando turno")
    socket.emit('game-update', turnData)
  }
 
  statSelection(stat: string, index: number){
    socket.emit('stat-selected', stat, index)
  }

  
  onJoinedGame(callback: (data: joinedGame) => void) {
    socket.on('join-game', callback)
  }

  onGameUpdate(callback: (data: GameUpdate) => void) {
    console.log("Recibiendo los datos del turno")
    socket.on('game-update', callback)
  }

  onGameEnd(callback: (data: GameEnd) => void) {
    socket.on('game-ended', callback)
  }

  onStatSelected(callback: (stat: string, index: number) => void){
    socket.on('stat-selected',callback)
  }

  // -------- Limpiar listeners --------
  removeAllListeners() {
    socket.off('join-game')
    socket.off('game-update')
    socket.off('game-ended')
    socket.off('connect')
    socket.off('connect_error')
    socket.off('onAny')
  }

  testPing() {
    socket.emit('ping-test', 'Hola desde frontend')
  }
}

const socketGameService = new SocketGameService()
export default socketGameService
