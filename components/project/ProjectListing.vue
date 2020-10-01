<template>
  <div class="project-listing" style="padding: 0 50px">
    <h4 v-text="$prismic.asText(project.title)" />
    <div v-html="$prismic.asHtml(project.description)" />
    <div v-if="project.slices.length">
      <div
        class="slice"
        v-for="(slice, i) in project.slices"
        :key="`slice-${i}`"
      >
        <h6 v-text="`${slice.slice_type} - ${sliceComponentName(slice)}`" style="border-top: 1px solid white; font-size: 16px; padding: 20px 0; margin-top: 40px; display: none !important"/>
          <!-- 
          <component
            :is="sliceComponentName(slice)"
            :slice="slice"
          />
        -->

        <template v-if="slice.slice_type === 'detail_gallery'">
          <div style="display: flex">
            <div v-for="item in slice.items">
              <prismic-image :field="item.image"/>
            </div>
          </div>

          <div class="caption" v-text="$prismic.asText(slice.primary.detail_title)" />          
        </template>
        <template v-else-if="slice.slice_type === 'detail_text'">
          <div style="border: 1px solid white; color: white; background-image: linear-gradient(0deg, #666, #111); padding: 30px;" v-html="$prismic.asHtml(slice.primary.detail_rich_text)" />
          <div class="caption" v-text="$prismic.asText(slice.primary.detail_title)" /> 
        </template>        
        <template v-else-if="slice.slice_type === 'detail_videos'">
          <div>
            <div v-for="item in slice.items">
              <span>{{ item.vimeo_url.url }}</span>
            </div>
            <div class="caption" v-text="$prismic.asText(slice.primary.detail_title)" /> 
          </div>
        </template>                
      </div>
    </div>
    <div v-if="project.partners.length" style="padding: 20px 0;">
      <h6>Partners</h6>
      <div>
        <p v-for="partner in project.partners">
          <nuxt-link :to="`/partners/${partner.uid}`" v-text="$prismic.asText(partner.name)" />
        </p>
      </div>
    </div>
    <nuxt-link :to="`/projects/${project.uid}`">Go To Project</nuxt-link>
  </div>  
</template>

<script>
import _kebabCase from 'lodash/kebabCase'

export default {
  props: {
    project: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  mounted() {
      this.project.slices.forEach((slice) => console.log(slice))
  },
  methods: {
    sliceComponentName(slice) {
      const name = `project-slice-${_kebabCase(slice.slice_type)}`
      console.log(name)
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.slice {
  margin: 40px 0;
}

.caption {
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 10px;
}
</style>