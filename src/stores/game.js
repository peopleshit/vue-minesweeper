import { defineStore } from 'pinia'

import _ from 'lodash'

export const EASY = {
  id: 'easy',
  x: 9,
  y: 9,
  mines: 10
}

export const MEDIUM = {
  id: 'medium',
  x: 16,
  y: 16,
  mines: 40
}

export const HARD = {
  id: 'hard',
  x: 16,
  y: 30,
  mines: 99
}

export const LEVELS = _([EASY, MEDIUM, HARD]).map(v => [v.id, v]).fromPairs().value()

const getAdjacentCells = (cells, x, y) => {
  const adjacent = []

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) {
        continue
      }

      adjacent.push(cells[x + dx]?.[y + dy])
    }
  }

  return adjacent.filter(c => c != null)
}

const placeMines = (cells, minesCount, x, y) => {
  const minesGrid = {}

  const gridX = cells.length
  const gridY = _.first(cells)?.length ?? 0

  _.sampleSize(
    _(gridX * gridY)
      .range()
      .without(x * gridY + y)
      .value(),
    minesCount
  ).forEach(v => {
    const xIdx = _.floor(v / gridY)
    const yIdx = v % gridY

    if (!_.has(minesGrid, xIdx)) {
      minesGrid[xIdx] = {}
    }

    minesGrid[xIdx][yIdx] = 1
  })

  for (let xIdx = 0; xIdx < gridX; xIdx++) {
    for (let yIdx = 0; yIdx < gridY; yIdx++) {
      cells[xIdx][yIdx] = {
        ...cells[xIdx][yIdx],
        value: minesGrid[xIdx]?.[yIdx] === 1
          ? -1
          : _.sum([
            minesGrid[xIdx - 1]?.[yIdx - 1],
            minesGrid[xIdx - 1]?.[yIdx],
            minesGrid[xIdx - 1]?.[yIdx + 1],
            minesGrid[xIdx]?.[yIdx - 1],
            minesGrid[xIdx]?.[yIdx],
            minesGrid[xIdx]?.[yIdx + 1],
            minesGrid[xIdx + 1]?.[yIdx - 1],
            minesGrid[xIdx + 1]?.[yIdx],
            minesGrid[xIdx + 1]?.[yIdx + 1]
          ].filter(v => v != null))
      }
    }
  }
}

const revealAll = (cells) => {
  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      cells[x][y] = {
        ...cells[x]?.[y],
        revealed: true
      }
    }
  }
}

export default defineStore('game', {
  state: () => ({
    selectedLevel: HARD,
    game: {
      cells: [],
      cellsLeft: null,
      flagsSet: 0,
      mines: null,
      running: false,
      failed: false,
      complete: false
    }
  }),

  getters: {
    levels: () => LEVELS,

    level: state => state.selectedLevel.id,

    grid: state => state.game.cells,

    isRunning: state => state.game.running,

    minesRemaining: state => state.game.mines - state.game.flagsSet,

    isFailed: state => state.game.failed,

    isComplete: state => state.game.complete
  },

  actions: {
    newGame() {
      const level = this.selectedLevel

      const cells = []

      for (let xIdx = 0; xIdx < level.x; xIdx++) {
        const row = []

        for (let yIdx = 0; yIdx < level.y; yIdx++) {
          row.push({
            value: 0,
            x: xIdx,
            y: yIdx,
            revealed: false,
            flagged: false
          })
        }

        cells.push(row)
      }

      this.game = {
        cells,
        mines: level.mines,
        flagsSet: 0,
        cellsLeft: level.x * level.y,
        failed: false,
        running: false,
        complete: false
      }
    },

    flipFlag(x, y) {
      const cell = this.game.cells[x]?.[y]

      if (cell == null || cell.revealed) {
        return
      }

      const newState = !cell.flagged

      if (newState) {
        this.game.flagsSet += 1
      } else {
        this.game.flagsSet -= 1
      }

      this.game.cells[x][y] = {
        ...cell,
        flagged: !cell.flagged
      }
    },

    reveal(x, y, recursive = false) {
      if (this.game.failed || this.game.complete) {
        return
      }

      if (!this.game.running) {
        placeMines(this.game.cells, this.game.mines, x, y)

        this.game.running = true
      }

      const cell = this.game.cells[x]?.[y]

      if (cell == null || (cell.revealed && cell.value === 0 && !recursive) || ((cell.revealed || cell.flagged) && recursive)) {
        return
      }

      if (cell.revealed) {
        const adjacent = getAdjacentCells(this.game.cells, x, y)

        if (adjacent.filter(c => c.flagged).length !== cell.value) {
          return
        }

        adjacent.forEach(c => this.reveal(c.x, c.y, true))

        return
      }

      this.game.cells[x][y] = {
        ...cell,
        revealed: true,
        flagged: false
      }

      if (cell.value === -1) {
        this.game.failed = true
        this.game.running = false

        revealAll(this.game.cells)

        return
      }

      this.game.cellsLeft -= 1

      if (this.game.cellsLeft === this.game.mines) {
        this.game.running = false
        this.game.complete = true

        return
      }

      if (cell.value > 0 && recursive) {
        return
      }

      getAdjacentCells(this.game.cells, x, y)
        .filter(c => !c.revealed && (c.value === 0 && !recursive || c.value >= 0 && recursive))
        .forEach(c => this.reveal(c.x, c.y, true))
    },

    setLevel(id) {
      const level = LEVELS[id]

      if (level == null) {
        return
      }

      this.selectedLevel = level
    }
  }
})