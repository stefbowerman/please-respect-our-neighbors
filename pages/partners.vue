<template>
  <div>
    <div style="padding: 300px 100px 0; text-transform: none;" class="text-big">
      <span v-for="partner in partners" v-html="`${$prismic.asText(partner.name)} &nbsp;`" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    partners: []
  },
  // Is there a way to do this with a mixin?  Mounted calls setTheme, beforeDestroy called unsetTheme?
  // Also, do the theme stuff beforeCreate?  How early can we run it?
  mounted() {
    this.$store.commit('SET_THEME', 'red')
    this.$store.commit('SET_HEADER_TITLE', 'Current Partners')
    this.$store.commit('SET_HEADER_SUBTITLE', 'Including collective members')
  },
  beforeDestroy() {
    this.$store.commit('SET_THEME', '')
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