<template>
  <div>
    <page-header
      :title="'Current Partners'"
      :subtitle="'Including collective members'"
    />
    <div style="padding: 300px 100px 0; font-size: 78px; line-height: 1.02">
      <span v-for="partner in partners" v-html="`${$prismic.asText(partner.name)} &nbsp;`" />
    </div>
  </div>
</template>

<script>
import pageHeader from '~/components/page/PageHeader'

export default {
  components: {
    pageHeader
  },
  data() {
    partners: []
  },
  head() {
    return {
      title: 'Partners', // @TODO - Pull this from store / API
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Our studio is built of core and collective members'
        }
      ]
    }
  },
  async asyncData({ $prismic, error, store }) {
    return {
      partners: store.state.partners
    }
  }
}
</script>