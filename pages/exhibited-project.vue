<template>
  <div>
    <page-header
      :title="'A Black Letter To Nike'"
      :subtitle="subtitle"
    />
  </div>
</template>

<script>
import pageHeader from '~/components/page/PageHeader'

const SUBTITLES = ['Workplace Process', 'Collaborative Starter Doc', 'Social Media ready Envelope', 'Business Reply Envelopes']

export default {
  components: {
    pageHeader
  },
  data() {
    return {
      subtitle: 'Workplace Process',
      subtitleIndex: 0
    }
  },
  mounted() {
    this.interval = setInterval(this.setSubtitle, 5e3)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    setSubtitle() {
      this.subtitleIndex++

      if (this.subtitleIndex > SUBTITLES.length - 1) {
        this.subtitleIndex = 0
      }
      
      this.subtitle = SUBTITLES[this.subtitleIndex]
    }
  }
}  
</script>