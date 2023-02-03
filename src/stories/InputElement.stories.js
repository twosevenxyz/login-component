import InputElement from '../components/InputElement.vue'

export default {
  title: 'InputElement',
  component: InputElement,
  argTypes: {
    type: {
      control: {
        type: 'text'
      }
    },
    placeholder: {
      control: {
        type: 'text'
      }
    },
    help: {
      control: {
        type: 'text'
      }
    },
    inputClasses: {
      control: {
        type: 'text'
      }
    },
    inputId: {
      control: {
        type: 'text'
      }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { InputElement },
  props: Object.keys(argTypes),
  setup () {
    return { args }
  },
  methods: {
    onSubmit () {
    }
  },
  template: `
  <InputElement v-bind="args" @submit="onSubmit"/>
  `
})

export const standard = Template.bind({})
standard.args = {
  type: 'text'
}

export const typeNumber = Template.bind({})
typeNumber.args = {
  type: 'number'
}

export const placeholder = Template.bind({})
placeholder.args = {
  placeholder: 'test'
}
