<template>
  <div id="app">
    <LoginComponent
        :show.sync="showLogin"
        :logo="logo"
        :app-name="appName"
        :error="error"
        :is-submitting.sync="isSubmitting"
        @submit="onSubmit"/>
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
      default: '/security_shield.png'
    },
    appName: {
      type: String,
      default: 'Your app name here'
    }
  },
  data () {
    return {
      showLogin: false,
      error: '',
      isSubmitting: false
    }
  },
  methods: {
    onSubmit ($event) {
      this.error = ''
      this.$emit('submit', $event)
    }
  },
  mounted () {
    setTimeout(function () { this.showLogin = true }.bind(this), 1000)
  }
}
</script>

<style lang="scss">

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
