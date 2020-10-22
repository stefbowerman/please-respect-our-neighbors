<template>
  <div class="container">
    <div class="wall">
      <partners-project
        v-for="(project, i) in projects"
        :key="`project-${i}`"
        :project="project"
        :activePartnerUID="activePartnerUID"
        @partner-click="onPartnerClick"
        @partner-mouseenter="onPartnerMouseenter"
        @partner-mouseleave="onPartnerMouseleave"
      />
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import { stripTags } from '~/utils/tools'

import PartnersProject from '~/components/PartnersProject'

export default {
  components: {
    PartnersProject
  },
  data() {
    return {
      title: '',
      subtitle: '',
      partners: [],
      activePartnerUID: null,
      meta: {}
    }
  },
  beforeCreate() {
    this.$store.commit('SET_THEME', 'red')
  },
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', this.title)
    this.$store.commit('SET_HEADER_SUBTITLE', this.subtitle)
  },
  methods: {
    onPartnerClick(partnerName) {
      console.log(`Clicked ${partnerName}`)
    },
    onPartnerMouseenter(partnerUID) {
      this.activePartnerUID = partnerUID
    },
    onPartnerMouseleave() {
      this.activePartnerUID = null
    }
  },
  async asyncData({ $prismic, error, store }) {
    const response = await $prismic.api.getSingle('partners_page')
    const data = response.data

    const title = $prismic.asText(_get(data, 'title', []))
    const subtitle = $prismic.asText(_get(data, 'subtitle', []))
    const meta = {
      title: $prismic.asText(_get(data, 'meta_title', [])),
      description: stripTags($prismic.asHtml(_get(data, 'meta_description', []))),
      imageUrl: _get(data, 'meta_image.url')
    }    

    return {
      title,
      subtitle,
      projects: store.state.projects,
      meta
    }
  },
  head() {
    const meta = [
      {
        hid: 'description',
        name: 'description',
        content: stripTags(this.meta.description)
      }
    ]

    if (this.meta.imageUrl) {
      meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: this.meta.imageUrl
      })
    }

    return {
      title: this.meta.title || this.title,
      meta
    }
  }
}
</script>

<style lang="scss" scoped>
.wall {
  padding-top: 200px;
  padding-bottom: 100px;

  @include text-big;
  font-weight: $font-weight-light;
  text-transform: none;

  @include bp-down(md) {
    font-size: 25px;
    line-height: (29px/25px);
  }

  @include bp-up(lg) {
    padding-top: 300px;
    padding-bottom: 200px;    
    padding-left: 20px;
    padding-right: 20px;    
  }
}
</style>