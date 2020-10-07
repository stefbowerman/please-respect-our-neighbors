<template>
  <div style="margin-top: 200px;">
    <template v-if="slices.length">
      <div v-for="(slice, j) in slices" style="padding: 150px 0;">
        
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
          <div class="container" style="margin: 0 150px;">
            <text-box
                :date="slice.primary.content_date"
                :content="$prismic.asHtml(slice.primary.content)"
              />
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
            <img :src="slice.primary.detail_image.url" :alt="slice.primary.detail_image.alt" style="position: absolute; top: 10%; right: 10%; max-width: 25%;" />
          </div>
        </template>

        <!-- This is the text that gets set as the page subtitle -->
        <div class="container"><h4 v-text="$prismic.asText(slice.primary.slice_title)" /></div>
      </div>
    </template>

    <div class="captions container">
      <div class="row">
        <div class="primary-column">      
          <div class="medium" v-text="captions.medium" />
          <div class="small" v-text="captions.small" />
          <div class="large" v-text="captions.large" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'

import textBox from '~/components/TextBox'

const SUBTITLES = ['Workplace Process', 'Collaborative Starter Doc', 'Social Media ready Envelope', 'Business Reply Envelopes']

export default {
  components: {
    textBox
  },
  data() {
    return {
      title: '',
      slices: [],

      //
      subtitle: 'Workplace Process',
      subtitleIndex: 0,

      captions: {
        small: 'Small Caption Small Caption Small Caption',
        medium: 'Medium CaptionMedium CaptionMedium Caption Medium Caption',
        large: 'Date or Additional'
      }
    }
  },  
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', this.title)
    this.$store.commit('SET_HEADER_SUBTITLE', this.subtitle)
    this.interval = setInterval(this.setSubtitle, 5e3)
  },
  beforeDestroy() {
    this.$store.commit('SET_HEADER_TITLE', '')
    this.$store.commit('SET_HEADER_SUBTITLE', )    
    clearInterval(this.interval)
  },
  methods: {
    setSubtitle() {
      this.subtitleIndex++

      if (this.subtitleIndex > SUBTITLES.length - 1) {
        this.subtitleIndex = 0
      }
      
      this.subtitle = SUBTITLES[this.subtitleIndex]
      this.$store.commit('SET_HEADER_SUBTITLE', this.subtitle)
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
  color: #FD25EB;
  position: fixed;
  bottom: 14px;
  left: 0;
  right: 0;
  pointer-events: none;
  text-align: center;
  font-weight: $font-weight-bold;

  .small {
    line-height: 1; // Do we need?
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