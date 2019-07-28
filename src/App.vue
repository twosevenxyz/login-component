<template>
  <div id="app">
    <LoginComponent :show.sync="showLogin" :logo="logo" :app-name="appName" @submit="$emit('submit', $event)"/>
  </div>
</template>

<script>
import LoginComponent from './components/LoginComponent.vue'

export default {
  name: 'app',
  components: {
    LoginComponent
  },
  props: {
    logo: {
      type: String,
      default: 'https://twoseven.xyz/img/icons/android-chrome-512x512.png'
    },
    appName: {
      type: String,
      default: 'TwoSeven'
    }
  },
  data () {
    return {
      showLogin: false
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
