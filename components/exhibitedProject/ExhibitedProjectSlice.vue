<template>
  <div :class="classes">
    <div
      class="exhibited-project-slice__contain"
      :style="containStyle"
    >
      <div class="exhibited-project-slice__component">
        <component
          :is="sliceComponentName"
          :slice="slice"
          ref="slice"
        />
      </div>
    </div>

    <exhibited-project-caption
      :slice="slice"
      :visible="current"
      ref="caption"
    />

    <div
      v-if="showAccentBg"
      class="exhibited-project-slice__accent-bg"
    />
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import _capitalize from 'lodash/capitalize'
import _get from 'lodash/get'
import _throttle from 'lodash/throttle'

import ExhibitedProjectCaption from '~/components/exhibitedProject/Caption'
import ExhibitedProjectSliceZoomImage from '~/components/exhibitedProject/ExhibitedProjectSliceZoomImage'
import ExhibitedProjectSliceImagePair from '~/components/exhibitedProject/ExhibitedProjectSliceImagePair'
import ExhibitedProjectSliceAccentImage from '~/components/exhibitedProject/ExhibitedProjectSliceAccentImage'
import ExhibitedProjectSliceImageGallery from '~/components/exhibitedProject/ExhibitedProjectSliceImageGallery'
import ExhibitedProjectSliceImageTextBox from '~/components/exhibitedProject/ExhibitedProjectSliceImageTextBox'
import ExhibitedProjectSliceTextBox from '~/components/exhibitedProject/ExhibitedProjectSliceTextBox'
import ExhibitedProjectSliceVideo from '~/components/exhibitedProject/ExhibitedProjectSliceVideo'

export default {
  components: {
    ExhibitedProjectCaption,
    ExhibitedProjectSliceZoomImage,
    ExhibitedProjectSliceImagePair,
    ExhibitedProjectSliceAccentImage,
    ExhibitedProjectSliceImageGallery,
    ExhibitedProjectSliceImageTextBox,
    ExhibitedProjectSliceTextBox,
    ExhibitedProjectSliceVideo
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
      const { height, top } = this.$refs.caption.$el.getBoundingClientRect()
      const bottomOffset = window.innerHeight - (top + height)

      if (height > 0) {
        space = height + (bottomOffset * 2)
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
  position: relative; // For accent BG
  pointer-events: none;
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
  position: relative;
  z-index: 1;
  padding-top: calc(var(--page-title-height) + 15px);

  // These don't have much content so make them go 100vh on small screens
  .exhibited-project-slice.accent-image &,
  .exhibited-project-slice.video & {
    height: 100vh;
  }
  
  @include bp-up(lg) {
    height: 100vh;
    padding-bottom: 40px; // Random number...something reasonable in case there's no caption  
    // padding-top: calc(var(--page-title-height) + 15px);
  }
}

.exhibited-project-slice__component {
  height: 100%;
  pointer-events: auto;
}

.exhibited-project-slice__accent-bg {
  @include fill;
  background-color: $red;
  z-index: $zindex-accent-bg;
  transform: translate3d(0, 0, 0); // Fix a chrome bug where it was disappearing randomly?
}
</style>