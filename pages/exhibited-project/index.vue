<template>
  <div style="margin-top: 200px;">
    <template v-if="slices.length">
      <div v-for="(slice, j) in slices" style="padding: 150px 0;">
        
        <template v-if="slice.slice_type === 'image_text_box'">
          <div class="container" style="display: flex; justify-content: space-around">
            <div style="flex: 1;">
              <img :src="slice.primary.image.url" :alt="slice.primary.image.alt" />
            </div>
            <div style="flex: 1;">
              <text-box
                  :date="slice.primary.content_date"
                  :content="$prismic.asHtml(slice.primary.content)"
              />
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
            <img :src="slice.primary.image.url" :alt="slice.primary.image.alt" style="position: relative;" />
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

    <div class="captions">
      <div class="medium">Medium CaptionMedium CaptionMedium Caption Medium Caption</div>
      <div class="small">Small Caption Small Caption Small Caption</div>
      <div class="large">Date or Additional</div>
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
      subtitleIndex: 0
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
  async asyncData({ $prismic, store }) {
    const projectID = _get(store, 'state.siteSettings.exhibitedProjectID', null)
    
    if (!projectID) {
      // redirect?
      return
    }

    const response = await $prismic.api.getByID(projectID)

    console.log(response.data)

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
// @TODO - How to extend the container?
// Make a fixed element and throw the container + primary column in there?
.captions {
  color: #FD25EB;
  position: fixed;
  bottom: 14px;
  left: 100px;
  width: 60%;
  text-align: center;

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