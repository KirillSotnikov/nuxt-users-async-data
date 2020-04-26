export default {
  state () {
    return {
      users: []
    }
  },
  mutations: {
    fetchUsers (state, payload) {
      state.users = [...state.users, ...payload]
    }
  },
  actions: {
    async fetchUsers ({ commit }, payload) {
      const { page, rowsPerPage, gender } = payload

      const genderRequest = gender !== 'any' ? `&gender=${gender}` : ''
      const { data } = await this.$axios.get(`https://randomuser.me/api/?page=${page}&results=${rowsPerPage}${genderRequest}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      })
      commit('fetchUsers', data.results)
    }
  },
  getters: {
    getUsers (state) {
      return state.users
    }
  }
}
