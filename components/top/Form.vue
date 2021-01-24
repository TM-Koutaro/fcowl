<template lang="pug">
.form(ref="form")
  .form__contact
    form(name='contact', method='POST', data-netlify-recaptcha='true', netlify)
      h2 体験入団フォーム！
      input(type='hidden', name='form-name', value='contact')
      p
        label
          | キャラクター名:
          input(type='text', v-model='form.name', name='name', required)
      p
        label
          | Inしてる曜日/時間帯:
          input(type='text', v-model='form.time', name='time', required)
      p
        label
          | メッセージ (もしあれば)
          textarea(name='message', v-model='form.content')
      p.at
        | ゲーム内でのご連絡まで2~3日かかります。
        br
        | 下記認証にチェックを入れないと送信されません。
      .validate(data-netlify-recaptcha='true')
      button.send(type='submit') 
        | 体験を申し込む
    .close(@click='closePopup()')
      | 閉じる
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        time: '',
        content: '',
      },
    }
  },
  methods: {
    closePopup() {
      this.$refs.form.style.opacity = ''
      this.$refs.form.style.zIndex = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.form {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: scroll;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0;
  z-index: -1;
  text-align: center;
  &__contact {
    width: 600px;
    color: $white;
    z-index: 10;
    padding: 50px 10px;
    margin: 0 auto;
    h2 {
      font-size: 3rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 40px;
      background: linear-gradient(
        23deg,
        #28e3b3,
        #2892e3,
        #7b28e3,
        #e3286c,
        #28e3d9,
        #e3dc28,
        #28e355,
        #e3a228
      );
      background-size: 1600% 1600%;
      animation: AnimationName 30s ease infinite;
      background-clip: text;
    }
    p {
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      &.at {
        display: block;
        color: $red;
        border: 1px solid $red;
        border-radius: 5px;
        font-size: 1.2rem;
        line-height: 1.5;
        text-align: center;
        font-weight: bold;
        padding: 10px 0;
      }
      & ~ p {
        margin-top: 25px;
      }
      input {
        height: 40px;
        width: 250px;
        padding: 5px;
        box-sizing: border-box;
        margin-left: 20px;
      }
      label {
        width: 100%;
        text-align: left;
      }
      textarea {
        display: block;
        max-width: 100%;
        min-width: 100%;
        max-height: 200px;
        min-height: 200px;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
        margin-top: 10px;
      }
    }
    .validate {
      width: 300px;
      margin: 20px auto 0;
    }
    .close,
    button {
      width: 200px;
      height: 50px;
      line-height: 50px;
      font-size: 1rem;
      margin: 30px auto 0;
      color: $black;
      text-align: center;
      display: block;
      background: $white;
      border-radius: 5px;
      &.send {
        margin-top: 40px;
      }
    }
  }
  @include mq-down(md) {
    &__contact {
      width: 100%;
      box-sizing: border-box;
      padding: 30px 10px;
      h2 {
        font-size: 2rem;
        margin-bottom: 20px;
      }
      p {
        font-size: 1rem;
        & ~ p {
          margin-top: 15px;
        }
        &.at {
          font-size: 0.8rem;
        }
        input,
        textarea {
          margin: 10px 0 0;
        }
        input {
          width: 100%;
        }
        textarea {
          max-height: 100px;
          min-height: 100px;
        }
      }
      .close,
      button {
        width: 50%;
        height: 40px;
        line-height: 38px;
        font-size: 1rem;
        margin: 20px auto 0;
        &.send {
          margin-top: 20px;
        }
      }
    }
  }
}
@keyframes AnimationName {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
