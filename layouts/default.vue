<template>
  <div>
    <navigation />

    <main>
      <nuxt />
    </main>

    <site-footer
      :text="'(C) 2020 PRON'"
    />
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import { decodeHtmlEntities } from '~/utils/tools'

import Navigation from '~/components/Navigation'
import SiteFooter from '~/components/Footer'

export default {
  components: {
    Navigation,
    SiteFooter
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
          output = `${title} - ${siteTitle}`
        }

        return output
      },
      meta: meta
    }
  },  
}
</script>