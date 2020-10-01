<template>
  <div>
    <navigation />

    <main>
      <nuxt />
    </main>

    <div class="copyright" v-text="'(C) 2020 PRON'" />
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import { decodeHtmlEntities } from '~/utils/tools'

import Navigation from '~/components/Navigation'

export default {
  components: {
    Navigation
  },
  head() {
    return {
      htmlAttrs: {
          lang: "en",
      },
      bodyAttrs: {
          class: `route-${_kebabCase(this.$route.name)}`
      },
      titleTemplate: (titleChunk) => {
        const title     = decodeHtmlEntities(titleChunk)
        const siteTitle = decodeHtmlEntities(this.$store.state.siteSettings.title)
        let output      = siteTitle

        if (title && siteTitle != title) {
          output = `${siteTitle} - ${title}`
        }

        return output
      },
      meta: [
        {
          hid: "description",
          name: "description",
          property: "og:description",
          content: this.$store.state.siteSettings.description,
        },
        // {
        //     hid: "og:image",
        //     property: "og:image",
        //     content: this.$store.state.siteMeta.themeScreenshotUrl,
        // },
        // {
        //     property: "og:url",
        //     content: `${this.$store.state.siteMeta.frontendUrl}${this.$route.path}`,
        // },
        {
          property: "og:site_name",
          content: this.$store.state.siteSettings.title,
        },
        {
          property: "og:type",
          content: "website",
        },
      ],
    }
  },  
}
</script>

<style lang="scss">
.copyright {
  position: fixed;
  bottom: 30px;
  right: 30px;
  text-transform: uppercase;
  font-weight: bold;
  font-family: $font-family-secondary;
}
</style>