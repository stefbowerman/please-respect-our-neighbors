<template>
  <div>
    <page-header
      :title="'When a GOOD friend comes into view in a crowd of acquaintances.'"
    />
  </div>
</template>

<script>
import pageHeader from '~/components/page/PageHeader'

export default {
  components: {
    pageHeader
  },
  head() {
    return {
      title: 'Info', // @TODO - Pull this from store / API
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'When a GOOD friend comes into view in a crowd of acquaintances.'
        }
      ]
    }
  },
}  
</script>