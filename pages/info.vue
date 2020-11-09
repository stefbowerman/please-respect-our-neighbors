<template>
  <div class="page page-info">
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <div
            v-if="description.length"
            v-html="description"
            class="block block--description"
          />
          <div
            v-for="(slice, i) in slices"
            :class="[
              'block',
              `block--${getSliceType(slice.slice_type)}`
            ]"
          >
            <h3 class="block__title" v-text="$prismic.asText(slice.primary.block_title)" />
            <div class="block__content" v-html="$prismic.asHtml(slice.primary.block_content)"></div>
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
    this.$store.commit('SET_PAGE_TITLE_TITLE', this.title)
    this.$store.commit('SET_PAGE_TITLE_SUBTITLE', null)
  },
  methods: {
    getSliceType(sliceType) {
      return _kebabCase(sliceType).replace('-block', '')
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
.page-info {
  padding-top: 32px;
  margin-bottom: 100px;
  align-items: flex-start;

  @include bp-down(md) {
    min-height: none; // ?
  }

  @include bp-up(lg) {
    padding-top: 7.4vw;
  }
}

.block {
  font-weight: $font-weight-medium;
  text-align: center;
  word-break: break-word;

  & + & {
    margin-top: 61px;

    @include bp-up(lg) {
      margin-top: 11.8vw;
      margin-top: clamp(61px, 11.8vw, 200px)
    }
  }

  &--description,
  &--text,
  &--links {
    @include text-big;

    @include bp-down(md) {
      font-size: 18px;
      line-height: 22px;
    }
  }

  &--contact {
    // @TODO - Make this scale?
    @include text-large;

    @include bp-down(md) {
      font-size: 13px;
      line-height: 17px;
    }

    /deep/ p + p {
      margin-top: 16px;

      @include bp-up(lg) {
        margin-top: 58px;
        margin-top: 3vw;
      }
    }
  }

  &--text {
    /deep/ p + p {
      margin-top: 22px;

      @include bp-up(lg) {
        margin-top: 49px;
        margin-top: 2.5vw;
      }
    }
  }

  &--links {
    .block__title {
      @include bp-up(lg) {
        margin-bottom: 48px;
        margin-bottom: 2.5vw;
      }
    }
    
    /deep/ a {
      text-decoration: underline;
    }  
  }
}

.block__title {
  margin-bottom: 3px;
  @include text-huge;

  @include bp-down(md) {
    font-size: 27px;
    line-height: 25px;
  }
}

.block__content {

}
</style>
