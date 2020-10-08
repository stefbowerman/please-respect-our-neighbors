<template>
  <div>
    <div
      v-for="(slice, j) in slices"
      ref="slices"
      class="exhibit-slice"
    >
      <template v-if="slice.slice_type === 'image_text_box'">
        <div class="container">
          <div class="row">
            <div class="primary-column">
              <img
                :src="slice.primary.image.url"
                :alt="slice.primary.image.alt"
                style="width: 700px; margin: 0 auto; display: block;"
              />
            </div>
            <div class="secondary-column">
              <text-box
                :date="slice.primary.content_date"
                :content="$prismic.asHtml(slice.primary.content)"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'text_box'">
        <div class="container">
          <div style="max-width: 80%; margin: 0 auto">
            <text-box
              :date="slice.primary.content_date"
              :content="$prismic.asHtml(slice.primary.content)"
            />
          </div>
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'accent_image'">
        <div style="background-color: #FD5858; padding: 80px 0; flex: 1; display: flex; align-items: center;">
          <div class="container">
            <div class="row">
              <div class="primary-column gutter-less">
                <img :src="slice.primary.image.url" :alt="slice.primary.image.alt" style="position: relative; z-index: 11" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'image_gallery'">
        <div class="container" style="display: flex; justify-content: center">
          <div v-for="item in slice.items">
            <img :src="item.image.url" :alt="item.image.alt" />
          </div>
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'image_pair'">
        <div class="container">
          <div class="row">
            <div class="primary-column" style="text-align: center">
              <img :src="slice.primary.first_image.url" :alt="slice.primary.first_image.alt" />
            </div>
            <div class="secondary-column" style="text-align: center">
              <img :src="slice.primary.second_image.url" :alt="slice.primary.second_image.alt" />
            </div>   
          </div>
        </div>

        <div class="container">
          <div class="row">
            <div class="primary-column">
              <div style="font-family: 'Roboto'; text-align: center; margin-top: 30px; margin-bottom: 50px;">
                <p>Left:</p>
                <p v-text="$prismic.asText(slice.primary.first_image_caption)" />
                <p style="margin-top: 3rem;">Right:</p>
                <p v-text="$prismic.asText(slice.primary.second_image_caption)" />
              </div>              
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'zoom_image'">
        <div class="container" style="position: relative;">
          <img :src="slice.primary.main_image.url" :alt="slice.primary.main_image.alt" />
          <img :src="slice.primary.detail_image.url" :alt="slice.primary.detail_image.alt" style="position: absolute; top: 10%; right: 10%; max-width: 25%; border-radius: 50%;" />
        </div>
      </template>
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

import TextBox from '~/components/TextBox'

export default {
  components: {
    TextBox
  },
  data() {
    return {
      title: '',
      slices: [],
      triggerPointDistance: 0,
      currentSliceIndex: 0 // @TODO - Make this just currentSlice? {} instead of int?
    }
  },  
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', this.title)

    this.throttledOnScroll = _throttle(this.onScroll, 100)
    this.throttledOnResize = _throttle(this.onResize, 250)

    window.addEventListener('scroll', this.throttledOnScroll)
    window.addEventListener('resize', this.throttledOnResize)
  },
  beforeDestroy() {
    this.$store.commit('SET_HEADER_TITLE', '')
    this.$store.commit('SET_HEADER_SUBTITLE', )

    window.removeEventListener('scroll', this.throttledOnScroll)
    window.removeEventListener('resize', this.throttledOnResize)
  },
  methods: {
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
      this.$store.commit('SET_HEADER_SUBTITLE', this.subtitle)
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

    // console.log(response.data)

    const title = $prismic.asText(_get(response, 'data.title', []))
    const slices = _get(response, 'data.body', [])

    return {
      title,
      slices
    }
  },
  head() {
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

<style lang="scss" scoped>
.exhibit-slice {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}

.captions {
  position: fixed;
  bottom: 21px;
  left: 0;
  right: 0;
  pointer-events: none;
  text-align: center;
  font-weight: $font-weight-bold;

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
      font-weight: $font-weight-medium;
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