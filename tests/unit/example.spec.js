import { shallowMount } from '@vue/test-utils'
import LoginComponent from '@/components/LoginComponent.vue'

describe('LoginComponent.vue', () => {
  test('renders logo when passed', () => {
    const logo = 'https://github.com/FusionAuth/fusionauth-site/blob/master/assets/img/apple-touch-icon-120x120.png?raw=true'
    const wrapper = shallowMount(LoginComponent, {
      propsData: {
        show: true,
        logo
      }
    })
    expect(wrapper.element.querySelector('.banner img').src).toEqual(logo)
  })

  test('renders appName when passed', () => {
    const appName = 'Test'
    const wrapper = shallowMount(LoginComponent, {
      propsData: {
        show: true,
        appName
      }
    })
    expect(wrapper.element.querySelector('.banner-title').innerHTML).toEqual(appName)
  })

  describe('Theme', () => {

  })
})
