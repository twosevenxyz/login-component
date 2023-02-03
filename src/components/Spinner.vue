<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  color?: string,
  size?: string
}>(), {
  color: undefined as any as string,
  size: '32px'
})

const spinnerColor = computed(() => {
  if (props.color) {
    return props.color
  } else {
    return 'inherit;'
  }
})

const style = computed(() => {
  const ret = {}
  if (props.size) {
    Object.assign(ret, {
      width: props.size,
      height: props.size
    })
  }
  return ret
})
</script>

<template>
  <svg class="loading-spinner" :width="size" :height="size" viewBox="-24 -24 48 48">
    <circle class="path" :style="{stroke: spinnerColor}" cx="0" cy="0" r="20" fill="none" stroke-width="4" />
  </svg>
</template>

<style lang="scss" scoped>
// Most of this code is borrowed from https://codepen.io/marshmallowsyrup/pen/gzaewJ
$speed: 1.25s;

.loading-spinner {
  animation: rotate $speed * 1.75 linear infinite;
  transform-origin: center;

  .path {
    animation: dash $speed ease-in-out infinite, color $speed * 4 ease-in-out calc($speed / 2) infinite;
    stroke-linecap: round;
  }
}

@mixin keyframes($animationName) {
  @-webkit-keyframes #{$animationName} {
    @content;
  }
  @-moz-keyframes #{$animationName} {
    @content;
  }
  @-o-keyframes #{$animationName} {
    @content;
  }
  @keyframes #{$animationName} {
    @content;
  }
}

@include keyframes(rotate) {
  100% {
    transform: rotate(360deg);
  }
}

@include keyframes(dash) {
  0% {
    stroke-dasharray: 0, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100, 150;
    stroke-dashoffset: -24;
  }
  100% {
    stroke-dasharray: 0, 150;
    stroke-dashoffset: -124; // 100 + 24
  }
}

@include keyframes(color) {
  0%, 100% {
  }
}
</style>
