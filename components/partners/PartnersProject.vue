<template>
  <span class="partners-project">
    <span class="main">
      <PartnersProjectLinkPreviewer
        v-if="projectPreviewUrl"
        :url="projectPreviewUrl"
        :text="`${$prismic.asText(project.title)}.`"
      />
      <span
        v-else
        v-text="`${$prismic.asText(project.title)}.`"
      />

      <span v-text="`${$prismic.asText(project.description)}.`" />
      <span
        v-if="projectYear"
        v-text="projectYear"
      />
      <template
        v-for="(partner, j) in project.partners"
      >
        <PartnersProjectPartnerName
          :partner="partner"
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
    <span class="sub">
      <span
        v-if="detailTitles.length"
        v-for="title in detailTitles"
        v-html="`${title}&nbsp;`"
      />
    </span>
  </span>
</template>

<script>
import _get from 'lodash/get'

import PartnersProjectPartnerName from '~/components/partners/PartnersProjectPartnerName'
import PartnersProjectLinkPreviewer from '~/components/partners/PartnersProjectLinkPreviewer'

export default {
  components: {
    PartnersProjectPartnerName,
    PartnersProjectLinkPreviewer
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
      return this.project.website_url && this.project.website_url.link_type === 'Web' ? this.project.website_url.url : null
    },
    detailTitles() {
      if (!this.project.body) return []

      return this.project.body.map(detail => {
        return this.$prismic.asText(_get(detail, 'primary.detail_title', []))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  font-weight: $font-weight-medium;
}

.sub {

}
</style>