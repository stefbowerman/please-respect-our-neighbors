<template>
  <overlay
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @left-key="prev"
    @right-key="next"
    @close="close"
    :show="show"
  >
    <template slot="body">
      <div
        v-if="visible"
        class="viewer"
        :style="{ '--caption-height': `${captionHeight}px` }"
      >
        <Slideshow
          :fully-visible="fullyVisible"
          :initial-slide="initialSlide"
          :loop="false"
          :custom-progress-text="progressText"
          @slide-change-start="onSlideChangeStart"
          @progress="onProgress"
          class="viewer-content"
          ref="slideshow"
        >
          <template
            v-for="(slice, s) in slices"
          >
            <SlideshowSlide
              v-if="slice.slice_type === 'detail_gallery'"
              v-for="(item, i) in slice.items"
              :key="`${s}${i}-item`"
              :item="item"
              :type="itemType(item)"
            />

            <SlideshowSlide
              v-else-if="slice.slice_type === 'detail_text'"
              type="text"
              :text-content="$prismic.asHtml(slice.primary.detail_rich_text)"
              :text-size="slice.primary.detail_text_size"
            />
          </template>
        </Slideshow>

        <div
          :class="[
            'viewer-caption',
            { 'is-visible' : fullyVisible }
          ]"            
        >
          <CaptionSwitcher
            :captions="sliceCaptions"
            :progress="progressText"
            :active-index="slideshowSliceIndex"
            @height-change="h => captionHeight = h"
          />
        </div>   
      </div>
    </template>
  </overlay>
</template>

<script>
import _get from 'lodash/get'
import _throttle from 'lodash/throttle'
import _padStart from 'lodash/padStart'

import Overlay from '~/components/Overlay'
import TextBox from '~/components/TextBox'
import CaptionSwitcher from '~/components/CaptionSwitcher'
import Slideshow from '~/components/slideshow/Slideshow'
import SlideshowSlide from '~/components/slideshow/SlideshowSlide'

export default {
  components: {
    Overlay,
    TextBox,
    Slideshow,
    SlideshowSlide,
    CaptionSwitcher
  },
  props: {
    slices: {
      type: Array,
      required: false,
      default: () => []
    },
    selectedSliceIndex: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      fullyVisible: false,
      progressText: '',
      captionHeight: 0,
      slideshowSliceIndex: 0,
    }
  },
  mounted() {
    this.$refs.slideshow && this.$refs.slideshow.update()

    window.addEventListener('popstate', this.onPopstate)
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.onPopstate)
  },  
  computed: {
    items() {
      return this.slices.map((slice, i) => {
        let sliceItems = []

        if (slice.slice_type === 'detail_text') {
          sliceItems = [slice.primary]
        }
        else if (slice.slice_type === 'detail_gallery') {
          sliceItems = slice.items
        }

        const sliceItemsCount = sliceItems.length

        // Add the following to each item
        // sliceIndex - Index of the parent slice in the array of slices
        // sliceItemIndex - Index of the item in the array of items for that slice
        // sliceItemsCount - Total number of items for that slice
        return sliceItems.map((sliceItem, j) => {
          return {
            ...sliceItem,
            sliceIndex: i,
            sliceItemIndex: j,
            sliceItemsCount
          }
        })
      }).flat()
    },
    sliceCaptions() {
      return this.slices.map(slice => this.$prismic.asHtml(_get(slice, 'primary.detail_title', [])))
    },
    initialSlide() {
      return this.items.findIndex(item => item.sliceIndex === this.selectedSliceIndex)
    }
  },  
  methods: {
    onPopstate() {
      if (this.visible) {
        this.close()
      }
    },
    onEnter() {
      this.visible = true
      this.$emit('enter')
    },
    onAfterEnter() {
      this.fullyVisible = true
    },
    onLeave() {
      this.$emit('leave')
    },
    onAfterLeave() {
      this.visible = false
      this.fullyVisible = false
    },
    itemType(item) {
      let t = ''

      // Prioritize videos in case they pass in both
      if (_get(item, 'video_file_url.url', null) != null) {
        t = 'video'
      }
      else if (_get(item, 'image.url', null) != null) {
        t = 'image'
      }

      return t
    },
    onProgress({ index }) {
      const { sliceIndex, sliceItemIndex, sliceItemsCount } = this.items[index]

      const slice = this.slices[sliceIndex]
      const numerator   = _padStart((sliceItemIndex + 1), 2, '0')
      const denominator = _padStart(sliceItemsCount, 2, '0')

      this.progressText = `${numerator}/${denominator}` 
      this.slideshowSliceIndex = sliceIndex
    },
    onSlideChangeStart(index) {
      const { sliceIndex } = this.items[index]
      this.$emit('slide-change-start', sliceIndex)
    },
    close() {
      this.$emit('close')
    },    
    prev() {
      this.$refs.slideshow && this.$refs.slideshow.prev()
    },
    next() {
      this.$refs.slideshow && this.$refs.slideshow.next()
    }
  }  
}
</script>

<style lang="scss" scoped>
.viewer {
  height: 100vh;
  height: var(--unit-100vh);
  width: 100%;


  ::v-deep .text-box {
    height: 100%;
    flex: 1;
    margin-left: auto;
    margin-right: auto;
    color: $white;

    .simplebar-wrapper {
      background-color: $off-black;
      background-image: $dark-gradient;
    }
  }  
}

.viewer-content {
  padding-top: 35px;
  padding-bottom: 35px;
  padding-top: unquote('max(35px, var(--caption-height))');
  padding-bottom: unquote('max(35px, var(--caption-height))');  

  @include bp-up(md) {
    padding-top: 165px;
    padding-bottom: 165px;
    padding-top: unquote('max(155px, var(--caption-height))');
    padding-bottom: unquote('max(165px, var(--caption-height))');
  }
}

.viewer-caption {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  text-transform: none;
  opacity: 0;
  transition: opacity 1s $easing-ease-out-quart;

  &.is-visible {
    opacity: 1;
  }

  .caption-switcher ::v-deep .holder {
    padding: 45px 0;

    @include bp-up(lg) {
      padding: 25px 0;
    }    
  }
}
</style>
