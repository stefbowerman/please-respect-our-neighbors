<template>
  <div
    :class="classes"
    :style="{ '--caption-safe-space': `${this.captionSafeSpace}px` }"
  >
    <div class="exhibited-project-slice__contain">
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
import ExhibitedProjectSliceZoomImage from '~/components/exhibitedProject/slices/ZoomImage'
import ExhibitedProjectSliceImagePair from '~/components/exhibitedProject/slices/ImagePair'
import ExhibitedProjectSliceAccentImage from '~/components/exhibitedProject/slices/AccentImage'
import ExhibitedProjectSliceImageGallery from '~/components/exhibitedProject/slices/ImageGallery'
import ExhibitedProjectSliceImageTextBox from '~/components/exhibitedProject/slices/ImageTextBox'
import ExhibitedProjectSliceTextBox from '~/components/exhibitedProject/slices/TextBox'
import ExhibitedProjectSliceVideo from '~/components/exhibitedProject/slices/Video'

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
      ready: false,
      captionSafeSpace: 0
    }
  },
  mounted() {
    this.throttledOnResize = _throttle(this.onResize, 250)
    window.addEventListener('resize', this.throttledOnResize)

    this.setCaptionSafeSpace()
    this.$nextTick(() => {
      this.onResize()
      this.ready = true
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.throttledOnResize)
  },
  watch: {
    pageTitleHeight: 'onResize'
  },
  methods: {
    onResize() {
      this.setCaptionSafeSpace()
      this.$refs.slice.onResize && this.$refs.slice.onResize()
    },
    setCaptionSafeSpace() {
      let space = 0
      const { height, top } = this.$refs.caption.$el.getBoundingClientRect()
      // const bottomOffset = window.innerHeight - (top + height)
      // const bottomOffset = window.innerHeight - (this.$refs.caption.$el.offsetTop + height)
      // Calculating bottomOffset doesn't work if you transition to the exhibited project page since it starts way offscreen
      const bottomOffset = 30

      if (height > 0) {
        space = height + (bottomOffset * 2)
      }

      this.captionSafeSpace = space < 0 ? 0 : space
    }
  },
  computed: {
    classes() {
      return [
        'exhibited-project-slice',
        _kebabCase(this.slice.slice_type),
        { 'is-ready': this.ready }
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

  opacity: 0;
  transition: opacity 150ms ease-out;

  &.is-ready {
    opacity: 1;
  }

  @include bp-down(md) {
    .primary-column + .secondary-column {
      margin-top: var(--page-title-height);
    }
  }
}

.exhibited-project-slice__contain {
  position: relative;
  z-index: 1;
  padding-top: calc(var(--page-title-height) + 40px);
  padding-bottom: 40px; // Random number...something reasonable in case there's no caption  
  padding-bottom: unquote('max(40px, var(--caption-safe-space))');  

  @include bp-down(md) {
    // These don't have much content so make them go 100vh on small screens
    .exhibited-project-slice.accent-image &,
    .exhibited-project-slice.text-box & {
      height: 100vh;
    }

    .exhibited-project-slice.video &,
    .exhibited-project-slice.zoom-image & {
      min-height: 100vh;
      height: auto;
    }
  }
  
  @include bp-up(lg) {
    height: 100vh;
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


.exhibited-project-slice .text-box-wrapper {
  height: 100%;

  /deep/ .text-box {
    @include bp-down(md) {
      height: 50vh;
      max-height: 100%;      
    }
  }
}
</style>