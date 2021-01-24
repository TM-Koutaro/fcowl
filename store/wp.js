export default {
  state() {
    return {
      wp: false,
    }
  },
  getters: {
    get_wp: (state) => () => {
      return state.wp
    },
  },
  mutations: {
    set_wp(state, data) {
      state.wp = data
    },
  },
}
