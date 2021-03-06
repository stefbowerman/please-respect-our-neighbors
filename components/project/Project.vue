<template>
  <div
    :class="[
      'project',
      { 'is-introduced': isIntroduced },
      { 'is-highlighted': isHighlighted },
      { 'is-ready': isReady }
    ]"
    v-intersection-observer="{
      threshold: 0.2
    }"
    @has-intersected="onHasIntersected"
  >
    <div
      class="project-preview-wrapper"
      @mouseenter="$emit('interaction')"
    >
      <div
        class="project-preview-overflow"
        @click="onProjectPreviewOverflowClick"
        ref="preview-overflow"
      >
        <div
          v-if="slices.length"
          class="project-previewer"
          :style="previewerStyle"
        >
          <project-preview
            v-for="(slice, i) in slices"
            :slice="slice"
            :key="`slice-${i}`"
            :active="activeSliceIndex === i"
            :inactive="activeSliceIndex > -1 && activeSliceIndex !== i"
            :highlighted="isHighlighted"
            :introduced="isIntroduced"
            :random-style="true"
            :max-padding-percentage="maxPaddingPercentage"
            @click="onProjectPreviewClick(i)"
            @mouseenter="onProjectPreviewMouseenter(i)"
          />
        </div>
      </div>

      <!-- This goes behind the previewer -->
      <div
        class="project-preview__bottom-layer"
        @click="onProjectPreviewBottomLayerClick"
      >
        <div class="project-description">
          <div
            class="project-description__text"
            v-html="fullDescription"
          />
        </div>
      </div>

      <!-- This goes on top of the previewer and only shows on highlight -->
      <div
        class="project-preview__top-layer"
        @click="onProjectPreviewTopLayerClick"
      >
        <div class="project-description">
          <div
            class="project-description__text"
            v-html="fullDescription"
          />
        </div>
      </div>      
    </div>

    <CaptionSwitcher
      :captions="captions"
      :active-index="activeSliceIndex"
    />    

    <portal to="overlays">
      <ProjectOverlay
        :show="selectedSliceIndex > -1"
        :slices="slices"
        :selected-slice-index="selectedSliceIndex"
        @slide-change-start="onOverlaySlideChangeStart"
        @enter="$emit('overlay-enter')"
        @leave="$emit('overlay-leave')"
        @close="onOverlayClose"
      />
    </portal>
  </div>  
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import _clamp from 'lodash/clamp'
import _get from 'lodash/get'

import { MONTHS } from '~/utils/constants'

import ProjectPreview from '~/components/project/ProjectPreview'
import ProjectOverlay from '~/components/project/ProjectOverlay'
import CaptionSwitcher from '~/components/CaptionSwitcher'

export default {
  components: {
    ProjectPreview,
    ProjectOverlay,
    CaptionSwitcher
  },
  props: {
    project: {
      type: Object,
      required: true,
      default: () => {}
    },
    interacting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeSliceIndex: -1,
      selectedSliceIndex: -1,
      captionsHeight: 0,
      previewerWidth: 0,
      isReady: false,
      isIntroduced: false,
      isIntroductionComplete: false,
      isHighlighted: false
    }
  },
  mounted() {
    this.onResize()
  },
  computed: {
    slices() {
      return this.project.slices || []
    },
    captions() {
      return this.slices.map(slice => this.$prismic.asHtml(_get(slice, 'primary.detail_title', [])))
    },
    maxPaddingPercentage() {
      // As we have *more* slices, we need to reduce the max padding percentage
      return _clamp(2, 12 - this.slices.length, 8)
    },
    fullDescription() {
      const title = this.$prismic.asText(this.project.title)
      const desc = this.$prismic.asText(this.project.description)
      const partners = this.project.partners.map(p => this.$prismic.asText(p.name)).join(', ')
      const dates = [];

      if (this.project.start_date) {
        dates.push(`Initiated ${this.formatDate(this.project.start_date)}`)
      }

      if (this.project.end_date) {
        dates.push(`Completed ${this.formatDate(this.project.end_date)}`)
      }
      else {
        dates.push(`Ongoing ∞`)
      }

      const topLine    = `${title}${desc && ` — ${desc}`}`
      const bottomLine = `${dates.join(', ')}${partners && ` — ${partners}`}`

      return `${topLine}${bottomLine && `<br />${bottomLine}`}`
    },
    previewerStyle() {
      return { width: `${this.previewerWidth}px`}
    }
  },
  watch: {
    '$store.state.windowWidth'() {
      this.onResize()
    },
    previewerWidth(newVal, oldVal) {
      if (newVal > 0 && this.isReady === false) {
        this.isReady = true
      }
    },
    interacting() {
      if (this.interacting === false) {
        this.resetSlices()
      }
    }
  },
  methods: {
    formatDate(_d) {
      const d = new Date(_d)
      return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    },
    setPreviewerWidth() {
      this.previewerWidth = this.$store.state.windowWidth * this.slices.length / 2.5
    },
    resetSlices() {
      this.activeSliceIndex = -1
    },
    onResize() {
      this.setPreviewerWidth()
    },
    onProjectPreviewMouseenter(i) {
      this.activeSliceIndex = i
    },
    onProjectPreviewClick(i) {
      if (!this.$store.state.isTouch) {
        // don't activate on touch screens
        this.activeSliceIndex = i // Make up for mouseleave happening on modal open
      }

      this.selectedSliceIndex = i // This triggers the modal opening
    },
    onProjectPreviewBottomLayerClick() {
      this.isHighlighted = true
      this.resetSlices()
    },
    onProjectPreviewTopLayerClick() {
      this.isHighlighted = false
    },
    onProjectPreviewOverflowClick(e) {
      if (e && e.target === this.$refs['preview-overflow']) {
        this.onProjectPreviewBottomLayerClick()
      }
    },
    onOverlaySlideChangeStart(sliceIndex) {
      this.activeSliceIndex = sliceIndex
    },
    onOverlayClose() {
      this.selectedSliceIndex = -1
    },
    onHasIntersected({ detail }) {
      if (detail.isIntersecting && this.isIntroduced === false) {
        this.isIntroduced = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  height: 420px;
  max-height: 850px;

  @include bp-up(md) {
    height: calc(100vh - var(--page-title-height));
    min-height: 450px;
  }

  opacity: 0;
  transition: opacity 500ms ease-out;

  &.is-ready {
    opacity: 1
  }
}

.project-preview-wrapper {
  position: relative; // For top and bottom layers to position themselves against
  height: 100%;
  width: 100%;
  max-height: 350px;
}

.project-preview-overflow {
  position: relative;
  z-index: 2; // To sandwich in the middle of the top and bottom layers
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;    
  
  &::-webkit-scrollbar {
    display: none;
  }  

  // Above this screen size we don't do horizontal scrolling anymore so we don't need pointer events
  @include bp-up(md) {
    overflow: visible;
    pointer-events: none;
  }
}

.project-previewer {
  display: flex;
  height: 100%;
  pointer-events: none; // Apply them back at the 'frame' child level

  @include bp-up(md) {
    width: 100% !important;
  }

  .project-preview {
    flex: 1;
    padding: 0 5.5vw;

    &.is-ready {
      transition: all 0.7s cubic-bezier(0.26, 0.35, 0.12, 1.01);
    }

    &:only-child {
      flex: 1 !important;
    }

    &:first-child {
      padding-left: 5.5vw !important;
    }

    &:last-child {
      padding-right: 5.5vw !important;
    }

    &.is-active,
    &.is-inactive {
      transition-duration: 0.6s;
    }

    &.is-active {
      flex: 3.8 !important;
      padding: 0 8vw !important;
    }

    &.is-inactive {
      flex: 0.8 !important; 
    }

    @include bp-up(md) {
      &:first-child {
        padding-left: 2.5vw !important;
      }

      &:last-child {
        padding-right: 2.5vw !important;
      }    
    }    

    .frame {
      pointer-events: auto;
    }
  }
}

.project-preview__bottom-layer,
.project-preview__top-layer {
  @include fill;
  cursor: pointer;
}

.project-preview__bottom-layer {
  z-index: 1; // Below project preview
  transition: opacity 500ms ease-out;
  opacity: 0;

  .is-introduced & {
    opacity: 1;
  }
}

.project-preview__top-layer {
  z-index: 3; // Above project preview
  pointer-events: none;
  opacity: 0;
  transition: opacity $preview-highlight-transition-duration-out $preview-highlight-easing-out;

  .is-highlighted & {
    opacity: 1;
    pointer-events: auto;
    transition: {
      timing-function: $preview-highlight-easing-in;
      duration: $preview-highlight-transition-duration-in;
    }
  }
}

.project-description {
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  text-align: center;
  font-weight: $font-weight-medium;
  @include text-shrink;

  &__text {
    padding: 0 50px;
  }
}

// This is all trash, get using it to get the idea
.caption-switcher {
  flex: none; // Might not need this when we re-do how the container
  margin-top: 100px;
  margin-top: 11vh;
  width: 100%;
  position: relative;
  text-transform: none;

  display: none;

  @include bp-up(md) {
    display: block;
  }
}
</style>