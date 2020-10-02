<template>
  <div class="project-listing" style="padding: 0 50px">
    <h4 v-text="$prismic.asText(project.title)" v-if="false" />
    
    <div
      v-if="project.slices.length"
      class="project-previewer"
    >
      <project-preview
        v-for="(slice, i) in project.slices"
        :slice="slice"
        :key="`slice-${i}`"
      />      
    </div>

    <div class="project-description">
      <div
        class="project-description__text"
        v-html="$prismic.asHtml(project.description)"
      />
    </div>

    <div v-if="false">
      <div v-if="project.partners.length" style="padding: 20px 0;">
        <h6>Partners</h6>
        <div>
          <p v-for="partner in project.partners">
            <nuxt-link :to="`/partners/${partner.uid}`" v-text="$prismic.asText(partner.name)" />
          </p>
        </div>
      </div>
    </div>
    <nuxt-link :to="`/projects/${project.uid}`">Go To Project</nuxt-link>
  </div>  
</template>

<script>
import _kebabCase from 'lodash/kebabCase'

import projectPreview from '~/components/project/ProjectPreview'

export default {
  components: {
    projectPreview
  },
  props: {
    project: {
      type: Object,
      required: true,
      default: () => {}
    }
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
.project-listing {
  height: 100vh;
  min-height: 500px;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.project-description {
  position: absolute;
  z-index: -1;
  top: 50%;
  left:0;
  right: 0;
  text-align: center;
  transform: translateY(-50%);
  pointer-events: none;

  // @TODO - Create text styles out of these things
  text-transform: uppercase;
  font-size: 21px;
  line-height: 25px;

  &__text {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 50px;
  }

  // Do this with component prop?
  .project-listing:hover & {
    z-index: 1;
  }
}

.project-previewer {
  display: flex;
  width: 100%;
  margin: 40px 0;

  .project-preview {
    flex: 1;
    margin: 0 50px;
  }
}
</style>