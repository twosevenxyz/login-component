<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import LoginComponent from './components/LoginComponent.vue'

const props = withDefaults(defineProps<{
  logo?: string,
  appName?: string
}>(), {
  logo: '/security_shield.png',
  appName: 'Your app name here'
})

const showLogin = ref<boolean>(false)
const error = ref<string>('')
const isSubmitting = ref<boolean>(false)
const initialized = ref<boolean>(false)
defineExpose({
  showLogin,
  error,
  isSubmitting,
  initialized
})

const $emit = defineEmits<{
  (e: 'submit', value: any): void
}>()
const onSubmit = ($event: any) => {
  error.value = ''
  $emit('submit', $event)
}

onMounted(() => {
  (window as any).app = getCurrentInstance()
  setTimeout(function () { showLogin.value = true }, 1000)
})
</script>

<template>
  <div id="app">
    <LoginComponent
        :show.sync="showLogin"
        :logo="logo"
        :app-name="appName"
        :initialized="initialized"
        :error="error"
        :is-submitting.sync="isSubmitting"
        @submit="onSubmit"/>
  </div>
</template>

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
