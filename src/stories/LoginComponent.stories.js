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
  return {
    components: { LoginComponent },
    props: Object.keys(argTypes),
    setup () {
      return { args }
    },
    data () {
      return {}
    },
    methods: {
      onSubmit () {
      }
    },
    template: `
    <LoginComponent
      :show.sync="args.showModal"
      :initialized="args.initialized"
      :theme="args.theme"
      :logged-in-id="args.loggedInId"
      :error="args.error"
      :info="args.info"
      :logo="args.logo"
      :app-name="args.appName"
      :is-submitting.sync="args.isSubmitting"
      :hide-logged-in-accounts="args.hideLoggedInAccounts"
      :tos="args.tos"
      :privacy-policy="args.privacyPolicy"
      :social="args.social"
      @submit="onSubmit"/>
    `
  }
}

export const Standard = Template.bind({})
Standard.args = {
  showModal: false,
  initialized: false,
  theme: {
    background: '#009689',
    text: '#fff',
    invertedText: '#000'
  },
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
