<template lang="pug">
#popup.popup(ref='popup')
  .popup__contents
    .popup__input(
      ref='popup__input',
      @dragover.prevent='dragEnter',
      @dragenter.prevent='dragEnter',
      @dragleave.prevent='dragLeave',
      @dragend.prevent='dragLeave',
      @drop.prevent='drop'
    )
      drag
      label(for='file')
        input.popup__file(
          ref='popup__file',
          type='file',
          namee='onFileChange',
          @change='onFileChange',
          accept='image/*'
        )
        strong 画像を選択するか
        | ここにドラッグして下さい
        p アップロードする画像サイズは、20MB以下でお願いします
        p.popup__addText(v-show='user.imgSrc') 「{{ user.imgSrc.name }}」を添付済みです
    ul.popup__key
      li
        span 掲載日 :
        DatePicker(type='month', v-model='user.yearMonth', :editable='false')
    textarea(
      maxlength='140',
      placeholder='写真にコメントを書いてみよう♪(文字数制限140文字以内)',
      v-model='user.message'
    )
    p.popup__at
      | 認証されたユーザーのみ、
      span ログインを行って投稿が出来ます。
    p.popup__button
      button(type='button', @click='submit') 投稿する
      button(type='button', @click='close') 閉じる
  .popup__bg(@click='jsPopupToggle')
</template>

<script>
import { mapGetters } from 'vuex'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  components: { DatePicker },
  data() {
    return {
      user: {
        imgSrc: '',
        yearMonth: '',
        message: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      get_status: 'login/get_status',
    }),
  },
  methods: {
    popupClose() {
      this.user.imgSrc = ''
      this.user.yearMonth = ''
      this.user.message = ''
      location.reload()
    },
    dragEnter(e) {
      if (!this.$refs.popup__input.classList.contains('mouseOn')) {
        this.$refs.popup__input.classList.add('mouseOn')
      }
    },
    dragLeave(e) {
      if (this.$refs.popup__input.classList.contains('mouseOn')) {
        this.$refs.popup__input.classList.remove('mouseOn')
      }
    },
    base64toBlob(base64) {
      const tmp = base64.split(',')
      const data = atob(tmp[1])
      const mime = tmp[0].split(':')[1].split(';')[0]
      const buf = new Uint8Array(data.length)
      for (let i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i)
      }
      const blob = new Blob([buf], { type: mime })
      return blob
    },
    formatImage(file) {
      console.log(file[0])
      const validImageTypes = [
        'image/gif',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ]
      if (file[0].size <= 20000000) {
        if (validImageTypes.includes(file[0].type)) {
          // 画像リサイズ処理
          document.getElementById('loading').classList.add('on')
          const fileReader = new FileReader()
          fileReader.onload = (event) => {
            const image = new Image()
            image.onload = () => {
              const canvas = document.createElement('canvas')
              const context = canvas.getContext('2d')
              // 横幅を 1000px に合わせてリサイズ
              canvas.width = 1000
              canvas.height = image.height * (canvas.width / image.width)
              context.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                0,
                0,
                canvas.width,
                canvas.height
              )
              // base64に変換し input に再代入と imgSrc にも登録
              const base64 = canvas.toDataURL('image/jpeg')
              this.$refs.popup__file = this.base64toBlob(base64)
              this.$refs.popup__file.name = file[0].name
              this.user.imgSrc = this.$refs.popup__file
              document.getElementById('loading').classList.remove('on')
            }
            image.src = event.target.result
          }
          fileReader.readAsDataURL(file[0])
        } else {
          window.alert('画像のみ添付できます')
        }
        if (this.$refs.popup__input.classList.contains('mouseOn')) {
          this.$refs.popup__input.classList.remove('mouseOn')
        }
      } else {
        window.alert('画像のファイルサイズが大きすぎます')
      }
    },
    drop(e) {
      const file = e.dataTransfer.files
      this.formatImage(file)
    },
    jsPopupToggle() {
      if (this.$refs.popup.classList.contains('on')) {
        this.$refs.popup.classList.remove('on')
      } else {
        this.$refs.popup.classList.add('on')
      }
    },
    onFileChange(e) {
      const file = e.target.files
      this.formatImage(file)
    },
    submit() {
      console.log(this.user.imgSrc)
      if (window.confirm('投稿しますか？')) {
        if (this.user.imgSrc === '') window.alert('画像が添付されておりません')
        else if (this.user.yearMonth === '' || this.user.yearMonth === null)
          window.alert('掲載日が指定されておりません')
        else if (this.user.message === '')
          window.alert('メッセージ内容が入力されておりません')
        else {
          document.getElementById('loading').classList.add('on')
          const month = new Date(this.user.yearMonth).getMonth() + 1
          const year = new Date(this.user.yearMonth).getFullYear()
          const fileId = Math.floor(Math.random() * 999)
          const fileName = `${year}/${month}/owl_${fileId}_${this.user.imgSrc.name}`
          const downloadURL =
            'https://d15reupfu87sxr.cloudfront.net/' + fileName
          this.$store
            .dispatch('album/addPhoto', {
              month,
              year,
              fileName,
              downloadURL,
              imgSrc: this.user.imgSrc,
              message: this.user.message,
              name: this.get_status().name,
              uid: this.get_status().uid,
            })
            .then(() => {
              this.popupClose()
            })
        }
      }
    },
    close() {
      this.$refs.popup.classList.remove('on')
    },
  },
}
</script>

<style lang="scss" scoped>
.popup {
  display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  &.on {
    display: block;
  }
  &__bg {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 0;
  }
  &__contents {
    max-width: 650px;
    max-height: 650px;
    overflow-y: scroll;
    background: $white;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    padding: 30px 20px;
    box-sizing: border-box;
    z-index: 10;
    input {
      width: 170px;
      height: 30px;
      font-size: 0.9rem;
      padding: 10px;
      box-sizing: border-box;
    }
  }
  &__input {
    font-size: 1rem;
    line-height: 1.5;
    background-color: $light_gray;
    outline: 2px dashed $light_blue;
    outline-offset: -10px;
    position: relative;
    transition: 0.5s;
    padding: 100px 20px;
    text-align: center;
    &.mouseOn {
      background: $white;
    }
    svg {
      width: 60px;
    }
    label {
      display: block;
      position: relative;
      margin-top: 20px;
      input {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        text-align: center;
        z-index: 10;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  &__addText {
    margin-top: 20px;
  }
  &__key {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    li {
      display: flex;
      list-style: none;
      align-items: center;
      font-size: 0.9rem;
      span {
        padding-right: 10px;
      }
      svg {
        width: 20px;
        vertical-align: middle;
      }
    }
  }
  textarea {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    height: 100px;
    min-height: 100px;
    max-height: 100px;
    font-size: 1rem;
    line-height: 1.5;
    margin-top: 20px;
    padding: 10px;
    box-sizing: border-box;
  }
  &__at {
    color: $red;
    border: 1px solid $red;
    border-radius: 5px;
    font-size: 1.2rem;
    text-align: center;
    font-weight: bold;
    padding: 10px 0;
    margin-top: 40px;
  }
  &__button {
    text-align: center;
    margin-top: 40px;
    button {
      display: block;
      width: 180px;
      height: 45px;
      font-size: 1rem;
      color: $black;
      position: relative;
      text-decoration: none;
      text-transform: uppercase;
      border: 0 solid;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0);
      outline: 1px solid;
      outline-color: rgba(0, 0, 0, 0.5);
      outline-offset: 0;
      text-shadow: none;
      transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
      background: none;
      margin: 0 auto;
      & ~ button {
        margin-top: 30px;
      }
      &:hover {
        cursor: pointer;
        border: 1px solid;
        outline-color: rgba(0, 0, 0, 0);
        outline-offset: 15px;
      }
    }
  }
  @include mq-down(md) {
    &__at {
      font-size: 0.8rem;
      line-height: 1.5;
      span {
        display: block;
      }
    }
    &__key {
      display: block;
      li {
        display: block;
        width: 100%;
        & ~ li {
          margin-top: 20px;
        }
        span {
          display: block;
          width: 100%;
          padding-right: 0;
        }
        > div,
        > input {
          width: 100%;
          margin-top: 10px;
          input {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
