<template>
  <overlay
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @after-leave="onAfterLeave"
    @left-key="prev"
    @right-key="next"
    @close="$emit('close', $event)"
    :show="show"
  >
    <template slot="body">
      <div
          v-if="visible"
          class="viewer"
          :style="{ '--caption-height': `${captionHeight}px` }"
        >
          <SlideshowWithSlot
            :fully-visible="fullyVisible"
            :initial-slide="initialSlide"
            :loop="false"
            @slide-change-start="onSlideChangeStart"
            @progress="onProgress"
            class="viewer-content"
            ref="slideshow"
          >
            <template
              v-for="(slice, s) in slices"
            >
              <template
                v-if="slice.slice_type === 'detail_gallery'"
              >
                <SlideshowSlideForSlot
                  v-for="(item, i) in slice.items"
                  :key="`${s}${i}-item`"
                  :item="item"
                  :type="itemType(item)"
                />
              </template>
              <template
                v-else-if="slice.slice_type === 'detail_text'"
              >
                <SlideshowSlideForSlot
                  type="text"
                  :text-content="$prismic.asHtml(slice.primary.detail_rich_text)"
                  :text-size="slice.primary.detail_text_size"
                />
              </template>
            </template>
          </SlideshowWithSlot>

          <div
            v-if="progressText || captionHtml"
            :class="[
              'viewer-caption',
              { 'is-visible' : fullyVisible }
            ]"
            ref="viewerCaption"
          >
            <Caption
              :progress="progressText"
              :captionHtml="captionHtml"
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
import Caption from '~/components/Caption'
import SlideshowWithSlot from '~/components/slideshow/SlideshowWithSlot'
import SlideshowSlideForSlot from '~/components/slideshow/SlideshowSlideForSlot'

export default {
  components: {
    Overlay,
    TextBox,
    SlideshowWithSlot,
    SlideshowSlideForSlot,
    Caption    
  },
  props: {
    slices: {
      type: Array,
      required: false,
      default: () => []
    },
    selectedSliceIndex: {
      type: Number,
      default: 0,
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
      captionHtml: '',
      captionHeight: 0
    }
  },
  mounted() {
    this.throttledResize = _throttle(this.onResize, 150)
    
    window.addEventListener('resize', this.throttledResize)
    
    this.onResize()
    this.$refs.slideshow && this.$refs.slideshow.update()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.throttledResize)
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
    initialSlide() {
      return this.items.findIndex(item => item.sliceIndex === this.selectedSliceIndex)
    }
  },  
  methods: {
    onEnter() {
      this.visible = true
    },
    onAfterEnter() {
      this.fullyVisible = true
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
    onResize() {
      this.captionHeight = this.$refs.viewerCaption ? this.$refs.viewerCaption.clientHeight : 0
    },
    onProgress({ index }) {
      const { sliceIndex, sliceItemIndex, sliceItemsCount } = this.items[index]

      const slice = this.slices[sliceIndex]
      const numerator   = _padStart((sliceItemIndex + 1), 2, '0')
      const denominator = _padStart(sliceItemsCount, 2, '0')

      this.progressText = `${numerator}/${denominator}` 
      this.captionHtml = this.$prismic.asHtml(_get(slice, 'primary.detail_title', []))
    },
    onSlideChangeStart(index) {
      const { sliceIndex } = this.items[index]
      this.$emit('slide-change-start', sliceIndex)
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


  /deep/ .text-box {
    height: 100%;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    color: $white;

    /deep/ .simplebar-wrapper {
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
  padding: 45px 0;
  text-transform: none;
  opacity: 0;
  transition: opacity 1s $easing-ease-out-quart;

  @include bp-up(lg) {
    padding: 25px 0;
  }

  &.is-visible {
    opacity: 1;
  }
}
</style>
