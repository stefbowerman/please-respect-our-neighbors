<template>
  <div>
    <div class="logo">
      <span @click="toggleMenu">Please Respect Our Neighbors INC.</span>
    </div>

    <site-header />
    <site-mobile-menu
      :show="showMenu"
      @close="closeMenu"
      @link-click="linkClick"
    />

    <main>
      <nuxt />
    </main>

    <site-footer
      :text="'(C) 2020 PRON'"
    />

    <portal-target name="overlays" multiple />
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import _throttle from 'lodash/throttle'
import { decodeHtmlEntities } from '~/utils/tools'

import SiteHeader from '~/components/Header'
import SiteFooter from '~/components/Footer'
import SiteMobileMenu from '~/components/MobileMenu'

export default {
  components: {
    SiteHeader,
    SiteFooter,
    SiteMobileMenu
  },
  data() {
    return {
      showMenu: false
    }
  },
  mounted() {
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
      console.log(uri)
      this.$router.push(uri)
    }
  },
  watch: {
    '$route'(to, from) {
        this.showMenu = false              
    }
  },  
  head() {
    const meta = [
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:site_name",
        content: this.$store.state.siteSettings.title
      }
    ]

    if (this.$store.state.siteSettings.description) {
      meta.push({
          hid: "description",
          name: "description",
          property: "og:description",
          content: this.$store.state.siteSettings.description
      })
    }   

    if (this.$store.state.siteSettings.imageURL) {
      meta.push({
        hid: "og:image",
        property: "og:image",
        content: this.$store.state.siteSettings.imageURL
      })
    }

    const bodyClasses = [
      `route-${_kebabCase(this.$route.name)}`
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

    return {
      htmlAttrs: {
          lang: "en",
      },
      bodyAttrs: {
          class: bodyClasses
      },
      titleTemplate: (titleChunk) => {
        const title     = decodeHtmlEntities(titleChunk)
        const siteTitle = decodeHtmlEntities(this.$store.state.siteSettings.title)
        let output      = siteTitle

        if (title && siteTitle != title) {
          output = `${title} - ${siteTitle}`
        }

        return output
      },
      meta: meta
    }
  },  
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