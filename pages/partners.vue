<template>
  <div class="page page--red">
    <div class="page-inner">
      <page-title
        :title="title"
        :subtitle="subtitle"
      />

      <div style="overflow: hidden;">
        <div class="container">
          <div class="wall">
            <partners-project
              v-for="(project, i) in projects"
              :key="`project-${i}`"
              :project="project"
              :activePartnerUID="activePartnerUID"
              @partner-mouseenter="uid => activePartnerUID = uid"
              @partner-mouseleave="activePartnerUID = null"
            />

            <div class="wall__footer">
              <span style="font-weight: 500">
                <PartnersPreviewer
                  text="Pleaserespectourneighbors.com"
                  url="https://pleaserespectourneighbors.com"
                />.
                Website development.
                <PartnersPreviewer
                  text="Stefan Bowerman"
                  url="https://stefanbowerman.com"
                />.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import { stripTags } from '~/utils/tools'
import pageMixin from '~/mixins/page'

import PageTitle from '~/components/PageTitle'
import PartnersProject from '~/components/partners/PartnersProject'
import PartnersPreviewer from '~/components/partners/PartnersPreviewer'

export default {
  components: {
    PageTitle,
    PartnersProject,
    PartnersPreviewer
  },
  mixins: [pageMixin],
  data() {
    return {
      title: '',
      subtitle: '',
      meta: {},
      activePartnerUID: null
    }
  },
  async asyncData({ $prismic, error, store }) {
    const response = await $prismic.api.getSingle('partners_page')
    const data = response.data

    const title = $prismic.asText(_get(data, 'title', []))
    const subtitle = $prismic.asText(_get(data, 'subtitle', []))
    const meta = {
      title: $prismic.asText(_get(data, 'meta_title', [])),
      description: stripTags($prismic.asHtml(_get(data, 'meta_description', []))),
      imageUrl: _get(data, 'meta_image.url')
    }

    return {
      title,
      subtitle,
      projects: store.state.projects,
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
.wall {
  padding-top: 100px;
  padding-bottom: 100px;

  @include text-big;
  font-weight: $font-weight-light;
  text-transform: none;

  @include bp-down(md) {
    font-size: 25px;
    line-height: (29/25);
  }

  @include bp-up(lg) {
    padding-top: 240px;
    padding-bottom: 200px;    
    padding-left: 20px;
    padding-right: 20px;    
  }

  @include bp-up(xxl) {
    padding-top: 190px;
  }

  .is-dragging & {
    user-select: none;
    pointer-events: none;
  }
}

.wall__footer {
  margin-top: 100px;

  .previewer {
    display: inline-block;
  } 
}
</style>