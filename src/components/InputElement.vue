<template>
  <div class="field has-addons" style="margin: 12px;">
    <div class="control is-expanded">
      <p class="control is-flex" :class="extraControlClasses">
        <input class="input" :class="[help ? 'is-danger': '', inputClasses]"
            :type="type"
            :placeholder="placeholder"
            :value="value"
            @keyup.enter.stop="$emit('submit')"
            @input="$emit('input', $event.target.value)">
        <span v-if="$slots.leftIcon" class="icon is-small is-left">
          <slot name="leftIcon"></slot>
        </span>
      </p>
      <p class="help has-text-danger">{{help}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputElement',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: 'Enter text here'
    },
    value: {
      type: String
    },
    help: {
      type: String,
      default: ''
    },
    inputClasses: {
      type: [Array, String, Object],
      default () {
        return ''
      }
    }
  },
  computed: {
    extraControlClasses () {
      const ret = []
      if (this.$slots.leftIcon) {
        ret.push('has-icons-left')
      }
      return ret
    }
  }
}
</script>

<style lang="scss" scoped>
.control {
  font-size: 14px !important;
  input {
    font-size: inherit;
    padding-top: 8px;
    padding-bottom: 8px;
    height: 2.5rem;
  }
  .icon {
    height: 2.5rem !important;
    padding: 8px 0;
    /deep/ .svg-inline--fa {
      font-size: inherit;
      width: inherit;
      vertical-align: bottom;
    }
  }
}
</style>
