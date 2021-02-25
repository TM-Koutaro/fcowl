<template lang="pug">
.animation
  #cherry-blossom.cherry-blossom
</template>

<script>
import { Vue } from 'nuxt-property-decorator'
export default class BgAnimation extends Vue {
  mounted() {
    /* eslint-disable */
    class Petal {
      constructor(config) {
        this.customClass = config.customClass || ''
        this.x = config.x || 0
        this.y = config.y || 0
        this.z = config.z || 0
        this.xSpeedVariation = config.xSpeedVariation || 0
        this.ySpeed = config.ySpeed || 0
        this.rotation = {
          axis: 'X',
          value: 0,
          speed: 0,
          x: 0,
        }
        if (config.rotation && typeof config.rotation === 'object') {
          this.rotation.axis = config.rotation.axis || this.rotation.axis
          this.rotation.value = config.rotation.value || this.rotation.value
          this.rotation.speed = config.rotation.speed || this.rotation.speed
          this.rotation.x = config.rotation.x || this.rotation.x
        }
        this.el = document.createElement('div')
        this.el.className = 'petal  ' + this.customClass
        this.el.style.position = 'absolute'
        this.el.style.backfaceVisibility = 'visible'
      }
    }
    class BlossomScene {
      constructor(config) {
        let container = document.getElementById(config.id)
        if (container === null) {
          throw new Error('[id] provided was not found in document')
        }
        this.container = container
        this.placeholder = document.createElement('div')
        this.petals = []
        this.numPetals = config.numPetals || 5
        this.petalsTypes = config.petalsTypes
        this.gravity = config.gravity || 0.8
        this.windMaxSpeed = config.windMaxSpeed || 4
        this.windMagnitude = 0.2
        this.windDuration = 0
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.timer = 0
        this.container.style.overflow = 'hidden'
        this.placeholder.style.transformStyle = 'preserve-3d'
        this.placeholder.style.width = this.container.offsetWidth + 'px'
        this.placeholder.style.height = this.container.offsetHeight + 'px'
        this.container.appendChild(this.placeholder)
        this.createPetals()
        requestAnimationFrame(this.updateFrame.bind(this))
      }
      /**
       * Reset the petal position when it goes out of container
       */
      resetPetal(petal) {
        petal.x = this.width * 2 - Math.random() * this.width * 1.75
        petal.y = petal.el.offsetHeight * -1
        petal.z = Math.random() * 200
        if (petal.x > this.width) {
          petal.x = this.width + petal.el.offsetWidth
          petal.y = (Math.random() * this.height) / 2
        }
        // Rotation
        petal.rotation.speed = Math.random() * 10
        let randomAxis = Math.random()
        if (randomAxis > 0.5) {
          petal.rotation.axis = 'X'
        } else if (randomAxis > 0.25) {
          petal.rotation.axis = 'Y'
          petal.rotation.x = Math.random() * 180 + 90
        } else {
          petal.rotation.axis = 'Z'
          petal.rotation.x = Math.random() * 360 - 180
          // looks weird if the rotation is too fast around this axis
          petal.rotation.speed = Math.random() * 3
        }
        // random speed
        petal.xSpeedVariation = Math.random() * 0.8 - 0.4
        petal.ySpeed = Math.random() + this.gravity
        return petal
      }
      /**
       * Calculate wind speed
       */
      calculateWindSpeed(t, y) {
        let a =
          ((this.windMagnitude / 2) * (this.height - (2 * y) / 3)) / this.height
        return (
          a *
            Math.sin(
              ((2 * Math.PI) / this.windDuration) * t + (3 * Math.PI) / 2
            ) +
          a
        )
      }
      /**
       * Update petal position
       */
      updatePetal(petal) {
        let petalWindSpeed = this.calculateWindSpeed(this.timer, petal.y)
        let xSpeed = petalWindSpeed + petal.xSpeedVariation
        petal.x -= xSpeed
        petal.y += petal.ySpeed
        petal.rotation.value += petal.rotation.speed
        let t =
          'translateX( ' +
          petal.x +
          'px ) translateY( ' +
          petal.y +
          'px ) translateZ( ' +
          petal.z +
          'px )  rotate' +
          petal.rotation.axis +
          '( ' +
          petal.rotation.value +
          'deg )'
        if (petal.rotation.axis !== 'X') {
          t += ' rotateX(' + petal.rotation.x + 'deg)'
        }
        petal.el.style.transform = t
        // reset if out of view
        if (petal.x < -10 || petal.y > this.height + 10) {
          this.resetPetal(petal)
        }
      }
      /**
       * Change the wind speed
       */
      updateWind() {
        // wind duration should be related to wind magnitude, e.g. higher windspeed means longer gust duration
        this.windMagnitude = Math.random() * this.windMaxSpeed
        this.windDuration = this.windMagnitude * 50 + (Math.random() * 20 - 10)
      }
      /**
       * Create the petals elements
       */
      createPetals() {
        for (let i = 0; i < this.numPetals; i++) {
          let tmpPetalType = this.petalsTypes[
            Math.floor(Math.random() * (this.petalsTypes.length - 1))
          ]
          let tmpPetal = new Petal({ customClass: tmpPetalType.customClass })
          this.resetPetal(tmpPetal)
          this.petals.push(tmpPetal)
          this.placeholder.appendChild(tmpPetal.el)
        }
      }
      /**
       * Update the animation frame
       */
      updateFrame() {
        if (this.timer === this.windDuration) {
          this.updateWind()
          this.timer = 0
        }
        let petalsLen = this.petals.length
        for (let i = 0; i < petalsLen; i++) {
          this.updatePetal(this.petals[i])
        }
        this.timer++
        requestAnimationFrame(this.updateFrame.bind(this))
      }
    }
    const petalsTypes = [
      new Petal({ customClass: 'petal-style1' }),
      new Petal({ customClass: 'petal-style2' }),
      new Petal({ customClass: 'petal-style3' }),
      new Petal({ customClass: 'petal-style4' }),
    ]
    const myBlossomSceneConfig = {
      id: 'cherry-blossom',
      petalsTypes,
    }
    const myBlossomScene = new BlossomScene(myBlossomSceneConfig)
    /* eslint-enable */
  }
}
</script>

<style lang="scss">
.animation {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(249, 217, 232, 1) 100%
  );
  z-index: -1;
}

@function random_range($min, $max) {
  $rand: random();
  $random_range: $min + floor($rand * (($max - $min) + 1));
  @return $random_range;
}

#cherry-blossom {
  position: relative;
  width: 100%;
  height: 100%;
}

.petal {
  background: url('~assets/img/cherry-blossom.png') no-repeat;

  &.petal-style1 {
    width: 45px;
    height: 20px;
    background-position: -31px 0;
  }
  &.petal-style2 {
    width: 42px;
    height: 22px;
    background-position: 0 -23px;
  }
  &.petal-style3 {
    width: 37px;
    height: 24px;
    background-position: 0 -50px;
  }
  &.petal-style4 {
    width: 26px;
    height: 34px;
    background-position: -49px -35px;
  }
}
</style>
