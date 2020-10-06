<template>
  <div>
    <div class="exhibit-slice">
      
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'

const SUBTITLES = ['Workplace Process', 'Collaborative Starter Doc', 'Social Media ready Envelope', 'Business Reply Envelopes']

export default {
  data() {
    return {
      title: '',
      subtitle: 'Workplace Process'
    }
  },  
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', 'A Black Letter To Nike')
    this.$store.commit('SET_HEADER_SUBTITLE', this.subtitle)
  },
  beforeDestroy() {
    this.$store.commit('SET_HEADER_TITLE', '')
    this.$store.commit('SET_HEADER_SUBTITLE', )    
  },
  async asyncData({ $prismic, params }) {
    const response = await $prismic.api.getByUID('exhibited_project', params.uid)

    const title = $prismic.asText(_get(response, 'data.title', []))

    return {
      title
    }
  },
  head() {
    console.log(`title -- ${this.title}`) // @TODO - Why isn't this workin? :(
    return {
      title: this.title,
      meta: [
        // {
        //   hid: 'description',
        //   name: 'description',
        //   content: 'Our studio is built of core and collective members'
        // }
      ]
    }
  }
}  
</script>