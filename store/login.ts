import firebase from '@/plugins/firebase'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
const provider = new firebase.auth.TwitterAuthProvider()

type Status = {
  name: string | null
  photoURL: string | null
  uid: string | null
}
@Module({
  stateFactory: true,
})
export default class Login extends VuexModule {
  status: Status = {
    name: null,
    photoURL: null,
    uid: null,
  }

  get getStatus() {
    return this.status
  }

  @Mutation
  setStatus(data: Status) {
    this.status = data
  }

  @Action({ commit: 'setStatus' })
  twitterLoginCheck() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user)
      if (user) {
        console.log('Login')
        return {
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        }
      } else {
        console.log('Logout')
        return {
          name: null,
          photoURL: null,
          uid: null,
        }
      }
    })
  }

  @Action({ commit: 'setStatus' })
  twitterLogin() {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result)
        return {
          name: result.user!.displayName,
          photoURL: result.user!.photoURL,
          uid: result.user!.uid,
        }
      })
      .catch((e) => {
        window.alert(e)
      })
  }

  @Action({ commit: 'setStatus' })
  twitterLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.alert('ログアウトしました')
        return {
          name: null,
          photoURL: null,
          uid: null,
        }
      })
      .catch((e) => {
        window.alert(e)
      })
  }
}
