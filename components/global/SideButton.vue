<template lang="pug">
div
  template(v-if='isAlbum')
    .delete(ref='delete')
      .delete__bg
        dl.delete__contents
          dt 認証されたユーザーのみ
            span ログインを行って削除出来ます。
          dd
            button(@click='jsDeleteSend') 削除
            button(@click='jsDeleteToggle') 閉じる
    .icon(@click='jsDeleteToggle')
      Delete
    .icon.twitter
      a(
        :href='`https://twitter.com/intent/tweet?text=${message}%20%7C%20Order%20Of%20The%20OWL&url=${url}`',
        target='_blank'
      )
        Twitter
  template(v-else)
    PostPopup
    .icon.twitter
      a(
        :href='`https://twitter.com/intent/tweet?text=Order Of The Owl&url=${url}`',
        target='_blank'
      )
        Twitter
    .icon.write(@click='jsPopupToggle')
      Pen
</template>

<script>
import PostPopup from '~/components/sidebutton/PostPopup.vue'

export default {
  components: {
    PostPopup,
  },
  props: {
    isAlbum: {
      default: false,
      type: Boolean,
    },
    message: {
      default: '',
      type: String,
    },
    url: {
      default: '',
      type: String,
    },
  },
  methods: {
    jsDeleteSend() {
      if (window.confirm('本当に削除しますか？')) {
        this.jsDeleteToggle()
        document.getElementById('loading').classList.add('on')
        this.$store
          .dispatch('album/deleteDB', {
            id: this.$route.query.id,
            year: this.$route.query.year,
            month: this.$route.query.month,
          })
          .then(() => {
            this.$store.dispatch('album/deletePhoto').then(() => {
              window.alert('削除が完了しました')
              location.href = '/'
            })
          })
      }
    },
    jsDeleteToggle() {
      if (this.$refs.delete.classList.contains('on')) {
        this.$refs.delete.classList.remove('on')
      } else {
        this.$refs.delete.classList.add('on')
      }
    },
    jsPopupToggle() {
      if (document.getElementById('popup').classList.contains('on')) {
        document.getElementById('popup').classList.remove('on')
      } else {
        document.getElementById('popup').classList.add('on')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.delete {
  display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  &.on {
    display: block;
  }
  &__bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 0;
  }
  &__contents {
    width: 600px;
    height: 250px;
    position: absolute;
    z-index: 10;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    dt {
      width: 100%;
      color: $red;
      border: 1px solid $red;
      border-radius: 5px;
      font-size: 1.2rem;
      text-align: center;
      font-weight: bold;
      padding: 10px;
      box-sizing: border-box;
    }
    dd {
      width: 100%;
      button {
        display: block;
        width: 180px;
        font-size: 1rem;
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        background: $white;
        margin: 40px auto 0;
      }
    }
  }
  @include mq-down(md) {
    &__contents {
      width: 90%;
      dt {
        width: 100%;
        font-size: 1rem;
        line-height: 1.5;
        span {
          display: block;
        }
      }
    }
  }
}
.icon {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  right: 20px;
  bottom: 120px;
  z-index: 20;
  overflow: hidden;
  transition: 0.5s;
  background: $white;
  &:hover {
    width: 70px;
    height: 70px;
    cursor: pointer;
    animation: none;
  }
  &.twitter {
    background: $twitter_color;
    box-shadow: 0 0 0 0 rgba($twitter_color, 0.5);
    bottom: 30px;
    svg {
      fill: $white;
    }
    &-article {
      bottom: 20px;
    }
  }
  svg {
    width: 60%;
    height: 60%;
    fill: $black;
    display: inline-block;
    vertical-align: middle;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: absolute;
    margin: auto;
  }

  @include mq-down(md) {
    width: get_vw(40);
    height: get_vw(40);
    right: 10px;
    bottom: get_vw(80);
    &.twitter {
      bottom: get_vw(20);
    }
  }
}
</style>
