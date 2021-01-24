import firebase from '@/plugins/firebase'
import s3 from '@/plugins/aws'

const db = firebase.firestore()

export default {
  state() {
    return {
      path: '',
      AllDatePhotos: [],
      AllPhotos: [],
      thisMonthAlbumPhoto: '',
      thisMonthAlbumOtherPhotos: '',
      thisMonthAlbum: '',
      deletePhoto: '',
    }
  },
  getters: {
    get_path: (state) => () => {
      return state.path
    },
    get_AllDatePhotos: (state) => () => {
      return state.AllDatePhotos
    },
    get_AllPhotos: (state) => () => {
      return state.AllPhotos
    },
    get_thisMonthAlbumPhoto: (state) => () => {
      return state.thisMonthAlbumPhoto
    },
    get_thisMonthAlbumOtherPhotos: (state) => () => {
      return state.thisMonthAlbumOtherPhotos
    },
    get_thisMonthAlbum: (state) => () => {
      return state.thisMonthAlbum
    },
    deletePhoto: (state) => () => {
      return state.deletePhoto
    },
  },
  mutations: {
    set_path(state, data) {
      state.path = data
    },
    set_AllDatePhotos(state, data) {
      const compare = (a, b) => b[0] - a[0]
      state.AllDatePhotos.push(data)
      state.AllDatePhotos.sort(compare)
    },
    clear_AllDatePhotos(state) {
      state.AllDatePhotos = []
    },
    set_AllPhotos(state, data) {
      state.AllPhotos.push(data)
    },
    set_thisMonthAlbumPhoto(state, data) {
      state.thisMonthAlbumPhoto = data
    },
    set_thisMonthAlbumOtherPhotos(state, data) {
      state.thisMonthAlbumOtherPhotos = data
    },
    set_thisMonthAlbum(state, data) {
      state.thisMonthAlbum = data
    },
    set_deletePhoto(state, data) {
      state.deletePhoto = data
    },
  },
  actions: {
    async AllPhotos({ commit }, data) {
      console.log('AllPhotos')
      const docUsers = db.collection(`owl/${data.year}/${data.month}/`)
      const _thisMonthAlbumOtherPhotos = []
      const _thisMonthAlbum = []
      let _thisMonthAlbumPhoto = ''
      await docUsers
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const picData = doc.data()
            picData.id = doc.id
            if (data.id) {
              // アルバムページの場合
              picData.uid = doc.id
              if (doc.id !== data.id) {
                _thisMonthAlbumOtherPhotos.push(picData)
              } else {
                _thisMonthAlbumPhoto = picData
              }
            }
            _thisMonthAlbum.push(picData)
          })
        })
        .catch((e) => {
          throw e
        })
      if (data.id) {
        // アルバムページの場合
        commit(
          'set_path',
          `album/?id=${data.id}&year=${data.year}&month=${data.month}`
        )
        commit('set_thisMonthAlbumPhoto', _thisMonthAlbumPhoto)
        commit('set_thisMonthAlbumOtherPhotos', _thisMonthAlbumOtherPhotos)
        commit('set_thisMonthAlbum', _thisMonthAlbum)
      } else {
        // トップの場合
        commit('set_thisMonthAlbum', _thisMonthAlbum)
        commit('set_AllPhotos', _thisMonthAlbum)
      }
    },
    AllDatePhotos({ commit }) {
      return new Promise((resolve) => {
        console.log('AllDatePhotos')
        commit('clear_AllDatePhotos')
        const docUsers = db.collection('owl')
        docUsers.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const compare = (a, b) => Number(b) - Number(a)
            commit('set_AllDatePhotos', [
              doc.id,
              Object.keys(doc.data()).sort(compare),
            ])
            resolve()
          })
        })
      })
    },
    replacealbums({ commit, state }, data) {
      console.log('thisMonthAlbum')
      const _thisMonthAlbumOtherPhotos = []
      let _thisMonthAlbumPhoto = ''
      state.thisMonthAlbum.forEach((doc) => {
        if (doc.id !== data.id) {
          _thisMonthAlbumOtherPhotos.push(doc)
        } else {
          _thisMonthAlbumPhoto = doc
        }
      })
      commit(
        'set_path',
        `album/?id=${data.id}&year=${data.year}&month=${data.month}`
      )
      commit('set_thisMonthAlbumPhoto', _thisMonthAlbumPhoto)
      commit('set_thisMonthAlbumOtherPhotos', _thisMonthAlbumOtherPhotos)
    },
    addPhoto({ commit }, data) {
      return new Promise((resolve) => {
        console.log('addPhoto')
        const rootName = db.collection(`owl`).doc(String(data.year))
        rootName
          .set({ [data.month]: true }, { merge: true })
          .then((ref) => {
            const dbUsers = db.collection(`owl/${data.year}/${data.month}`)
            s3.putObject(
              {
                Bucket: process.env.AWS_S3_BUCKETNAME,
                Key: data.fileName,
                Body: data.imgSrc,
                ACL: 'public-read',
              },
              (err) => {
                if (err) {
                  window.alert('画像アップロード中にエラーが発生しました')
                } else {
                  dbUsers
                    .add({
                      imgSrc: data.downloadURL,
                      message: data.message,
                      name: data.name,
                      uid: data.uid,
                      postMonth: `${data.year}/${data.month}`,
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((ref) => {
                      window.alert('アップロード作業完了しました')
                      resolve()
                    })
                    .catch((e) => {
                      window.alert('DB更新エラーが発生しました')
                      resolve()
                    })
                }
              }
            )
          })
          .catch((e) => {
            window.alert('認証されてないユーザーからの投稿です')
            resolve()
          })
      })
    },
    deleteDB({ commit, state }, data) {
      return new Promise((resolve) => {
        console.log('deleteDB')
        const imgName = state.thisMonthAlbumPhoto.imgSrc.substr(
          state.thisMonthAlbumPhoto.imgSrc.lastIndexOf('/') + 1
        )
        const fileName = `${data.year}/${data.month}/${imgName}`
        db.collection(`owl/${data.year}/${data.month}`)
          .doc(data.id)
          .delete()
          .then(() => {
            if (state.thisMonthAlbumOtherPhotos.length === 0) {
              db.collection(`owl`)
                .doc(data.year)
                .update({
                  [data.month]: firebase.firestore.FieldValue.delete(),
                })
                .then(() => {
                  commit('set_deletePhoto', fileName)
                  resolve()
                })
                .catch((e) => {
                  console.log(e)
                  window.alert('削除中にエラーが発生しました')
                  location.href = '/'
                })
            } else {
              commit('set_deletePhoto', fileName)
              resolve()
            }
          })
          .catch((e) => {
            console.log(e)
            window.alert('認証されてないユーザーからの削除です')
            document.getElementById('loading').classList.remove('on')
          })
      })
    },
    deletePhoto({ state }) {
      return new Promise((resolve) => {
        console.log('deletePhoto')
        s3.deleteObject(
          {
            Bucket: process.env.AWS_S3_BUCKETNAME,
            Key: state.deletePhoto,
          },
          function (err) {
            console.log(err)
            resolve()
          }
        )
      })
    },
  },
}
