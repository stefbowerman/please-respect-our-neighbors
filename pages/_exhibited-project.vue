<template>
  <div
    class="page page--light"
    :style="{ '--page-title-height': `${this.pageTitleHeight}px` }"
  >
    <div class="page-inner">
      <page-title
        :title="title"
        :subtitle="subtitle"
        @height-change="h => pageTitleHeight = h"
      />

      <exhibited-project-slice
        v-for="(slice, j) in slices"
        :key="j"
        :slice="slice"
        :current="currentSliceIndex === j"
        :page-title-height="pageTitleHeight"
        ref="slices"
      />
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import _throttle from 'lodash/throttle'
import _clamp from 'lodash/clamp'
import pageMixin from '~/mixins/page'
import { stripTags } from '~/utils/tools'

import PageTitle from '~/components/PageTitle'    
import ExhibitedProjectSlice from '~/components/exhibitedProject/Slice'

export default {
  components: {
    PageTitle,
    ExhibitedProjectSlice
  },
  mixins: [pageMixin],
  data() {
    return {
      title: '',
      slices: [],
      meta: {},
      currentSliceIndex: 0,
      pageTitleHeight: 0
    }
  },
  mounted() {
    this.setCurrentSlice()

    this.throttledOnScroll = _throttle(this.onScroll, 100)
    this.throttledOnResize = _throttle(this.onResize, 250)

    window.addEventListener('scroll', this.throttledOnScroll)
    window.addEventListener('resize', this.throttledOnResize)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.throttledOnScroll)
    window.removeEventListener('resize', this.throttledOnResize)
  },
  methods: {
    setCurrentSlice() {
      const triggerPoint = window.innerHeight * 0.4 // Slice is ~40% on screen

      // Find the slice which straddles the triggerPoint of the screen
      const i = this.$refs.slices.findIndex((slice, j) => {
        const { top, bottom } = slice.$el.getBoundingClientRect()

        return top < triggerPoint && bottom >= triggerPoint
      })

      // i can be -1 if none found
      this.currentSliceIndex = _clamp(i, 0, this.slices.length - 1)      
    },
    onResize() {
      this.setCurrentSlice()
    },
    onScroll() {
      this.setCurrentSlice()
    }
  },
  computed: {
    currentSlice() {
      return this.slices[this.currentSliceIndex]
    },
    subtitle() {
      return this.$prismic.asText(_get(this.currentSlice, 'primary.slice_title', [])) || ''
    }
  },
  async asyncData({ $prismic, store, route }) {
    // Could be rendering on pages/exhibited-project/_uid.vue
    const projectUID = Boolean(route.params.uid) ? route.params.uid : _get(store, 'state.siteSettings.exhibitedProjectUID', null)
    
    if (!projectUID) {
      // redirect?
      return
    }

    const response = await $prismic.api.getByUID('exhibited_project', projectUID)
    const data = response.data

    const title = $prismic.asText(_get(data, 'title', []))
    const slices = _get(data, 'body', [])
    const meta = {
      title: $prismic.asText(_get(data, 'meta_title', [])),
      description: stripTags($prismic.asHtml(_get(data, 'meta_description', []))),
      imageUrl: _get(data, 'meta_image.url')
    }

    return {
      title,
      slices,
      meta
    }
  },
  head() {
    const title = this.meta.title || this.title
    const meta = [
      {
        hid: 'title',
        property: 'og:title',
        content: title
      },    
      {
        hid: 'description',
        name: 'description',
        property: 'og:description',
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
      title,
      meta
    }
  }
}  
</script>

<style lang="scss" scoped>
.page-title {
  position: fixed;
  left: 0;
  right: 0;
}
</style>
