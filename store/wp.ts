import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module
export default class Wp extends VuexModule {
  wp = false

  get getWp() {
    return this.wp
  }

  @Mutation
  setWp(data: boolean) {
    this.wp = data
  }
}
