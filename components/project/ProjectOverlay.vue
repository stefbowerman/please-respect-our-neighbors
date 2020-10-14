<template>
  <overlay
    @enter="onEnter"
    @after-leave="onAfterLeave"
    @left-key="prev"
    @right-key="next"
    @close="$emit('close', $event)"
    :show="show"
  >
    <template slot="body">
      <div
        :class="[
          'viewer',
          { 'show-progress': showProgress },
          { 'has-arrows': hasArrows }
        ]"
        @mousemove="onMousemove"
      >
        <template v-if="slice.slice_type === 'detail_gallery' || slice.slice_type === 'detail_videos'">
          <div class="swiper-container" ref="swiper">
            <div
              class="swiper-wrapper"
              @click="next"
              @mouseenter="showProgress = true"
              @mouseleave="showProgress = false"              
            >
              <slideshow-slide
                v-for="(item, j) in slice.items"
                :key="`slide-${j}`"
                :type="slice.slice_type"
                :item="item"
                ref="slides"
              />
            </div>        
          </div>

          <!-- @TODO - Throw the caption in here and then make sure the swiper container resizes based on caption height? -->

          <template
            v-if="slice.items.length > 1"
          >
            <div class="arrow-slot left">
              <div class="arrow" @click="prev">
                <svg-slide-arrow />
              </div>
            </div>
            <div class="arrow-slot right">
              <div class="arrow" @click="next">
                <svg-slide-arrow />
              </div>
            </div>

            <span class="progress" ref="progress" v-text="progressText" />
          </template>          
        </template>

        <template v-else-if="slice.slice_type === 'detail_text'">
          <div class="project-overlay-text-box">
            <TextBox
              :content="$prismic.asHtml(slice.primary.detail_rich_text)"
            />
          </div>
        </template>

        <div class="caption">
          <div
            class="container"
            v-html="$prismic.asHtml(slice.primary.detail_title)"
          />
        </div>
      </div>
    </template>
  </overlay>
</template>

<script>
import Swiper from 'swiper';
import _padStart from 'lodash/padStart'

import Overlay from '~/components/Overlay'
import TextBox from '~/components/TextBox'
import SvgSlideArrow from '~/assets/svg/slide-arrow.svg'
import SlideshowSlide from '~/components/slideshow/SlideshowSlide'

export default {
  components: {
    Overlay,
    TextBox,
    SvgSlideArrow,
    SlideshowSlide
  },
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    slice: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      progressText: '',
      showProgress: false // Temp var?  Maybe a better way to do this?
    }
  },
  mounted() {
    if (this.$refs.swiper) {
      this.swiper = new Swiper(this.$refs.swiper, {
        init: false,
        loop: true,
        speed: 450,
        on: {
          init: this.onInit,
          slidePrevTransitionStart: this.onSlidePrevTransitionStart,
          slideNextTransitionStart: this.onSlideNextTransitionStart,
          slideChangeTransitionEnd: this.onSlideChangeTransitionEnd
        }
      })

      this.swiper.init()
    }
  },
  beforeDestroy() {
    this.$nextTick(this.destroySwiper)
  },
  computed: {
    hasArrows() {
      return (this.slice.slice_type === 'detail_gallery' || this.slice.slice_type === 'detail_videos') && this.slice.items.length > 1
    }
  },
  methods: {
    onInit(swiper) {
      // console.log('init')
      this.setProgress(swiper.activeIndex)
    },
    onEnter() {
      if (!this.swiper) return

      this.swiper.update()
      // this.setProgress(this.swiper.activeIndex)
    },
    onAfterLeave() {
      // this.swiper && this.swiper.slideTo(, 0)
      // this.setProgress()
    },
    onSlideNextTransitionStart(swiper) {
      // Update progress text here?
    },
    onSlidePrevTransitionStart(swiper) {
      // updateProgress text here?
    },
    onSlideChangeTransitionEnd() {
      this.setProgress()
    },
    onMousemove(e) {
      if (!this.$refs.progress) return

      const x = e.clientX - this.$refs.progress.clientWidth/2
      const y = e.clientY - this.$refs.progress.clientHeight/2

      this.$refs.progress.style.transform = `translate(${x}px, ${y}px)` // better to do this with a computed prop?
    },
    prev() {
      this.swiper && this.swiper.slidePrev()
    },
    next() {
      // @TODO - This is broken if you click on the first slide?
      this.swiper && this.swiper.slideNext()
    },
    destroySwiper() {
      this.swiper && this.swiper.destroy()
      delete this.swiper
    },
    setProgress(index = undefined) {
      if (!this.swiper) return

      let i = index != undefined ? index : this.swiper.realIndex+1
          i = _padStart(i, 2, '0')
      const total = _padStart(this.slice.items.length, 2, '0')

      this.progressText = `${i}/${total}`
    }
  }
}
</script>

<style lang="scss" scoped>
.viewer {
  height: 100vh;
  height: var(--unit-100vh);
  width: 100%;

  &.show-progress {
    cursor: none;
  }

  .swiper-container {
    height: 100%;
  }

  .swiper-wrapper {
    transition-timing-function: cubic-bezier(0.5, 0.1, 0, 0.99) !important; // @TODO - Only do this for non-touch screens
  }

  // Need to figure out what to do with this...
  // Pass hasArrows as a prop?

  &.has-arrows /deep/ .slide-inner {
    @include bp-up(lg) {
      padding-left: 21.25%;
      padding-right: 21.25%;
    }
  }
}

.arrow-slot {
  pointer-events: none;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
  top: 0;
  bottom: 0;
  width: 21.25%; // @TODO - Variablize this
  padding-left: 52px;
  padding-right: 52px;
  // background-color: transparentize(green, 0.5);

  // This is only needed on the overlay to avoid overlapping the close button on short screens
  padding-top: 132px;
  padding-bottom: 132px;

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
}

.arrow {
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 550px;
  max-height: 80%;
  width: 100%;
  padding: 20px 15px;
  border: 1px solid var(--text-color);

  .arrow-slot.left & {
    transform: scaleX(-1);
  }

  svg {
    height: 100%;
    width: auto;
    max-height: 300px;

    g {
      stroke: $red;
      stroke-width: 2px;
    }
  }
}

.progress {
  position: fixed;
  pointer-events: none;
  z-index: 1;
  top: 0;
  left: 0;
  font-weight: $font-weight-medium;
  font-size: 80px;

  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  .show-progress & {
    opacity: 1;
  }
}

.caption {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
}
</style>

<style lang="scss">
.project-overlay-text-box {
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 90px 50px;
  max-width: 1200px;
  color: $white;

  .text-box,
  .text-box-scroller {
    height: 100%;
  }

  .text-box-scroller {
    border: 1px solid $white;
    background-color: $off-black;
  }

  .text-box-scroll-bar {
    background-color: $red;
  }
}
</style>