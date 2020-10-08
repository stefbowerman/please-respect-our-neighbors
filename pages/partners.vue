<template>
  <div>
    <div style="padding: 300px 100px 200px; text-transform: none;" class="text-big">
      <p><strong>A Black Letter to Nike. A semi manifesto written to Nike. 2020. Kendall Henderson, Bijan Berahimi.</strong> Collaborative starter doc — Inspired by the genuine group who came who started their careers involved with Nike. <strong>Undefeated. Website and e-commerce redesign. 2020. Kendall Henderson, Dinesh Dave.</strong> Undefeated semi initial correspondence, containing initial brief document and Asset plan. A Black Letter to Nike. A semi manifesto written to Nike. 2020. Kendall Henderson, Bijan Berahimi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.venenatis nec varius sed, congue ultrices turpis. Duis pulvinar quam vel diam cursus, sit amet mollis enim. <strong>A Black Letter to Nike. A semi manifesto written to Nike. 2020. Kendall Henderson, Bijan Berahimi.</strong> Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. A Black Letter to Nike. A semi manifesto written to Nike. 2020. Kendall henderson, Bijan Berahimi. Nulla viverra orci sapien, vitae laoreet neque posuere eget. A congue ultrices turpis. <strong>Commodo ac metus eget rhoncus. Duis ex mauris, venenatis nec varius sed, Duis. A Black Letter to Nike. A semi manifesto written to Nike. 2020. Kendall henderson, Bijan Berahimi.</strong> Nulla viverra orci sapien, vitae laoreet neque posuere eget. A congue ultrices turpis. Commodo ac metus eget rhoncus. Duis ex mauris, venenatis nec varius sed, congue ultrices turpis. Lorem ipsum dolor sit amet. A Black Letter to Nike. A semi manifesto written to Nike. 2020. Kendall henderson, Bijan Berahimi. commodo ac metus eget rhoncus.</p>
      


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

<style lang="scss" scoped>
.text-big {
  font-weight: $font-weight-light;

  strong {
    font-weight: $font-weight-medium;
  }  
}
</style>