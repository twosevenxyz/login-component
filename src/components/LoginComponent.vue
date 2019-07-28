<template>
  <div class="login-bulma">
    <div class="login-modal">
      <div class="modal-background" ref="bg"></div>
      <transition name="slide-from-bottom"
          @leave="onExit"
          @after-leave="afterExit"
          @enter="onEnter">
        <div class="modal-content" v-if="show">
          <a class="browser-default modal-close modal-btn is-large" aria-label="close" @click="$emit('update:show', false)"></a>
          <a class="browser-default modal-back modal-btn is-large has-text-centered" aria-label="back" @click="currentTab = prevTab" v-show="currentTab > 1">
            <FontAwesomeIcon icon="arrow-left"/>
          </a>
          <div class="banner-container">
            <div class="banner">
              <figure class="image">
                <img class="is-rounded" :src="logo"/>
              </figure>
            </div>
            <h4 class="banner-title">{{ appName }}</h4>
          </div>
          <div class="content-container basic-flex" style="position :relative;">
            <transition :name="currentTab === 2 ? 'slide-out-left' : 'slide-out-right'">
              <div class="column login-container basic-flex is-paddingless" v-if="currentTab <= 1" :key="currentContainer">
                <div class="login-content-container basic-flex has-text-centered">
                  <div class="columns is-vcentered is-marginless is-paddingless basic-flex">
                    <div class="column preloader-container is-marginless is-paddingless is-flex" v-if="isBusy">
                      <Spinner color="grey" size="48px"/>
                    </div>
                    <div class="login-content basic-flex is-centered">
                      <div class="tabs basic-flex is-fullwidth">
                        <ul class="browser-default">
                          <li :class="{'is-active': currentTab === 0}">
                            <a @click="currentTab = 0">Log In</a>
                          </li>
                          <li :class="{'is-active': currentTab === 1}">
                            <a @click="currentTab = 1">Sign Up</a>
                          </li>
                        </ul>
                      </div>
                      <div class="tab-content basic-flex">
                        <div class="is-active basic-flex" v-if="currentTab <= 1">
                          <div class="columns" style="margin-bottom: 0;">
                            <div class="column social-login-container">
                              <a>
                                <img class="social-btn" src="../assets/google_logo.png">
                              </a>
                              <a>
                                <img class="social-btn" src="../assets/facebook_logo.webp">
                              </a>
                            </div>
                          </div>
                          <p style="margin: 0 0 12px 0; font-size: 14px;">or</p>
                          <div class="columns basic-flex login-fields-container" style="margin-bottom: 0;">
                            <div class="column">
                              <InputElement type="email" placeholder="your-email-id@example.com" v-model="username" :help="usernameHelp.text" @submit="onSubmit">
                                <template v-slot:leftIcon>
                                  <FontAwesomeIcon icon="envelope"/>
                                </template>
                              </InputElement>
                              <InputElement type="password" placeholder="password" v-model="password" :help="passwordHelp.text" @submit="onSubmit">
                                <template v-slot:leftIcon>
                                  <FontAwesomeIcon icon="lock"/>
                                </template>
                              </InputElement>
                            </div>
                          </div>
                          <div class="columns basic-flex is-paddingless" v-if="currentTab === 0">
                            <div class="column" style="padding-top: 0">
                              <a style="font-size: 14px;" @click="currentTab = 2">Forgot password?</a>
                            </div>
                          </div>

                          <div class="columns basic-flex is-marginless" v-show="currentTab === 1">
                            <div class="column terms">
                              <span>By creating an account, you agree to our terms of service and privacy policy.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column forgot-password-container basic-flex is-paddingless" v-if="currentTab === 2" :key="currentContainer">
                <div class="columns">
                  <div class="column">
                    <p class="has-text-centered" style="margin: 16px; font-size: 14px;">Enter your email address. You will receive an email to reset your password.</p>
                    <InputElement type="email" placeholder="your-email-id@example.com" v-model="forgotEmail" :help="forgotEmailHelp.text" @submit="onSubmit">
                      <template v-slot:leftIcon>
                        <FontAwesomeIcon icon="envelope"/>
                      </template>
                    </InputElement>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <a class="submit-btn is-large is-fullwidth" :disabled="isSubmitting" :style="{'background-color': theme}" @click="onSubmit">
            <transition name="slide-from-bottom">
              <span v-if="!isSubmitting">
                {{ buttonText }}
                <span class="icon" v-if="!isSubmitting">
                  <i class="fab"><FontAwesomeIcon icon="chevron-right"/></i>
                </span>
              </span>
              <div v-else>
                <Spinner color="#cacaca" class="small" size="38px" style="vertical-align: middle;"/>
              </div>
            </transition>
          </a>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Spinner from './Spinner.vue'
import InputElement from './InputElement.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faLock, faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEnvelope)
library.add(faLock)
library.add(faChevronRight)
library.add(faArrowLeft)

const errors = {
  blank: {
    text: 'Cannot be blank',
    isBad (field) {
      if (field.trim().length > 0) {
        return false
      }
      return true
    }
  }
}

export default {
  name: 'LoginComponent',
  components: {
    Spinner,
    FontAwesomeIcon,
    InputElement
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    appName: {
      type: String,
      default: 'Login'
    },
    theme: {
      type: String,
      default: '#009688'
    },
    logo: {
      type: String,
      default: './assets/security_shield.png'
    }
  },
  data () {
    return {
      isBusy: false,
      isSubmitting: false,
      currentTab: 0,
      prevTab: 0,
      username: '',
      password: '',
      forgotEmail: '',
      usernameHelp: {},
      passwordHelp: {},
      forgotEmailHelp: {}
    }
  },
  computed: {
    buttonText () {
      switch (this.currentTab) {
        case 0:
          return 'LOG IN'
        case 1:
          return 'SIGN UP'
        case 2:
          return 'Send Email'
        default:
          return '???'
      }
    },
    currentContainer () {
      if (this.currentTab <= 1) {
        return 'login'
      }
      return 'forgot-password'
    }
  },
  watch: {
    currentTab (v, o) {
      this.prevTab = o
      this.resetAllHelp()
    },
    username (v) {
      this.testAndUpdate(v, 'usernameHelp')
    },
    password (v) {
      this.testAndUpdate(v, 'passwordHelp')
    },
    forgotEmail (v) {
      this.testAndUpdate(v, 'forgotEmailHelp')
    }
  },
  methods: {
    testAndUpdate (value, help) {
      if (this[help].isBad && !this[help].isBad(value)) {
        this[help] = {}
      }
    },
    onSubmit () {
      if (this.isSubmitting) {
        return
      }
      const { currentTab, username, password, forgotEmail } = this
      let hasError = false
      switch (currentTab) {
        case 0:
        case 1:
          if (username.trim() === '') {
            this.usernameHelp = errors.blank
            hasError = true
          }
          if (password.trim() === '') {
            this.passwordHelp = errors.blank
            hasError = true
          }
          break
        case 2:
          if (forgotEmail.trim() === '') {
            this.forgotEmailHelp = errors.blank
            hasError = true
          }
          break
      }
      if (hasError) {
        return
      }
      this.isSubmitting = true
      this.$emit('submit', {
        currentTab,
        username,
        password,
        forgotEmail
      })
    },
    resetAllHelp () {
      this.usernameHelp = {}
      this.passwordHelp = {}
      this.forgotEmailHelp = {}
    },
    afterExit () {
      this.$el.querySelector('.login-modal').classList.remove('is-active')
      this.$refs.bg.classList.remove('is-leaving')
    },
    onExit () {
      this.$refs.bg.classList.add('is-leaving')
    },
    onEnter () {
      this.$el.querySelector('.login-modal').classList.add('is-active')
    }
  }
}
</script>

<style lang="scss">
$container-width: 300px;
$banner-logo-height: 64px;
$banner-title-height: 36px;
$banner-padding: 8px;
$banner-container-height: ($banner-logo-height + $banner-title-height) + ($banner-padding * 3);

.tabs ul {
  border-bottom: none;
  a {
    margin: 0 0 -1px 0;
    padding: 8px 16px;
    font-size: 16px;
    box-sizing: content-box;
    font-weight: normal;
    height: 18px;
  }
}

.login-bulma {
  @import '../style/bulma-imports.scss';

  .login-modal {
    align-items: center;
    display: none;
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
      transition: all 0.5s ease-in-out;
      background-color: #000 !important;
      opacity: 0.75;
      &.is-leaving {
        background-color: inherit !important;
      }
    }
    &.is-active .modal-background {
      transition: all 0.5s ease-in-out;
      background-color: #2a2a2a;
    }
    .modal-content {
      width: auto;
      overflow: hidden;
      background-color: #fff;
      border-radius: 10px;
      min-width: $container-width;
      max-width: $container-width;
      min-height: 220px;
      max-height: 600px;
      .content-container {
        transition: all 0.3s ease-in-out;
      }
      transition: all 0.3s ease-in-out;
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
          background-color: inherit;
        }
        &.modal-close {
          right: 12px;
          top: 12px;
        }
        &.modal-back {
          left: 12px;
          top: 12px;
          border-radius: 290486px;
          /deep/ svg {
            width: 12px;
            height: 12px;
            vertical-align: bottom;
          }
        }
      }
      .banner-container {
        height: $banner-container-height;
        text-align: center;
        background-color: #dadada;
        .banner {
          display: inline-block;
          padding: $banner-padding 0 0 0;
          img {
            width: $banner-logo-height;
            height: $banner-logo-height;
          }
        }
        .banner-title {
          font-size: 22px;
        }
      }
      .login-container {
      }
      .login-content-container {
        .preloader-container {
          text-align: center;
          align-items: center;
          /deep/ .custom-spinner {
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
      &:not(:last-child) {
        margin-right: 8px;
      }
      img.social-btn {
        width: 40px;
        height: 40px;
        &:hover {
          filter: brightness(70%);
          transition: all 0.1s linear;
        }
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
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    text-align: center;
    justify-content: center;
    height: 64px;
    color: white;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    line-height: 64px;
    &[disabled] {
      cursor: default;
      background-color: #fff;
      border-color: #dbdbdb;
      box-shadow: none;
      opacity: 0.5;
    }
    .icon {
      font-size: inherit;
      line-height: inherit;
      height: inherit;
      margin-left: 0.4875em;
    }
  }
  .slide-from-bottom-enter-active, .slide-from-bottom-leave-active {
    transition: all .5s ease-in-out;
    transform: translateY(0%);
  }
  .slide-from-bottom-enter, .slide-from-bottom-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transition: all .5s ease-in-out;
    transform: translateY(200%);
  }

  .slide-out-left-enter-active, .slide-out-left-leave-active {
    transition: all .5s ease-in-out;
    transform: translateX(0%) ;
  }
  .slide-out-left-enter, .slide-out-left-leave-to {
    transition: all .5s ease-in-out;
    transform: translateX(-200%);
  }

  .slide-out-right-enter-active, .slide-out-right-leave-active {
    transition: all .5s ease-in-out;
    transform: translateX(0%);
  }
  .slide-out-right-enter, .slide-out-right-leave-to {
    transition: all .5s ease-in-out;
    transform: translateX(-200%);
  }
}
</style>
