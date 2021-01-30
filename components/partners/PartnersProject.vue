<template>
  <span class="partners-project">
    <span class="main">
      <PartnersTitle
        :text="`${$prismic.asText(project.title)}.`"
        :url="projectPreviewUrl"
        :content="$prismic.asHtml(project.long_description)"
      />
      <span v-text="`${$prismic.asText(project.description).trim()}.`" />
      <span
        v-if="projectYear"
        v-text="projectYear"
      />
      <template
        v-for="(partner, j) in project.partners"
      >
        <PartnersTitle
          :text="$prismic.asText(partner.name)"
          :url="getPartnerUrl(partner)"
          :content="$prismic.asHtml(partner.bio)"
          :active="activePartnerUID === partner.uid"
          @mouseenter.native="$emit('partner-mouseenter', partner.uid)"
          @mouseleave.native="$emit('partner-mouseleave')"          
        /><span
          v-if="j === project.partners.length - 1"
          v-html="`.&nbsp;`"
        /><span
          v-else
          v-html="`,&nbsp;`"
        />        
      </template>
    </span>
    <span
      v-if="codedDetails"
      v-html="codedDetails"
    />
  </span>
</template>

<script>
import _get from 'lodash/get'
import { getUrl } from '~/utils/prismic'

import PartnersTitle from '~/components/partners/PartnersTitle'

export default {
  components: {
    PartnersTitle
  },
  props: {
    project: {
      type: Object,
      default: () => {}
    },
    activePartnerUID: {
      type: String,
      default: null
    }
  },
  computed: {
    projectYear() {
      if (!this.project.end_date && !this.project.start_date) return null

      const d = new Date(this.project.end_date || this.project.start_date)

      return `${d.getFullYear()}.`
    },
    projectPreviewUrl() {
      return getUrl(this.project.website_url)
    },
    codedDetails() {
      if (!this.project.body) return null

      const titles = this.project.body.map(detail => {
        const t = this.$prismic.asText(_get(detail, 'primary.detail_title', []))
        let truncated = t.split(' ').splice(0, 9).join(' ').trim() // Grab the first couple words 
            truncated = truncated.replace(/([.,\/#!$%\^&\*;:{}=\-_`~()\]\[])+$/g, "") // remove any trailing punctuation

        if (truncated.length) {
          truncated += '.'
        }

        return truncated
      })

      return `${titles.filter(Boolean).join('&nbsp;')}&nbsp;`
    }
  },
  methods: {
    getPartnerUrl({ website_url }) {
      return getUrl(website_url)
    }
  }
}
</script>

<style lang="scss" scoped>
.partners-project {
  span,
  ::v-deep span {
    margin-right: -0.07em; // Fix for adjacent span element gaps
  }
}
.main {
  font-weight: $font-weight-medium;
}
</style>
