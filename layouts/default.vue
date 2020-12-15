<template>
  <div>
    <site-mobile-menu
      :show="showMenu"
      @close="closeMenu"
      @link-click="onLinkClick"
    />

    <site-logo
      @click="toggleMenu"
    />
    <site-header />

    <main>
      <nuxt />
    </main>

    <site-footer
      :text="$store.state.siteSettings.footerText"
    />

    <portal-target name="overlays" multiple />
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import _throttle from 'lodash/throttle'
import _get from 'lodash/get'
import { decodeHtmlEntities, isTouch } from '~/utils/tools'

import SiteHeader from '~/components/Header'
import SiteLogo from '~/components/Logo'
import SiteFooter from '~/components/Footer'
import SiteMobileMenu from '~/components/MobileMenu'

export default {
  components: {
    SiteHeader,
    SiteLogo,
    SiteFooter,
    SiteMobileMenu
  },
  data() {
    return {
      showMenu: false,
      scrollTop: 0,
      scrollDirection: 'down'
    }
  },
  mounted() {
    this.$store.commit('SET_IS_TOUCH', isTouch())

    // Throttle common events
    window.addEventListener('resize', _throttle(this.onResize, 250))
    window.addEventListener('scroll', _throttle(this.onScroll, 16))

    // Trigger a resize and scroll to start, so data is correct on load
    this.onResize()
    this.onScroll()
  },
  methods: {
    set100vh() {
      const v = window.innerWidth <= 1024 ? `${window.innerHeight}px` : ''
      document.documentElement.style.setProperty('--unit-100vh', v)
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    closeMenu() {
      this.showMenu = false
    },
    onLinkClick(url) {   
      this.closeMenu()

      // The menu leave animation takes 750ms - waiting 450ms puts us 60% into the animation
      // which is enough time for the screen to mostly clear without the user feeling like they're waiting too long
      setTimeout(() => {
        this.$router.push(url)
      }, 450)      
    },
    onResize() {
      this.set100vh()
      this.$store.commit('SET_WINDOW_WIDTH', window.innerWidth)
    },
    onScroll() {
      const s = window.pageYOffset || document.documentElement.scrollTop

      this.scrollDirection = s > this.scrollTop ? 'down' : 'up'
      this.scrollTop = s
      this.set100vh();
    }
  },
  watch: {
    '$route.fullPath'(to, from) {
      this.closeMenu()
    }
  },  
  head() {
    const meta = [
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:title',
        content: this.$store.state.siteSettings.title
      },      
      {
        property: 'og:site_name',
        content: this.$store.state.siteSettings.title
      }
    ]

    if (this.$store.state.siteSettings.description) {
      meta.push({
        hid: 'description',
        name: 'description',
        property: 'og:description',
        content: this.$store.state.siteSettings.description
      })
    }   

    if (this.$store.state.siteSettings.imageUrl) {
      meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: this.$store.state.siteSettings.imageUrl
      })
    }

    const bodyClasses = [
      `route-${_kebabCase(this.$route.name)}`,
      `scrolling-${this.scrollDirection}`
    ]

    if (this.$store.state.theme) {
      bodyClasses.push(`theme-${_kebabCase(this.$store.state.theme)}`)
    }

    if (this.$store.state.overlayOpen) {
      bodyClasses.push('overlay-open') 
    }

    if (this.$store.state.mobileMenuOpen) {
      bodyClasses.push('mobile-menu-open') 
    }

    if (this.$store.state.isTouch) {
      bodyClasses.push('is-touch')  
    }

    if (this.$store.state.isDragging) {
      bodyClasses.push('is-dragging')
    }     

    const link = []
    const favicon = this.$store.state.siteSettings.faviconImage
    const touchIcon = this.$store.state.siteSettings.touchIcon

    if (favicon && favicon.url) {
      link.push({
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: _get(favicon, '["32x32"].url', favicon.url)
      })

      link.push({
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: _get(favicon, '["16x16"].url', favicon.url)
      })      
    }

    if (touchIcon.url || favicon.url) {
      link.push({
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: (touchIcon.url || _get(favicon, '["180x180"].url', favicon.url))
      }) 
    }

    return {
      htmlAttrs: {
          lang: 'en',
      },
      bodyAttrs: {
          class: bodyClasses
      },
      titleTemplate: (titleChunk) => {
        const title     = decodeHtmlEntities(titleChunk)
        const siteTitle = decodeHtmlEntities(this.$store.state.siteSettings.title)
        let output      = siteTitle

        if (title && siteTitle != title) {
          output = `${title} . ${siteTitle}`
        }

        return output.toUpperCase()
      },
      meta,
      link
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  position: fixed;
  z-index: $zindex-mobile-menu - 1;
  top: 15px;
  left: 0;
  right: 0;

  @include bp-up(lg) {
    display: none;
  }

  /deep/ .logo__text {
    @include theme-text;
  }  
}
</style>