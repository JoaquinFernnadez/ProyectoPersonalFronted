export interface Game {
    id: number
    password: string
    player1Id: number
    player2Id?: number
    currentTurn: number
    status: string
    winner?: string
    createdAt: Date
    rounds?: Round
}

export interface Round {
    id: number
    gameId: number
    roundNumber: number
    player1Choice?: {
        pokeId: number
        stat: number
    }
    player2Choice?: {
        pokeId: number
        stat: number
    }
    winner?: string
    selectedStat?: number
    createdAt: Date
}

export interface TurnData {
    gameId: number
    playerId: number
    turn: number
    choice: number
    roundNumber: number
    selectedStat: number
}
export interface GameUpdate {
    message: string
    gameUpdated: Game
    round: Round
}

export interface GameEnd {
    message: string
    finalGameState: Game
}
export interface joinedGame {
    ready: boolean
    gameId: number
    players: {
        player1Id: number
        player2Id: number
    }
}