/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, boolean, object } from '@storybook/addon-knobs'

import '../style/bulma-imports.scss'

import LoginComponent from '../components/LoginComponent.vue'
import InputElement from '../components/InputElement.vue'

storiesOf('InputElement', module)
  .add('default', () => ({
    components: { InputElement },
    template: '<InputElement @submit="onSubmit"/>',
    methods: { action: action('onSubmit') }
  }))
  .add('type=number', () => ({
    components: { InputElement },
    template: '<InputElement type="number" @submit="onSubmit"/>',
    methods: { action: action('onSubmit') }
  }))
  .add('placeholder', () => ({
    components: { InputElement },
    template: '<InputElement placeholder="test" @submit="onSubmit"/>',
    methods: { action: action('onSubmit') }
  }))

storiesOf('LoginComponent', module)
  .addDecorator(withKnobs)
  .add('default', () => ({
    components: { LoginComponent },
    template: `
  <div id="app">
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
      @submit="onSubmit"/>
  </div>`,
    methods: {
      onSubmit: action('onSubmit')
    },
    props: {
      showModal: {
        default: boolean('ShowModal', false)
      },
      initialized: {
        default: boolean('initialized', false)
      },
      theme: {
        default: {
          background: text('background', '#009688'),
          text: text('text', '#fff'),
          invertedText: text('invertedText', '#000')
        }
      },
      loggedInId: {
        default: object('loggedInId', undefined)
      },
      error: {
        default: text('Error', '')
      },
      info: {
        default: text('Info', '')
      },
      logo: {
        default: text('Logo', `/security_shield.png`)
      },
      appName: {
        default: text('App name', 'Storybook')
      },
      isSubmitting: {
        default: boolean('IsSubmitting', false)
      },
      hideLoggedInAccounts: {
        default: boolean('hideLoggedInAccounts', false)
      },
      social: {
        default: {
          providers: {
            google: boolean('Google', false),
            facebook: boolean('Facebook', false)
          }
        }
      }
    },
    data () {
      return {}
    }
  }))
