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
        <span
          v-html="`${$prismic.asText(partner.name)}`"
          :class="[
            'partner-name',
            { 'active': activePartnerUID === partner.uid }
          ]"
          @click="$emit('partner-click', $prismic.asText(partner.name))"
          @mouseenter="$emit('partner-mouseenter', partner.uid)"
          @mouseleave="$emit('partner-mouseleave')"
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

import PartnersProjectLinkPreviewer from '~/components/PartnersProjectLinkPreviewer'

export default {
  components: {
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
  },
  methods: {
    onProjectTitleMouseenter() {
      if (this.project.website_url && this.project.website_url.link_type === 'Web') {
        console.log(`trigger preview for ${this.project.website_url.url}`)
      }
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

.partner-name {
  cursor: pointer;
  
  &.active {
    color: $white;
  }
}
</style>
