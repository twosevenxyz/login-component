<template>
  <div class="field has-addons" style="margin: 12px;">
    <div class="control is-expanded">
      <p class="control is-flex" :class="extraControlClasses">
        <input class="input" :class="[help ? 'is-danger': '', inputClasses]"
            :id="inputId"
            v-bind="$inputAttrs"
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
    help: {
      type: String,
      default: ''
    },
    inputClasses: {
      type: [Array, String, Object],
      default () {
        return ''
      }
    },
    inputId: {
      type: String
    }
  },
  computed: {
    extraControlClasses () {
      const ret = []
      if (this.$slots.leftIcon) {
        ret.push('has-icons-left')
      }
      return ret
    },
    $inputAttrs () {
      const { $attrs: { help, inputClasses, ...$inputAttrs } } = this
      return $inputAttrs
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'bulma/sass/utilities/_all.sass';
@import 'bulma/sass/base/_all.sass';
@import 'bulma/sass/components/modal.sass';
@import 'bulma/sass/components/tabs.sass';
@import 'bulma/sass/elements/image.sass';
@import 'bulma/sass/elements/button.sass';
@import 'bulma/sass/grid/columns.sass';

@import 'bulma/sass/form/shared.sass';
@import 'bulma/sass/form/tools.sass';
@import 'bulma/sass/form/input-textarea.sass';

.control {
  font-size: 14px !important;
  input {
    background-color: #fff;
    font-size: inherit;
    padding: 0;
    height: 2.5rem;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    outline: none;
    box-shadow: inset 0 0.0625em 0.125em rgba(10,10,10,.05);
    color: #363636;
    &:hover {
      border: 1px solid #b5b5b5;
    }
    &:focus {
      border: 1px solid darken(#b5b5b5, 10);
      border-bottom-color: darken(#b5b5b5, 10) !important;
      box-shadow: none !important;
    }
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
