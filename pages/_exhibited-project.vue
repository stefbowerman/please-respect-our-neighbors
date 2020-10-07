<template>
  <div style="margin-top: 200px;">
    <div
      v-for="(slice, j) in slices"
      ref="slices"
      style="padding: 150px 0;"
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
        <div style="background-color: #FD5858; min-height: 100vh; padding: 80px 0; display: flex; align-items: center;">
          <img :src="slice.primary.image.url" :alt="slice.primary.image.alt" style="position: relative; z-index: 11" />
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
        <div class="container" style="display: flex; justify-content: space-around">
          <img :src="slice.primary.first_image.url" :alt="slice.primary.first_image.alt" />
          <img :src="slice.primary.second_image.url" :alt="slice.primary.second_image.alt" />
        </div>

        <div class="container" style="max-width: 60%; text-align: center; margin-top: 200px; margin-bottom: 50px;">
          <p>Left:</p>
          <p v-text="$prismic.asText(slice.primary.first_image_caption)" />
          <p>Right:</p>
          <p v-text="$prismic.asText(slice.primary.second_image_caption)" />
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'zoom_image'">
        <div class="container" style="position: relative;">
          <img :src="slice.primary.main_image.url" :alt="slice.primary.main_image.alt" />
          <img :src="slice.primary.detail_image.url" :alt="slice.primary.detail_image.alt" style="position: absolute; top: 10%; right: 10%; max-width: 25%; border-radius: 50%;" />
        </div>
      </template>

      <!-- This is the text that gets set as the page subtitle -->
      <div class="container">
        <h4 v-text="$prismic.asText(slice.primary.slice_title)" />
      </div>
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
      currentSliceIndex: 0 // @TODO - Make this just currentSlice? {} instead of int?
    }
  },  
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', this.title)

    this.throttledOnScroll = _throttle(this.onScroll, 100)
    window.addEventListener('scroll', this.throttledOnScroll)
  },
  beforeDestroy() {
    this.$store.commit('SET_HEADER_TITLE', '')
    this.$store.commit('SET_HEADER_SUBTITLE', )
    window.removeEventListener('scroll', this.throttledOnScroll)
  },
  methods: {
    onScroll() {
      const winH = window.innerHeight
      const scrollTop = window.scrollY // || document.scroll position or somethig?
      const midPoint  = scrollTop + winH/2

      // Find the slice which straddles the midpoint of the screen
      const i = this.$refs.slices.findIndex(el => {
        const h = el.offsetHeight
        const top = el.offsetTop
        const bottom = top + h

        return top < midPoint && bottom >= midPoint
      })

      // i can be -1 if none found
      this.currentSliceIndex = _clamp(i, 0, this.slices.length - 1)
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
.captions {
  position: fixed;
  bottom: 14px;
  left: 0;
  right: 0;
  pointer-events: none;
  text-align: center;
  font-weight: $font-weight-bold;

  .small {
    line-height: 1; // Do we need?
    max-width: 31em;
    margin-left: auto;
    margin-right: auto;
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
    margin-top: 38px;
  }
}
</style>