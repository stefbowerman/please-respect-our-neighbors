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

export default {
  data() {
    return {
      title: '',
      description: '',
      slices: []
    }
  },
  // @TODO - Do this in before create?
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', this.title)
    this.$store.commit('SET_HEADER_SUBTITLE', null)
  },
  async asyncData({ $prismic }) {
    const response = await $prismic.api.getSingle('about_page')

    const title = $prismic.asText(_get(response, 'data.title', []))
    const description = $prismic.asHtml(_get(response, 'data.description', []))
    const slices = _get(response, 'data.body', [])

    return {
      title,
      description,
      slices
    }
  },
  head() {
    return {
      title: 'Info', // @TODO - Pull this from store / API?  Do we need SEO title?
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'When a GOOD friend comes into view in a crowd of acquaintances.'
        }
      ]
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