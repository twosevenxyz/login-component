<template>
<div class="social-login-root">
  <slot name="logo">
    <Icon :icon="icons.mdiLock" class="logo"/>
  </slot>
  <span>Login with {{ name }}</span>
</div>
</template>

<script>
import { Icon } from '@iconify/vue2'
import mdiLock from '@iconify-icons/mdi/lock'

export default {
  name: 'social-login-button',
  components: {
    Icon
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      icons: {
        mdiLock
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.social-login-root {
  color: #4a4a4a;
  padding: 0 10px;
  padding-left: 20px;
  height: 42px;
  border-radius: 3px;
  border: thin solid #aeaeae;
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  &:hover {
    background-color: #eaeaea;
  }
  .logo {
    width: 22px;
    height: 22px;
  }
  span {
    flex: 1;
    font-size: 0.97em;
    vertical-align: middle;
  }
}
</style>
