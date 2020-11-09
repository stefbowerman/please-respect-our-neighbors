<template>
  <div>
    <site-mobile-menu
      :show="showMenu"
      @close="closeMenu"
      @link-click="linkClick"
    />

    <div class="logo">
      <span @click="toggleMenu">Please Respect Our Neighbors INC.</span>
    </div>

    <site-header />
    <site-page-title />

    <main>
      <nuxt />
    </main>

    <site-footer
      :text="$store.state.siteSettings.footerText"
    />
    <site-background />
    
    <portal-target name="overlays" multiple />
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import _throttle from 'lodash/throttle'
import _get from 'lodash/get'
import { decodeHtmlEntities, isTouch } from '~/utils/tools'

import SiteHeader from '~/components/Header'
import SitePageTitle from '~/components/PageTitle'
import SiteFooter from '~/components/Footer'
import SiteMobileMenu from '~/components/MobileMenu'
import SiteBackground from '~/components/Background'

export default {
  components: {
    SiteHeader,
    SitePageTitle,
    SiteFooter,
    SiteMobileMenu,
    SiteBackground
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
    onResize() {
      this.set100vh();
    },
    onScroll() {
      const s = window.pageYOffset || document.documentElement.scrollTop

      this.scrollDirection = s > this.scrollTop ? 'down' : 'up'
      this.scrollTop = s
      this.set100vh();
    },
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
    linkClick(uri) {
      this.showMenu = false
      this.$router.push(uri)
    }
  },
  watch: {
    '$route'(to, from) {
        this.showMenu = false              
    },
    '$store.state.pageTitle.height'(height) {
      document.documentElement.style.setProperty('--page-title-height', `${height}px`)
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

<style lang="scss">
.logo {
  position: fixed;
  z-index: $zindex-mobile-menu + 1;
  top: 15px;
  left: 0;
  right: 0;
  text-align: center;

  span {
    font-size: 18px;
    font-family: $font-family-secondary;
    font-weight: $font-weight-bold;
    @include theme-text;
    cursor: pointer;    
  }

  @include bp-up(lg) {
    display: none;
  }

  transition: transform 0.6s cubic-bezier(0.4, 0.13, 0.25, 0.99);
  body.mobile-menu-open & {
    transform: translateY(90vh);
  }
}
</style>