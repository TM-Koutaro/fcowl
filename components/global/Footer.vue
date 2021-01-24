<template lang="pug">
footer
  p.copyright Copyright SQUARE ENIX CO., LTD. All Rights Reserved.
  p.copyright Copyright 2021 Order Of The Owl.
</template>

<style lang="scss" scoped>
footer {
  padding: 0 10px;
  margin: 80px 0 0;
  padding-bottom: 75px;
  font-weight: bold;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  font-size: 1rem;
  color: $white;
  .app-notify {
    width: 700px;
    margin: 0 auto;
    dt {
      font-size: 3rem;
      font-weight: bold;
      text-align: center;
      color: $gold;
      img {
        display: block;
        width: 150px;
        border-radius: 10px;
        margin: 20px auto 0;
        border: 5px solid $gold;
      }
      span {
        margin-left: 12px;
      }
    }
    dd {
      font-size: 1rem;
      line-height: 1.5;
      margin-top: 20px;
      position: relative;
      width: 100%;
      background: $gold;
      color: $white;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 10px;
      &::before {
        content: '';
        position: absolute;
        top: -24px;
        left: 50%;
        margin-left: -15px;
        border: 12px solid transparent;
        border-bottom: 12px solid $gold;
        z-index: 2;
      }
      &::after {
        content: '';
        position: absolute;
        top: -24px;
        left: 50%;
        margin-left: -15px;
        border: 12px solid transparent;
        border-bottom: 12px solid $gold;
        z-index: 2;
      }
    }
  }
  .icons {
    margin-top: 30px;
    dt {
      text-align: center;
      font-size: 1rem;
      line-height: 1.5;
    }
    dd {
      max-width: 280px;
      margin: 20px auto 0;
      ul {
        display: flex;
        justify-content: space-between;
        a {
          display: block;
          width: 40px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .copyright {
    font-size: 0.8rem;
    line-height: 1.5;
    text-align: center;
    margin-top: 40px;
    & ~ .copyright {
      margin-top: 10px;
    }
  }

  @include mq-down(md) {
    margin: 15vw 0 0;
    padding-bottom: 35px;
    .app-notify {
      width: 90%;
      dt {
        font-size: get_vw(30);
        img {
          border: 3px solid $gold;
        }
        span {
          display: block;
          margin: 7px 0 0 0;
        }
      }
      dd {
        font-size: get_vw(10);
      }
    }
    .icons {
      dt {
        font-size: get_vw(10);
        span {
          display: block;
        }
      }
    }
  }
}
</style>
