<template>
  <svg class="loading-spinner" :width="size" :height="size" viewBox="-24 -24 48 48">
    <circle class="path" :style="{stroke: spinnerColor}" cx="0" cy="0" r="20" fill="none" stroke-width="4" />
  </svg>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    color: {
      type: String,
      default: undefined
    },
    size: {
      type: String,
      default: '32px'
    }
  },
  computed: {
    spinnerColor () {
      if (this.color) {
        return this.color
      } else {
        return 'inherit;'
      }
    },
    style () {
      const ret = {}
      if (this.size) {
        Object.assign(ret, {
          width: this.size,
          height: this.size
        })
      }
      return ret
    }
  }
}
</script>

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
