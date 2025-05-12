import { io, Socket } from 'socket.io-client'

const URL = import.meta.env.VITE_SOCKET_URL

const socket: Socket = io(URL, {
  autoConnect: false, // conectamos manualmente cuando lo necesitemos
  transports: ['websocket'],
})

export default socket
