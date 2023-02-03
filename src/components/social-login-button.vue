<script lang="ts" setup>
defineProps<{
  name: string
}>()

</script>

<template>
<div class="social-login-root">
  <slot name="logo">
    <i-mdi-lock class="logo"/>
  </slot>
  <span>Login with {{ name }}</span>
</div>
</template>

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
