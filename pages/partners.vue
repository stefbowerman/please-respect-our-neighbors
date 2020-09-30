<template>
  <div style="background-color: #FD5858">
    <div>CURRENT PARTNERS</div>
    <div>Including Collective members</div>
    <div v-for="partner in partners">
      <div v-text="$prismic.asText(partner.name)" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    partners: []
  },
  async asyncData({ $prismic, error }) {
    const data = await $prismic.api.query(
      $prismic.predicates.at('document.type', 'partner')
    )

    const partners = data.results.map(partner => partner.data)

    return {
      partners: partners
    }
  }
}
</script>