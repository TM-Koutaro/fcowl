import firebase from '@/plugins/firebase'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
const provider = new firebase.auth.TwitterAuthProvider()

type Status = {
  name: string | undefined
  photoURL: string | undefined
  uid: string | undefined
}
@Module({
  stateFactory: true
})
export default class Login extends VuexModule {
  status: Status = {
    name: undefined,
    photoURL: undefined,
    uid: undefined
  }

  get getStatus() {
    return this.status
  }

  @Mutation
  setStatus(data: Status) {
    console.log('setStatus', data)
    this.status = data
  }

  @Action
  twitterLoginCheck() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user)
      if (user) {
        console.log('Login')
        this.context.commit('setStatus', {
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid
        })
      } else {
        console.log('Logout')
        this.context.commit('setStatus', {
          name: undefined,
          photoURL: undefined,
          uid: undefined
        })
      }
    })
  }

  @Action
  twitterLogin() {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result)
        this.context.commit('setStatus', {
          name: result.user!.displayName,
          photoURL: result.user!.photoURL,
          uid: result.user!.uid
        })
      })
      .catch((e) => {
        window.alert(e)
      })
  }

  @Action
  twitterLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.alert('ログアウトしました')
        this.context.commit('setStatus', {
          name: undefined,
          photoURL: undefined,
          uid: undefined
        })
      })
      .catch((e) => {
        window.alert(e)
      })
  }
}
