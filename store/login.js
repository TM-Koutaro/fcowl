import firebase from '@/plugins/firebase'
const provider = new firebase.auth.TwitterAuthProvider()

export default {
  state() {
    return {
      status: false,
    }
  },
  getters: {
    get_status: (state) => () => {
      return state.status
    },
  },
  mutations: {
    set_status(state, data) {
      state.status = data
    },
  },
  actions: {
    twitterLoginCheck({ commit }) {
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user)
        if (user) {
          console.log('Login')
          commit('set_status', {
            name: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
          })
        } else {
          console.log('Logout')
          commit('set_status', false)
        }
      })
    },
    twitterLogin({ commit }) {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          console.log(result)
          commit('set_status', {
            name: result.user.displayName,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
          })
        })
        .catch((e) => {
          window.alert(e)
        })
    },
    twitterLogout({ commit }, data) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.alert('ログアウトしました')
          commit('set_status', false)
        })
        .catch((e) => {
          window.alert(e)
        })
    },
  },
}
