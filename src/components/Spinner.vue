<template>
  <div class="preloader-wrapper active custom-spinner" :style="style">
    <div class="spinner-layer" :style="{'border-color': spinnerColor}">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
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
@import '../style/preloader.scss';
</style>
