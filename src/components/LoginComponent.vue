<script lang="ts" setup>
import Spinner from './Spinner.vue'
import InputElement from './InputElement.vue'
import FacebookLogo from './facebook-logo.vue'
import GoogleLogo from './google-logo.vue'
import SocialLoginButton from './social-login-button.vue'
// @ts-ignore
import tinycolor from 'tinycolor2'

import axios from 'axios'
// @ts-ignore../lib/constants
import { VueAuthenticate } from '@gurupras/vue-authenticate'
import { tabs } from '../lib/constants'
import { computed, onMounted, ref, Ref, watch } from 'vue'
import { Icon } from  '@iconify/vue'

// FIXME: This is duplicated here and in lib/types
// Remember to update both if making changes
export interface Theme {
  background?: string,
  text?: string,
  invertedText?: string
}

export interface LoginConfig {
  social?: any,
  show?: boolean,
  initialized?: boolean,
  loggedInId?: any,
  appName?: string,
  theme?: Theme,
  logo?: string,
  error?: string,
  info?: string,
  tos?: string,
  privacyPolicy?: string,
  isSubmitting?: boolean
}


type ErrorEntry = {
  text: string
  isBad(field: string): boolean
}

const errors: Record<string, ErrorEntry> = {
  blank: {
    text: 'Cannot be blank',
    isBad (field: string) {
      if (field.trim().length > 0) {
        return false
      }
      return true
    }
  }
}

const props = withDefaults(defineProps<LoginConfig>(), {
  social: {
    providers: {}
  },
  show: false,
  initialized: false,
  loggedInId: undefined,
  appName: 'Login',
  theme: {
    background: '#009688',
    text: '#fff',
    invertedText: '#000'
  },
  logo: '/security_shield.png',
  error: '',
  info: '',
  tos: '',
  privacyPolicy: '',
  isSubmitting: false
})

const $emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'modal:show'): void,
  (e: 'modal:hide'): void,
  (e: 'update:error', value: string): void,
  (e: 'update:isSubmitting', value: boolean): void,
  (e: 'login', value: { username: string, password: string }): void,
  (e: 'signup', value: { username: string, password: string }): void,
  (e: 'forgot-password', value: { username: string }): void,
  (e: 'modal:closed'): void,
  (e: 'modal:opened'): void,
  (e: 'social-login', value: { provider: string, error?: string }): void
}>()

const $el = ref<HTMLElement>(null as any)
const bg = ref<HTMLElement>(null as any)
const currentTab = ref<string>(tabs.LOGIN)
const prevTab = ref<string>(tabs.LOGIN)
const username = ref<string>('')
const password = ref<string>('')
const forgotEmail = ref<string>('')
const usernameHelp = ref<ErrorEntry>({} as ErrorEntry)
const passwordHelp = ref<ErrorEntry>({} as ErrorEntry)
const forgotEmailHelp = ref<ErrorEntry>({} as ErrorEntry)
const hideLoggedInAccounts = ref<boolean>(false)
const submitSpinnerColor = ref<string>('#fff')

const hasSocialProvider = computed(() => {
  if (!props.social) {
    return false
  }
  if (!props.social.providers) {
    return false
  }
  return Object.values(props.social.providers).some(element => !!element)
})

const buttonText = computed(() => {
  switch (currentTab.value) {
    case tabs.LOGIN:
      return 'LOG IN'
    case tabs.SIGNUP:
      return 'SIGN UP'
    case tabs.FORGOT_PASSWORD:
      return 'Send Email'
    default:
      return '???'
  }
})

const currentContainer = computed(() => {
  if (currentTab.value === tabs.LOGIN || currentTab.value === tabs.SIGNUP) {
    return 'login'
  }
  return 'forgot-password'
})

const showLoggedInAccounts = computed(() => {
  return props.initialized && props.loggedInId && !hideLoggedInAccounts.value
})

watch(() => props.show, v => {
  if (v) {
    $emit('modal:show')
  } else {
    $emit('modal:hide')
  }
})

watch(() => currentTab.value, (v, o) => {
  prevTab.value = o
  resetAllHelp()
  // We don't clear info because we want success messages to persist
  // An example of this is forgot-password success message
  $emit('update:error', '')
})

watch(() => username.value, (v) => {
  testAndUpdate(v, usernameHelp)
})

watch(() => password.value, (v) => {
  testAndUpdate(v, passwordHelp)
})

watch(() => forgotEmail.value, (v) => {
  testAndUpdate(v, forgotEmailHelp)
})

watch(() => props.theme, (v) => {
  updateTheme(v!)
}, {
  deep: true
})

const style = computed(() => {
  const { background, text, invertedText } = props.theme!
  const tcBackground = tinycolor(background)
  const ret: Record<string, string> = {}

  ret['--theme-background'] = background!

  for (let idx = 5; idx <= 15; idx += 5) {
    ret[`--theme-background-lighten-${idx}`] = tcBackground.clone().lighten(idx).toString('hex6')
    ret[`--theme-background-darken-${idx}`] = tcBackground.clone().darken(idx).toString('hex6')
  }
  ret['--generic-login-theme'] = background!
  ret['--generic-login-text'] = text!
  ret['--generic-login-text-inverted'] = invertedText!
  ret['--generic-login-theme-light'] = tcBackground.clone().lighten(15).toString('hex6')
  return ret
})

const updateTheme = (theme: Theme) => {
  const { background } = theme
  const tcBackground = tinycolor(background)
  if (tcBackground.isLight()) {
    submitSpinnerColor.value = tcBackground.clone().darken(40).toString('hex6')
  } else {
    submitSpinnerColor.value = tcBackground.clone().lighten(40).toString('hex6')
  }
}

const testAndUpdate = (value: string, help: Ref<ErrorEntry>) => {
  if (help.value.isBad && !help.value.isBad(value)) {
    help.value = {} as ErrorEntry
  }
}

const onSubmit = async () => {
  if (props.isSubmitting) {
    return
  }
  let hasError = false
  switch (currentTab.value) {
    case tabs.LOGIN:
    case tabs.SIGNUP:
      if (username.value.trim() === '') {
        usernameHelp.value = errors.blank
        hasError = true
      }
      if (password.value.trim() === '') {
        passwordHelp.value = errors.blank
        hasError = true
      }
      break
    case tabs.FORGOT_PASSWORD:
      if (forgotEmail.value.trim() === '') {
        forgotEmailHelp.value = errors.blank
        hasError = true
      }
      break
  }
  if (hasError) {
    return
  }
  $emit('update:isSubmitting', true)
  switch (currentTab.value) {
    case tabs.LOGIN:
      // Do login
      $emit('login', { username: username.value, password: password.value })
      break
    case tabs.SIGNUP:
      // Do signup
      $emit('signup', { username: username.value, password: password.value })
      break
    case tabs.FORGOT_PASSWORD:
      // Forgot password
      $emit('forgot-password', { username: forgotEmail.value })
      break
  }
}

const resetAllHelp = () => {
  usernameHelp.value = {} as ErrorEntry
  passwordHelp.value = {} as ErrorEntry
  forgotEmailHelp.value = {} as ErrorEntry
}

const afterExit = () => {
  bg.value.classList.remove('is-leaving')
  $emit('modal:closed')
}

const onExit = () => {
  bg.value.classList.add('is-leaving')
}

const onEnter = () => {
}

const afterEnter = () => {
  $emit('modal:opened')
}

let vueAuth: any
const socialLogin = async (provider: string) => {
  try {
    const data = await new Promise((resolve, reject) => {
      vueAuth = vueAuth || new VueAuthenticate(axios.create(), props.social)
      vueAuth.authenticate(provider).then((results: any) => {
        resolve(results.data)
      }).catch((err: Error) => {
        reject(err)
      })
    })
    $emit('social-login', {
      provider,
      ...(data as any)
    })
  } catch (e: any) {
    $emit('social-login', {
      provider,
      error: e.message
    })
  }
}

onMounted(() => {
  updateTheme(props.theme!)
})
</script>

<template>
  <div class="login-root" ref="$el" :style="style">
    <div class="login-modal is-active">
      <div class="modal-background" ref="bg"></div>
      <transition name="slide-from-bottom"
          @leave="onExit"
          @after-leave="afterExit"
          @enter="onEnter"
          @after-enter="afterEnter">
        <div class="modal-content" v-if="show" :class="{uninitialized: !initialized, 'logged-in': showLoggedInAccounts}" style="position: relative;">
          <a class="browser-default modal-close modal-btn is-large" aria-label="close" @click="$emit('update:show', false)"></a>
          <a class="browser-default modal-back modal-btn is-large has-text-centered" aria-label="back" @click="currentTab = prevTab" v-show="currentTab === tabs.FORGOT_PASSWORD">
            <Icon icon="mdi-arrow-left"/>
          </a>
          <div class="banner-container">
            <div class="banner">
              <figure class="image">
                <img class="is-rounded" :src="logo"/>
              </figure>
            </div>
            <h4 class="banner-title">{{ appName }}</h4>
          </div>
          <transition name="fade-translate">
            <div v-if="error || info" style="max-height: fit-content">
              <div class="text-info has-background-danger has-text-white has-text-centered" v-show="error" v-html="error">
              </div>
              <div class="text-info has-background-success has-text-white has-text-centered" v-show="info" v-html="info">
              </div>
            </div>
          </transition>
          <div class="content-wrapper basic-flex" style="flex-shrink: 0;">
            <div class="content-container">
              <div v-if="!initialized" class="is-flex" style="display: flex; height: 100%; align-items: center; justify-content: center; overflow: hidden;">
                <Spinner color="grey" size="48px"/>
              </div>
              <div v-else-if="showLoggedInAccounts"
                  class="accounts-container basic-flex"
                  :class="loggedInId.social">
                <div class="basic-flex" style="align-items: center; justify-content: center; margin: 0 12px;">
                  <p style="margin-bottom: 15px">
                    Last time you logged in with
                  </p>
                  <button class="button is-medium is-fullwidth account-login-btn" :class="loggedInId.provider ? 'provider-' + loggedInId.provider : ''" @click="$emit('last-login-login')">
                    <span class="icon is-small" style="flex-shrink: 0;">
                      <GoogleLogo v-if="loggedInId.provider === 'google'" class="social-btn google" style="width: 22px; height: auto;"/>
                      <FacebookLogo v-else-if="loggedInId.provider === 'facebook'" class="social-btn" style="width: 32px; height: 32px;"/>
                      <Icon icon="mdi-lock" v-else/>
                    </span>
                    <span class="is-clipped" style="text-overflow: ellipsis" :title="loggedInId.email">{{ loggedInId.email }}</span>
                  </button>
                <p class="has-text-centered" style="margin-top: 20px;">
                  <a class="alternate-login" @click="hideLoggedInAccounts = true">Not your account?</a>
                </p>
                </div>
              </div>
              <div v-else-if="initialized && !showLoggedInAccounts">
                <transition-group :name="currentTab === tabs.FORGOT_PASSWORD ? 'slide-out-left' : 'slide-out-right'">
                  <div class="login-container is-paddingless" v-if="currentTab === tabs.LOGIN || currentTab === tabs.SIGNUP" :key="currentContainer">
                    <div class="login-content-container has-text-centered">
                      <div class="columns is-vcentered is-marginless is-paddingless">
                        <div class="login-content is-centered">
                          <div class="tabs is-fullwidth">
                            <ul class="browser-default">
                              <li :class="{'is-active': currentTab === tabs.LOGIN}">
                                <a @click="currentTab = tabs.LOGIN">Log In</a>
                              </li>
                              <li :class="{'is-active': currentTab === tabs.SIGNUP}">
                                <a @click="currentTab = tabs.SIGNUP">Sign Up</a>
                              </li>
                            </ul>
                          </div>
                          <div class="tab-content basic-flex">
                            <div class="is-active" v-if="currentTab === tabs.LOGIN || currentTab === tabs.SIGNUP">
                              <div v-if="hasSocialProvider" class="columns" style="margin-bottom: 0;">
                                <div class="column social-login-container">
                                  <a v-if="social.providers.google" @click="socialLogin('google')">
                                    <SocialLoginButton class="social-btn" name="Google">
                                      <template slot="logo">
                                        <GoogleLogo class="logo"/>
                                      </template>
                                    </SocialLoginButton>
                                  </a>
                                  <a v-if="social.providers.facebook" @click="socialLogin('facebook')">
                                    <SocialLoginButton class="social-btn" name="Facebook">
                                      <template slot="logo">
                                        <FacebookLogo class="logo facebook"/>
                                      </template>
                                    </SocialLoginButton>
                                  </a>
                                </div>
                              </div>
                              <p :style="{visibility: hasSocialProvider ? 'visible' : 'hidden'}" style="margin: 0 0 12px 0; font-size: 14px;">OR</p>
                              <div class="columns basic-flex login-fields-container" style="margin-bottom: 0;">
                                <div class="column is-paddingless">
                                  <InputElement type="email" name="username" placeholder="your-email-id@example.com" autocomplete="username" v-model="username" :help="usernameHelp.text" @submit="onSubmit">
                                    <template v-slot:leftIcon>
                                      <Icon icon="mdi-email"/>
                                    </template>
                                  </InputElement>
                                  <InputElement type="password" name="password" placeholder="password" :autocomplete="currentTab === tabs.LOGIN ? 'current-password' : 'new-password'" v-model="password" :help="passwordHelp.text" @submit="onSubmit">
                                    <template v-slot:leftIcon>
                                      <Icon icon="mdi-lock"/>
                                    </template>
                                  </InputElement>
                                </div>
                              </div>
                              <div class="columns basic-flex is-paddingless" v-if="currentTab === tabs.LOGIN">
                                <!-- Margin set to 13px to ensure log-in is same size as sign-up -->
                                <div class="column" style="padding-top: 0; margin: 13px 0;">
                                  <a style="font-size: 14px;" @click="currentTab = tabs.FORGOT_PASSWORD">Forgot password?</a>
                                </div>
                              </div>

                              <div class="columns basic-flex is-marginless" v-show="currentTab === tabs.SIGNUP">
                                <div class="column terms">
                                  <span>By creating an account, you agree to our
                                    <a v-if="tos" :href="tos" target="_blank">terms of service</a>
                                    <span v-else>terms of service</span>
                                    and
                                    <a v-if="privacyPolicy" :href="privacyPolicy" target="_blank">privacy policy</a>
                                    <span v-else>privacy policy</span>.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="forgot-password-container is-paddingless" v-if="currentTab === tabs.FORGOT_PASSWORD" :key="currentContainer">
                    <p class="has-text-centered" style="margin: 16px; font-size: 14px;">Enter your email address. You will receive an email to reset your password.</p>
                    <InputElement type="email" placeholder="your-email-id@example.com" v-model="forgotEmail" :help="forgotEmailHelp.text" @submit="onSubmit">
                      <template v-slot:leftIcon>
                        <Icon icon="mdi-email"/>
                      </template>
                    </InputElement>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>

          <a v-show="initialized && !showLoggedInAccounts" class="submit-btn is-large is-fullwidth" :disabled="isSubmitting" style="overflow: hidden;" @click="onSubmit">
            <transition name="slide-from-bottom">
              <span class="icon-text" v-if="!isSubmitting">
                <span>{{ buttonText }}</span>
                <span class="icon" v-if="!isSubmitting">
                  <Icon icon="mdi-chevron-right" :inline="true" style="width: inherit; height: inherit;"/>
                </span>
              </span>
              <div v-else>
                <Spinner :color="submitSpinnerColor" class="small" size="38px" style="vertical-align: middle;"/>
              </div>
            </transition>
          </a>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep() {
  @import '../style/bulma-imports.scss';
}
$border-radius: 10px;
$banner-background: #dadada;

$container-width: 300px;
$banner-logo-height: 64px;
$banner-title-height: 36px;
$banner-padding: 8px;
$banner-container-height: ($banner-logo-height + $banner-title-height) + ($banner-padding * 3);

$uninitialized-banner-logo-height: 36px;
$uninitialized-banner-title-height: 24px;
$uninitialized-banner-padding: 8px;
$uninitialized-banner-container-height: ($uninitialized-banner-logo-height + $uninitialized-banner-title-height) + ($uninitialized-banner-padding * 3);

$uninitialized-modal-content-height: 180px;
$logged-in-modal-content-height: 290px;
$uninitialized-content-container-height: ($uninitialized-modal-content-height - $uninitialized-banner-container-height);
$logged-in-content-container-height: ($logged-in-modal-content-height - $banner-container-height);

$account-login-background: darken(#c0c0c0, 15);
$facebook-background: #3b579d;

$text-color: #2a2a2a;

.login-root :deep() {
  .columns {
    margin-left: 0;
    margin-right: 0;
  }
  .login-modal {
    color: $text-color;
    align-items: center;
    display: none;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    position: fixed;
    z-index: 40;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    &.is-active {
      display: flex;
    }

    .modal-background {
      transition-property: all;
      transition-timing-function: ease-in-out;
      transition-duration: 0.3s;
      background: radial-gradient(#4a4a4f, #10102a);
      opacity: 0.75;
      &.is-leaving {
        background-color: inherit !important;
      }
    }
    &.is-active .modal-background {
      transition-property: all;
      transition-timing-function: ease-in-out;
      transition-duration: 0.3s;
      background-color: #111118;
    }
    .modal-content {
      width: auto;
      overflow-y: auto;
      background-color: var(--generic-login-theme);
      border-radius: $border-radius;
      min-width: $container-width;
      max-width: $container-width;
      min-height: 220px;
      box-shadow: 0 0 40px 4px #1e1e1e;
      transition-property: max-height;
      transition-timing-function: linear;
      transition-duration: 0.3s;
      border-bottom-color: var(--generic-login-theme);
      &.uninitialized, &.logged-in {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: $uninitialized-modal-content-height;
        max-height: $uninitialized-modal-content-height;
        .content-container {
          height: 100%;
        }
      }
      .tabs ul {
        border-bottom: 1px solid transparent;
        box-sizing: content-box;
        font-size: 16px;
        line-height: initial;
        max-height: 34px;
        a {
          margin: 0 0 -1px 0;
          padding: 8px 16px;
          font-size: 16px;
          box-sizing: content-box;
          font-weight: normal;
          height: 18px;
        }
      }
      &.logged-in {
        max-height: $logged-in-modal-content-height;
        .content-container {
          max-height: $logged-in-content-container-height;
        }
        .accounts-container {
          height: 100%;
          transition: none;
          font-size: 0.9em;
          color: rgba(0, 0, 0, 0.5);

          &.facebook {
            .icon {
              background-color: #3b579d !important;
            }
          }

          .account-login-btn {
            background-color: $account-login-background;
            color: white;
            justify-content: flex-start;
            padding: 0;
            height: 45px;
            line-height: 45px;
            border: none;
            border-radius: 5px;
            box-shadow: none !important;
            transition: none;
            &.provider-facebook {
              background-color: $facebook-background;
              svg {
                fill: $facebook-background;
              }
              &:hover {
                background-color: darken($facebook-background, 10);
                svg {
                  fill: darken($facebook-background, 10);
                }
              }
            }
            &.provider-google {
              background-color: #fffffe;
              color: $text-color;
              &:hover {
                background-color: darken(white, 5);
              }
              .icon {
                border: thin solid lightgrey;
                border-right: none;
                & + span {
                  border: thin solid lightgrey;
                  border-left: none;
                }
              }
            }
            &:hover {
              background-color: darken($account-login-background, 5);
            }
            .icon {
              margin: 0;
              height: inherit;
              line-height: inherit;
              display: inline-flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              background-color: inherit;
              width: 45px;
              border-right: none;
              border-radius: inherit;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
              > img {
                height: 45px;
                width: 48px;
                &.facebook {
                  width: 28px;
                  height: auto;
                  margin-right: 6px;
                  margin-bottom: 6px;
                }
              }
            }
            .icon + span {
              height: inherit;
              font-size: 14px;
              letter-spacing: 0.7px;
              // font-family: monospace;
              padding-left: 16px;
              padding-right: 16px;
              border-left: none;
              border-radius: inherit;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
        }
      }
      .content-container {
        overflow: auto;
        transition-property: all;
        transition-timing-function: ease-in-out;
        transition-duration: 0.3s;
        background-color: #fff;
      }
      .text-info {
        align-items: center;
        justify-content: center;
        padding: 4px 8px;
      }
      .modal-btn {
        position: absolute;
        color: black;
        background-color: #fff;
        width: 24px;
        height: 24px;
        max-width: 24px;
        max-height: 24px;
        min-height: 24px;
        min-width: 24px;
        &::before {
          background-color: black;
        }
        &::after {
          background-color: black;
        }
        &:hover {
            background-color: darken(#fff, 20);
        }
        &.modal-close {
          right: 12px;
          top: 12px;
        }
        &.modal-back {
          display: flex;
          flex-direction: column;
          flex: 1;
          align-items: center;
          justify-content: center;
          left: 12px;
          top: 12px;
          border-radius: 290486px;
          :deep(svg) {
            width: 12px;
            height: 12px;
            position: absolute;
            left: 0;
            top: 0;
            transform: translate(50%, 50%);
          }
        }
      }
      &.uninitialized .banner-container {
        height: $uninitialized-banner-container-height;
        .banner {
          padding: $uninitialized-banner-padding 0 0 0;
          img {
            width: $uninitialized-banner-logo-height;
            height: $uninitialized-banner-logo-height;
          }
        }
      }
      .banner-container {
        height: $banner-container-height;
        text-align: center;
        background-color: $banner-background;
        .banner {
          display: inline-block;
          padding: $banner-padding 0 0 0;
          img {
            width: $banner-logo-height;
            height: $banner-logo-height;
          }
        }
        .banner-title {
          color: $text-color;
          font-size: 22px;
        }
      }
      .login-content-container {
        .preloader-container {
          text-align: center;
          align-items: center;
          :deep(.custom-spinner) {
            display: inline-block;
          }
        }
        .login-content {
          width: 100%;
          .tab-content {
            padding: 0;
          }
          .login-fields-container {
            flex-direction: column;
            padding-left: 24px;
            padding-right: 24px;

          }
        }
      }
    }
  }

  .social-login-container {
    a {
      position: relative;
      display: block;
      margin: 0 0.8em;
      &:not(:last-child) {
        margin-bottom: 12px;
      }
      :deep(.logo.facebook) {
        background-color: $facebook-background;
        fill: $facebook-background;
        border-radius: 3px;
      }
    }
  }

  .basic-flex {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .terms {
    background-color: lightgrey;
    font-size: 13px;
  }

  .submit-btn {
    background-color: #3a3a3a;
    color: white;
    background-color: var(--theme-background);
    color: var(--generic-login-text);
    // border-radius: 0 0 #{$border-radius - 3} #{$border-radius - 3};
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    text-align: center;
    justify-content: center;
    height: 64px;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    line-height: 64px;
    &:hover {
      background-color: var(--theme-background-darken-5);
      color: var(--generic-login-text);
    }
    &[disabled] {
      cursor: default;
      box-shadow: none;
      opacity: 0.8;
    }
    .icon {
      font-size: inherit;
      line-height: inherit;
      height: inherit;
      margin-left: 0.4875em;
    }
  }
  .slide-from-bottom-enter-active, .slide-from-bottom-leave-active {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    transition-property: transform !important;
    transition-timing-function: ease-in-out;
    transition-duration: 0.3s;
    transform: translateY(0%);
  }
  .slide-from-bottom-enter-from, .slide-from-bottom-leave-to /* .fade-leave-active below version 2.1.8 */ {
    position: absolute;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    transition-property: transform !important;
    transition-timing-function: linear;
    transition-duration: 0.3s;
    transform: translateY(200%);
  }

  .slide-out-left-enter-active, .slide-out-left-leave-active {
    // margin-left: auto;
    // margin-right: auto;
    // display: flex;
    // flex-direction: 1;
    // flex: 1;
    transition-property: all;
    transition-timing-function: linear;
    transition-duration: 0.5s;
    transform: translateX(0%);
  }
  .slide-out-left-leave-active {
    position: absolute;
    width: 100%;
    // max-height: 0 !important;
  }

  .slide-out-left-enter-from, .slide-out-left-leave-to {
    // margin-left: auto;
    // margin-right: auto;
    // display: flex;
    // flex-direction: 1;
    // flex: 1;
    transition-property: all;
    transition-timing-function: ease-in-out;
    transition-duration: 0.5s;
    transform: translateX(-200%);
    // max-height: initial;
  }

  .slide-out-right-enter-active, .slide-out-right-leave-active {
    // display: flex;
    // flex-direction: 1;
    // flex: 1;
    // margin-left: auto;
    // margin-right: auto;
    transition-property: all;
    transition-timing-function: ease-in-out;
    transition-duration: 0.5s;
    transform: translateX(0%);
  }

  .slide-out-right-leave-active {
    position: absolute;
    width: 100%;
    // max-height: 0 !important;
  }

  .slide-out-right-enter-from, .slide-out-right-leave-to {
    position: absolute;
    width: 100%;
    // margin-left: auto;
    // margin-right: auto;
    // display: flex;
    // flex-direction: 1;
    // flex: 1;
    transition-property: all;
    transition-timing-function: ease-in-out;
    transition-duration: 0.5s;
    transform: translateX(-200%);
  }

  .fade-translate-enter-active, .fade-translate-leave-active {
    transition-property: all;
    transition-duration: 0.3s;
  }
  .fade-translate-enter-from, .fade-translate-leave-to /* .fade-translate-leave-active below version 2.1.8 */ {
    opacity: 0;
    max-height: 0 !important;
  }
}
</style>
