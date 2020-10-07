<template>
  <div class="project">
    <div
      v-if="project.slices.length"
      class="project-previewer"
    >
      <project-preview
        v-for="(slice, i) in project.slices"
        :slice="slice"
        :key="`slice-${i}`"
        @click="projectPreviewClick(i)"
        @mouseenter="hoveredSliceIndex = i"
        @mouseleave="hoveredSliceIndex = -1"
      />
    </div>

    <!-- This goes behind the preview -->
    <div class="project-description">
      <div
        class="project-description__text"
        v-html="$prismic.asHtml(project.description)"
      />
    </div>    

    <!-- These need to go beneath each slice? -->
    <div class="captions">
      <div
        class="caption"
        v-for="(slice, k) in project.slices"
        v-show="k === hoveredSliceIndex"
      >
        <div
          v-if="slice.slice_type === 'detail_gallery' || slice.slice_type === 'detail_videos'"
          v-text="`1/${slice.items.length}`"
        />
        <span v-text="$prismic.asText(slice.primary.detail_title)" />
      </div>
    </div>    

    <!--
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

    <nuxt-link :to="`/projects/${project.uid}`" style="display: none !important;">Go To Project</nuxt-link>
    -->

    <portal to="overlays">
      <project-overlay
        v-for="(slice, j) in project.slices"
        @close="projectOverlayClose"
        :key="`project-overlay-${project.uid}-${j}`"
        :show="j == selectedSliceIndex"
        :slice="slice"
      />
    </portal>
  </div>  
</template>

<script>
import _kebabCase from 'lodash/kebabCase'

import projectPreview from '~/components/project/ProjectPreview'
import projectOverlay from '~/components/project/ProjectOverlay'

export default {
  components: {
    projectPreview,
    projectOverlay
  },
  props: {
    project: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      hoveredSliceIndex: -1,
      selectedSliceIndex: -1
    }
  },
  mounted() {
    console.log(this.project)
  },
  methods: {
    // sliceComponentName(slice) {
    //   const name = `project-slice-${_kebabCase(slice.slice_type)}`
    //   console.log(name)
    //   return name
    // },
    projectPreviewClick(i) {
      // console.log('clicked!')
      // console.log(i)
      this.selectedSliceIndex = i
    },
    projectOverlayClose() {
      // console.log('closed preview')
      this.selectedSliceIndex = -1
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  height: 100vh;
  min-height: 500px;
  max-height: 1500px;
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
  font-style: italic;

  &__text {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 50px;
  }
}

.project-previewer {
  display: flex;
  width: 100%;
  height: 100%;

  .project-preview {
    flex: 1;
  }
}

// This is all trash, get using it to get the idea
.captions {
  margin-top: 10px;
  padding: 30px;
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.caption {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  font-style: italic;
}
</style>