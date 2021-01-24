<template lang="pug">
#loading.loading
  .loader Loading...
  BgAnimation
</template>

<script>
export default {
  methods: {
    start() {
      document.getElementById('loading').classList.add('on')
    },
    finish() {
      document.getElementById('loading').classList.remove('on')
    },
  },
}
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: $black url('~assets/img/hogwarts.png');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: 100%;
  transition: 0.5s;
  z-index: 9999;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  &.on {
    opacity: 1;
  }
}

.loader,
.loader::before,
.loader::after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  animation: load7 1.8s infinite ease-in-out;
  animation-fill-mode: both;
}
.loader {
  color: $white;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  animation-delay: -0.16s;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &::after,
  &::before {
    content: '';
    position: absolute;
    top: 0;
  }
  &::before {
    left: -3.5em;
    animation-delay: -0.32s;
  }
  &::after {
    left: 3.5em;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
