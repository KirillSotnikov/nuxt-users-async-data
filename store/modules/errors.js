export default {
  state () {
    return {
      errors: []
    }
  },
  mutations: {
    addError (state, payload) {
      state.errors = [...state.errors, ...payload]
    }
  },
  actions: {
    addError ({ commit }, payload) {
      commit('addError', payload)
    }
  },
  getters: {
    getErrors (state) {
      return state.errors
    }
  }
}
