import LoginComponent from '../components/LoginComponent.vue'

const templateDecorator = () => ({
  template: `
  <div id="app">
  <story/>
  </div>
  `
})

export default {
  title: 'LoginComponent',
  component: LoginComponent,
  argTypes: {
    showModal: {
      control: {
        type: 'boolean'
      }
    },
    initialized: {
      control: {
        type: 'boolean'
      }
    },
    background: {
      control: {
        type: 'color'
      }
    },
    text: {
      control: {
        type: 'color'
      }
    },
    invertedText: {
      control: {
        type: 'color'
      }
    },
    loggedInId: {
      type: 'text'
    },
    error: {
      control: {
        type: 'text'
      }
    },
    info: {
      control: {
        type: 'text'
      }
    },
    logo: {
      control: {
        type: 'text'
      }
    },
    appName: {
      control: {
        type: 'text'
      }
    },
    isSubmitting: {
      control: {
        type: 'boolean'
      }
    },
    hideLoggedInAccounts: {
      control: {
        type: 'boolean'
      }
    },
    tos: {
      control: {
        type: 'text'
      }
    },
    privacyPolicy: {
      control: {
        type: 'text'
      }
    },
    social: {
      type: 'object'
    },
    googleProvider: {
      control: {
        type: 'boolean'
      }
    },
    facebookProvider: {
      control: {
        type: 'boolean'
      }
    }
  },
  decorators: [templateDecorator]
}

const Template = (args, { argTypes }) => {
  debugger
  return {
    template: `
    <LoginComponent
      :show.sync="showModal"
      :initialized="initialized"
      :theme="theme"
      :logged-in-id="loggedInId"
      :social="social"
      :logo="logo"
      :app-name="appName"
      :error="error"
      :info="info"
      :is-submitting.sync="isSubmitting"
      :tos="tos"
      :privacy-policy="privacyPolicy"
      @submit="onSubmit"/>
    `,
    components: { LoginComponent },
    props: Object.keys(argTypes),
    data () {
      return {}
    },
    methods: {
      onSubmit () {
      }
    }
  }
}

export const Standard = Template.bind({})
Standard.args = {
  showModal: false,
  initialized: false,
  background: '#009688',
  text: '#fff',
  invertedText: '#000',
  loggedInId: undefined,
  error: '',
  info: '',
  logo: '/security_shield.png',
  appName: 'Storybook',
  isSubmitting: false,
  hideLoggedInAccounts: false,
  tos: '',
  privacyPolicy: '',
  social: {
    providers: {
      get google () {
        return this.googleProvider
      },
      get facebook () {
        return this.facebookProvider
      }
    }
  }
}
