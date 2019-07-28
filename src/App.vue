<template>
  <div id="app">
    <LoginComponent :show.sync="showLogin" :logo="logo" :app-name="appName"/>
  </div>
</template>

<script>
import LoginComponent from './components/LoginComponent.vue'

export default {
  name: 'app',
  components: {
    LoginComponent
  },
  data () {
    return {
      showLogin: false,
      logo: 'https://twoseven.xyz/img/icons/android-chrome-512x512.png',
      appName: 'TwoSeven',
      forgotEmailInput: ''
    }
  },
  mounted () {
    setTimeout(function () { this.showLogin = true }.bind(this), 1000)
  }
}
</script>

<style lang="scss">
@import '~@/style/bulma-imports.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
