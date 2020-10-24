<template>
  <div>
    <div
      v-for="(slice, j) in slices"
      ref="slices"
      :class="sliceClasses(slice)"
    >
      <component
        :is="getSliceComponentName(slice.slice_type)"
        :slice="slice"
        :current="currentSliceIndex === j"
      />    
    </div>
      
    <div class="captions container">
      <div class="row">
        <div class="primary-column">  
          <div class="medium" v-if="captions.medium" v-text="captions.medium" />
          <div class="small"  v-if="captions.small"  v-text="captions.small" />
          <div class="large"  v-if="captions.large"  v-text="captions.large" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import _get from 'lodash/get'
import _throttle from 'lodash/throttle'
import _clamp from 'lodash/clamp'
import _kebabCase from 'lodash/kebabCase'
import _camelCase from 'lodash/camelCase'
import _capitalize from 'lodash/capitalize'
import { stripTags } from '~/utils/tools'

import ExhibitedProjectSliceZoomImage from '~/components/exhibitedProject/ExhibitedProjectSliceZoomImage'
import ExhibitedProjectSliceImagePair from '~/components/exhibitedProject/ExhibitedProjectSliceImagePair'
import ExhibitedProjectSliceAccentImage from '~/components/exhibitedProject/ExhibitedProjectSliceAccentImage'
import ExhibitedProjectSliceImageGallery from '~/components/exhibitedProject/ExhibitedProjectSliceImageGallery'
import ExhibitedProjectSliceImageTextBox from '~/components/exhibitedProject/ExhibitedProjectSliceImageTextBox'
import ExhibitedProjectSliceTextBox from '~/components/exhibitedProject/ExhibitedProjectSliceTextBox'

export default {
  components: {
    ExhibitedProjectSliceZoomImage,
    ExhibitedProjectSliceImagePair,
    ExhibitedProjectSliceAccentImage,
    ExhibitedProjectSliceImageGallery,
    ExhibitedProjectSliceImageTextBox,
    ExhibitedProjectSliceTextBox
  },
  data() {
    return {
      title: '',
      slices: [],
      meta: {},
      triggerPointDistance: 0,
      currentSliceIndex: 0 // @TODO - Make this just currentSlice? {} instead of int?
    }
  },
  beforeCreate() {
    this.$store.commit('SET_THEME', 'light')
  },
  mounted() {
    this.$store.commit('SET_PAGE_TITLE_TITLE', this.title)

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
    sliceClasses(slice) {
      return [
        'exhibit-slice',
        _kebabCase(slice.slice_type)
      ]
    },
    getSliceComponentName(sliceType) {
      return `ExhibitedProjectSlice${sliceType.split('_').map(t => _capitalize(t)).join('')}` // 'zoom_image' => 'ExhibitedProjectSliceZoomImage'
    },
    setCurrentSlice() {
      const winH = window.innerHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const triggerPoint = scrollTop + (winH * 0.4) // Slice is ~40% on screen

      // Find the slice which straddles the triggerPoint of the screen
      const i = this.$refs.slices.findIndex(el => {
        const h = el.offsetHeight
        const top = el.offsetTop
        const bottom = top + h

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
  watch: {
    currentSliceIndex(newIndex, oldIndex) {
      this.$store.commit('SET_PAGE_TITLE_SUBTITLE', this.subtitle)
    }
  },
  computed: {
    currentSlice() {
      return this.slices[this.currentSliceIndex]
    },
    subtitle() {
      return this.$prismic.asText(_get(this.currentSlice, 'primary.slice_title', [])) || ''
    },
    captions() {
      return {
        small: this.$prismic.asText(_get(this.currentSlice, 'primary.small_caption', [])) || '',
        medium: this.$prismic.asText(_get(this.currentSlice, 'primary.medium_caption', [])) || '',
        large: this.$prismic.asText(_get(this.currentSlice, 'primary.large_caption', [])) || '',
      }
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
.exhibit-slice {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}

.captions {
  position: fixed;
  z-index: -1;
  bottom: 21px;
  left: 0;
  right: 0;
  pointer-events: none;
  text-align: center;
  font-weight: $font-weight-medium;

  @include bp-up(md) {
    bottom: 14px;
  }

  .small {
    line-height: 1; // Do we need?
    max-width: 31em;
    margin-left: auto;
    margin-right: auto;

    @include bp-down(md) {
      font-size: 13px;
    }
  }

  .medium {
    @include text-big;
  }

  .large {
    @include text-huge;
  }

  .medium + .small {
    margin-top: 3px;
  }

  .small + .large {
    margin-top: 32px;

    @include bp-up(md) {
      margin-top: 38px;
    }
  }
}
</style>