<template>
  <span
    :class="[
      'partner-name',
      { 'active': active }
    ]"
  >
    <PartnersProjectLinkPreviewer
      v-if="previewUrl"
      :url="previewUrl"
      :text="$prismic.asText(partner.name)"
    />
    <span
      v-else
      v-text="$prismic.asText(partner.name)"
    />
  </span>
</template>

<script>
import PartnersProjectLinkPreviewer from '~/components/partners/PartnersProjectLinkPreviewer'

export default {
  components: {
    PartnersProjectLinkPreviewer
  },
  props: {
    partner: {
      type: Object,
      default: () => {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    previewUrl() {
      return this.partner.website_url && this.partner.website_url.link_type === 'Web' ? this.partner.website_url.url : null
    }
  }
}
</script>

<style lang="scss">
.partner-name {  
  &.active {
    color: $white;
  }
}
</style>