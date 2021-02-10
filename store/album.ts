import firebase from '@/plugins/firebase'
import s3 from '@/plugins/aws'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

const db = firebase.firestore()

@Module({
  stateFactory: true
})
export default class Album extends VuexModule {
  path: string = ''
  allDatePhotos: number[] = []
  allPhotos: string[] = []
  monthAlbumPhotos: { [index: string]: string } = {}
  monthAlbumOtherPhotos: string = ''
  monthAlbum: string[] = []
  photo: string = ''

  get getPath() {
    return this.path
  }

  get getAllDatePhotos() {
    return this.allDatePhotos
  }

  get getAllPhotos() {
    return this.allPhotos
  }

  get getMonthAlbumPhoto() {
    return this.monthAlbumPhotos
  }

  get getMonthAlbumOtherPhotos() {
    return this.monthAlbumOtherPhotos
  }

  // get getMonthAlbum() {
  //   return this.monthAlbum
  // }
  get getDeletePhoto() {
    return this.photo
  }

  @Mutation
  setPath(data: string) {
    this.path = data
  }

  @Mutation
  setAllDatePhotos(data: number) {
    const compare = (a: any, b: any): number => b[0] - a[0]
    this.allDatePhotos.push(data)
    this.allDatePhotos.sort(compare)
  }

  @Mutation
  clearAllDatePhotos() {
    this.allDatePhotos = []
  }

  @Mutation
  setAllPhotos(data: string) {
    this.allPhotos.push(data)
  }

  @Mutation
  setMonthAlbumPhoto(data: {}) {
    this.monthAlbumPhotos = data
  }

  @Mutation
  setMonthAlbumOtherPhotos(data: string) {
    this.monthAlbumOtherPhotos = data
  }

  @Mutation
  setMonthAlbum(data: string) {
    this.monthAlbum.push(data)
  }

  @Mutation
  setDeletePhoto(data: string) {
    this.photo = data
  }

  @Action
  async addAllPhotos(data: { year: string; month: string; id: string }) {
    console.log('AllPhotos')
    const docUsers = db.collection(`owl/${data.year}/${data.month}/`)
    const _monthAlbumOtherPhotos: string[] = []
    const _monthAlbum: string[] = []
    let _monthAlbumPhoto: string = ''
    await docUsers
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const picData: any = doc.data()
          picData.id = doc.id
          if (data.id) {
            // アルバムページの場合
            picData.uid = doc.id
            if (doc.id !== data.id) {
              _monthAlbumOtherPhotos.push(picData)
            } else {
              _monthAlbumPhoto = picData
            }
          }
          _monthAlbum.push(picData)
        })
      })
      .catch((e) => {
        throw e
      })
    if (data.id) {
      // アルバムページの場合
      this.context.commit(
        'setPath',
        `album/?id=${data.id}&year=${data.year}&month=${data.month}`
      )
      this.context.commit('setMonthAlbumPhoto', _monthAlbumPhoto)
      this.context.commit('setMonthAlbumOtherPhotos', _monthAlbumOtherPhotos)
      this.context.commit('setMonthAlbum', _monthAlbum)
    } else {
      // トップの場合
      this.context.commit('setMonthAlbum', _monthAlbum)
      this.context.commit('setAllPhotos', _monthAlbum)
    }
  }

  @Action
  addAllDatePhotos() {
    return new Promise((resolve: (value: void) => void) => {
      console.log('AllDatePhotos')
      this.context.commit('clearAllDatePhotos')
      const docUsers = db.collection('owl')
      docUsers.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const compare = (a: any, b: any) => Number(b) - Number(a)
          this.context.commit('setAllDatePhotos', [
            doc.id,
            Object.keys(doc.data()).sort(compare)
          ])
          resolve()
        })
      })
    })
  }

  @Action
  replacealbums(data: { id: string; year: string; month: string }) {
    console.log('thisMonthAlbum')
    const _monthAlbumOtherPhotos: string[] = []
    let _monthAlbumPhoto: string = ''
    this.monthAlbum.forEach((doc: any) => {
      if (doc.id !== data.id) {
        _monthAlbumOtherPhotos.push(doc)
      } else {
        _monthAlbumPhoto = doc
      }
    })
    this.context.commit(
      'setPath',
      `album/?id=${data.id}&year=${data.year}&month=${data.month}`
    )
    this.context.commit('setMonthAlbumPhoto', _monthAlbumPhoto)
    this.context.commit('setMonthAlbumOtherPhotos', _monthAlbumOtherPhotos)
  }

  @Action
  addPhoto(data: {
    month: string
    year: string
    downloadURL: string
    message: string
    name: string
    uid: string
    fileName: string
    imgSrc: string
  }) {
    return new Promise((resolve: (value: void) => void) => {
      console.log('addPhoto')
      const rootName = db.collection('owl').doc(String(data.year))
      rootName
        .set({ [data.month]: true }, { merge: true })
        .then(() => {
          const dbUsers = db.collection(`owl/${data.year}/${data.month}`)
          s3.putObject(
            {
              Bucket: <string>process.env.AWS_S3_BUCKETNAME,
              Key: data.fileName,
              Body: data.imgSrc,
              ACL: 'public-read'
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
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  })
                  .then(() => {
                    window.alert('アップロード作業完了しました')
                    resolve()
                  })
                  .catch(() => {
                    window.alert('DB更新エラーが発生しました')
                    resolve()
                  })
              }
            }
          )
        })
        .catch(() => {
          window.alert('認証されてないユーザーからの投稿です')
          resolve()
        })
    })
  }

  @Action
  deleteDB(data: { year: string; month: string; id: string }) {
    return new Promise((resolve: (value: void) => void) => {
      console.log('deleteDB')
      const imgName = this.monthAlbumPhotos.imgSrc.substr(
        this.monthAlbumPhotos.imgSrc.lastIndexOf('/') + 1
      )
      const fileName = `${data.year}/${data.month}/${imgName}`
      db.collection(`owl/${data.year}/${data.month}`)
        .doc(data.id)
        .delete()
        .then(() => {
          if (this.monthAlbumOtherPhotos.length === 0) {
            db.collection('owl')
              .doc(data.year)
              .update({
                [data.month]: firebase.firestore.FieldValue.delete()
              })
              .then(() => {
                this.context.commit('setDeletePhoto', fileName)
                resolve()
              })
              .catch((e) => {
                console.log(e)
                window.alert('削除中にエラーが発生しました')
                location.href = '/'
              })
          } else {
            this.context.commit('setDeletePhoto', fileName)
            resolve()
          }
        })
        .catch((e) => {
          console.log(e)
          window.alert('認証されてないユーザーからの削除です')
          document.getElementById('loading')!.classList.remove('on')
        })
    })
  }

  @Action
  deletePhoto() {
    return new Promise((resolve: (value: void) => void) => {
      console.log('deletePhoto')
      s3.deleteObject(
        {
          Bucket: <string>process.env.AWS_S3_BUCKETNAME,
          Key: this.photo
        },
        function (err) {
          console.log(err)
          resolve()
        }
      )
    })
  }
}