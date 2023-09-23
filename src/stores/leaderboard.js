import { defineStore } from 'pinia'

export default defineStore('leaderboard', {
  state: () => ({
    leaderboard: {
      easy: {},
      medium: {},
      hard: {},
      custom: {}
    }
  })


})