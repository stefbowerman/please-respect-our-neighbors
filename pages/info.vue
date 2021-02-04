<template>
  <div class="page page--info">
    <div class="page-inner">
      <page-title
        :title="title"
        :highlighter-enabled="true"
      />

      <div class="container">
        <div class="row">
          <div class="primary-column">
            <info-block
              v-if="description.length"
              :content="description"
              type="description"
            />

            <info-block
              v-for="(slice, i) in slices"
              :key="i"
              :type="slice.slice_type"
              :title="$prismic.asText(slice.primary.block_title)"
              :content="$prismic.asHtml(slice.primary.block_content)"
            />
          </div>
        </div>   
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import _kebabCase from 'lodash/kebabCase'
import { stripTags } from '~/utils/tools'
import pageMixin from '~/mixins/page'

import PageTitle from '~/components/PageTitle'
import InfoBlock from '~/components/InfoBlock'

export default {
  components: {
    PageTitle,
    InfoBlock
  },
  mixins: [pageMixin],
  data() {
    return {
      title: '',
      description: '',
      meta: {},
      slices: []
    }
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
      title,
      meta
    }
  },
}  
</script>

<style lang="scss" scoped>
.page-title {
  z-index: 1; // So the highlighter functionality works
}

.block {
  margin-top: 61px;

  @include bp-up(lg) {
    margin-top: 11.8vw;
    margin-top: clamp(61px, 11.8vw, 200px)
  }
}
</style>
