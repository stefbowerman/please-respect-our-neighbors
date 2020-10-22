<template>
  <div style="padding-top: 100px; margin-bottom: 100px;">
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <div class="block">
            <div
              class="text-field text-big"
              v-if="this.description.length"
              v-html="this.description"
            />
          </div>

          <div
            class="block"
            v-for="(slice, i) in slices"
          >
            <h3 v-text="$prismic.asText(slice.primary.block_title)" />
            <div class="text-big" v-html="$prismic.asHtml(slice.primary.block_content)"></div>
          </div>
        </div>
      </div>   
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import { stripTags } from '~/utils/tools'

export default {
  data() {
    return {
      title: '',
      description: '',
      meta: {},
      slices: []
    }
  },
  beforeCreate() {
    this.$store.commit('SET_THEME', 'light')
  },  
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', this.title)
    this.$store.commit('SET_HEADER_SUBTITLE', null)
  },
  async asyncData({ $prismic }) {
    const response = await $prismic.api.getSingle('about_page')
    const data = response.data

    const title = $prismic.asText(_get(data, 'title', []))
    const description = $prismic.asHtml(_get(data, 'description', []))
    const slices = _get(data, 'body', [])
    const meta = {
      title: $prismic.asText(_get(data, 'meta_title', [])),
      description: stripTags($prismic.asHtml(_get(data, 'meta_description', []))),
      imageUrl: _get(data, 'meta_image.url')
    }

    return {
      title,
      description,
      slices,
      meta
    }
  },
  head() {
    const meta = [
      {
        hid: 'description',
        name: 'description',
        content: stripTags(this.meta.description || this.description)
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
  },
}  
</script>

<style lang="scss" scoped>
.block {
  text-align: center;

  & + & {
    margin-top: 171px;
  }

  p + p {
    margin-top: 56px;
  }
}

.text-field {
  position: relative;
  border: 1px solid black;
  padding: 0 27px 25px 0;

  &:before {
    content: '';
    background-color: white;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 27px;
    bottom: 25px;
  }
}

h3 {
  @include text-huge;
  margin-bottom: 3px;
}

.text-big {
  font-weight: $font-weight-medium; // @TODO - Is this for all .text-big ?
}
</style>