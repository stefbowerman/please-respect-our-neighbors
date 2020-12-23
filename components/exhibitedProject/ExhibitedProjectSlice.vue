<template>
  <div :class="classes">
    <div
      class="exhibited-project-slice__contain"
      :style="containStyle"
    >
      <component
        :is="sliceComponentName"
        :slice="slice"
        :current="current"
        ref="slice"
      />
    </div>

    <project-caption
      :slice="slice"
      :visible="current"
      ref="caption"
    />

    <div class="exhibited-project-slice__accent-bg" v-if="showAccentBg" />    
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import _capitalize from 'lodash/capitalize'
import _get from 'lodash/get'
import _throttle from 'lodash/throttle'

import ProjectCaption from '~/components/exhibitedProject/Caption'
import ExhibitedProjectSliceZoomImage from '~/components/exhibitedProject/ExhibitedProjectSliceZoomImage'
import ExhibitedProjectSliceImagePair from '~/components/exhibitedProject/ExhibitedProjectSliceImagePair'
import ExhibitedProjectSliceAccentImage from '~/components/exhibitedProject/ExhibitedProjectSliceAccentImage'
import ExhibitedProjectSliceImageGallery from '~/components/exhibitedProject/ExhibitedProjectSliceImageGallery'
import ExhibitedProjectSliceImageTextBox from '~/components/exhibitedProject/ExhibitedProjectSliceImageTextBox'
import ExhibitedProjectSliceTextBox from '~/components/exhibitedProject/ExhibitedProjectSliceTextBox'

export default {
  components: {
    ProjectCaption,
    ExhibitedProjectSliceZoomImage,
    ExhibitedProjectSliceImagePair,
    ExhibitedProjectSliceAccentImage,
    ExhibitedProjectSliceImageGallery,
    ExhibitedProjectSliceImageTextBox,
    ExhibitedProjectSliceTextBox
  },
  props: {
    slice: {
      type: Object,
      required: true,
      default: () => {}
    },
    current: {
      type: Boolean,
      default: false
    },
    pageTitleHeight: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      captionSafeSpace: 0
    }
  },
  mounted() {
    console.log(this.slice)
    this.throttledOnResize = _throttle(this.onResize, 250)
    window.addEventListener('resize', this.throttledOnResize)

    this.onResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.throttledOnResize)
  },
  watch: {
    pageTitleHeight() {
      this.$refs.slice.onResize && this.$refs.slice.onResize()
    }
  },
  methods: {
    onResize() {
      this.setCaptionSafeSpace()
    },
    setCaptionSafeSpace() {
      let space = 0
      let captionRect = this.$refs.caption.$el.getBoundingClientRect()
      let h = captionRect.height
      let bottomOffset = window.innerHeight - captionRect.top - h

      if (h > 0) {
        space = h + (bottomOffset * 2)
      }

      this.captionSafeSpace = space
    }
  },
  computed: {
    classes() {
      return [
        'exhibited-project-slice',
        _kebabCase(this.slice.slice_type)
      ]
    },
    sliceComponentName() {
      return `ExhibitedProjectSlice${this.slice.slice_type.split('_').map(t => _capitalize(t)).join('')}` // 'zoom_image' => 'ExhibitedProjectSliceZoomImage'
    },
    showAccentBg() {
     return _get(this.slice, 'primary.accent_background', false)
    },
    containStyle() {
      let s = {}

      if (this.captionSafeSpace > 0) {
        s['padding-bottom'] = `${this.captionSafeSpace}px`
      }

      return s
    }
  }
}
</script>

<style lang="scss">
.exhibited-project-slice {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @include bp-up(lg) {
    &.zoom-image {
      padding-bottom: 100px;
    }
  }

  & + & {
    padding-top: 150px;
  }
}

.exhibited-project-slice__contain {
  height: 100vh;
  position: relative; // For accent BG
  
  @include bp-up(lg) {
    padding-bottom: 40px; // Random number...something reasonable in case there's no caption  
    padding-top: calc(var(--page-title-height) + 15px);
  }
}

.exhibited-project-slice__accent-bg {
  @include fill;
  background-color: $red;
  z-index: $zindex-accent-bg;
  transform: translate3d(0, 0, 0); // Fix a chrome bug where it was disappearing randomly?
}
</style>