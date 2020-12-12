/* eslint-disable import/no-extraneous-dependencies */
import InputElement from '../components/InputElement.vue'

export default {
  title: 'InputElement'
}

export const standard = () => ({
  components: { InputElement },
  template: '<InputElement @submit="onSubmit"/>',
  methods: {
    onSubmit () {
    }
  }
})

export const typeNumber = () => ({
  components: { InputElement },
  template: '<InputElement type="number" @submit="onSubmit"/>',
  methods: {
    onSubmit () {
    }
  }
})

export const placeholder = () => ({
  components: { InputElement },
  template: '<InputElement placeholder="test" @submit="onSubmit"/>',
  methods: {
    onSubmit () {
    }
  }
})
