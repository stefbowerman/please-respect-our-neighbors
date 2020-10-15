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
        class="viewer"
        @mousemove="onMousemove"
      >
        <template v-if="slice.slice_type === 'detail_gallery' || slice.slice_type === 'detail_videos'">
          <div
            :class="[
              'slideshow',
              { 'show-floating-progress': showFloatingProgress },
              { 'has-arrows': hasArrows }              
            ]"
          >          
            <div class="swiper-container" ref="swiper">
              <div
                class="swiper-wrapper"
                @click="next"
                @mouseenter="onSwiperMouseenter"
                @mouseleave="onSwiperMouseleave"              
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
              <transition name="arrow-left-fade">
                <div class="arrow-slot left" v-show="isFullyVisible">
                  <div class="arrow" @click="prev">
                    <svg-slide-arrow />
                  </div>
                </div>
              </transition>
              <transition name="arrow-right-fade">
                <div class="arrow-slot right" v-show="isFullyVisible">
                  <div class="arrow" @click="next">
                    <svg-slide-arrow />
                  </div>
                </div>
              </transition>

              <span class="floating-progress" ref="floatingProgress" v-text="progressText" />
            </template>
          </div>       
        </template>

        <template v-else-if="slice.slice_type === 'detail_text'">
          <div class="project-overlay-text-box">
            <TextBox
              :content="$prismic.asHtml(slice.primary.detail_rich_text)"
            />
          </div>
        </template>

        <transition name="fade">
          <div class="caption" v-show="isFullyVisible">
            <div class="caption-progress" v-text="progressText" />
            <div
              class="container"
              v-html="$prismic.asHtml(slice.primary.detail_title)"
            />
          </div>
        </transition>
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
      isFullyVisible: false,
      swiperHovered: false
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
      let flag = false

      if (
        (this.slice.slice_type === 'detail_gallery' || this.slice.slice_type === 'detail_videos') &&
        this.slice.items.length > 1 &&
        this.$store.state.isTouch === false
      ) {
        flag = true
      }
      
      return flag
    },
    showFloatingProgress() {
      return this.isFullyVisible && this.swiperHovered && this.hasArrows && !this.$store.state.isTouch
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
    onAfterEnter() {
      this.isFullyVisible = true
    },
    onAfterLeave() {
      // this.swiper && this.swiper.slideTo(, 0)
      // this.setProgress()
      this.isFullyVisible = false
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
    onSwiperMouseenter() {
      this.swiperHovered = true
    },
    onSwiperMouseleave() {
      this.swiperHovered = false
    },
    onMousemove(e) {
      if (!this.$refs.floatingProgress) return

      const x = e.clientX - this.$refs.floatingProgress.clientWidth/2
      const y = e.clientY - this.$refs.floatingProgress.clientHeight/2

      this.$refs.floatingProgress.style.transform = `translate(${x}px, ${y}px)` // better to do this with a computed prop?
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
$arrow-slot-width-sm: 10.5%;
$arrow-slot-width-md: 21.25%;
$arrow-slot-width-xxxl: 450px;

.viewer {
  height: 100vh;
  height: var(--unit-100vh);
  width: 100%;

  .slideshow,
  .swiper-container {
    height: 100%;
  }

  body:not(.is-touch) & .swiper-wrapper {
    transition-timing-function: cubic-bezier(0.5, 0.1, 0, 0.99) !important;
  } 
}

.swiper-container {
  // @TODO - Use var for the container
  /deep/ .slide-inner {
    padding-left: 12px;
    padding-right: 12px;
  }

  .slideshow.show-floating-progress & {
    cursor: none;
  }

  .slideshow.has-arrows & {
    /deep/ .slide-inner {
      padding-left: $arrow-slot-width-sm;
      padding-right: $arrow-slot-width-sm;

      @include bp-up(md) {
        padding-left: $arrow-slot-width-md;
        padding-right: $arrow-slot-width-md;
      }

      @include bp-up(xxxl) {
        padding-left: $arrow-slot-width-xxxl;
        padding-right: $arrow-slot-width-xxxl;
      }
    }
  }

  // In this case we don't show arrows so reset the padding back to the small version
  body.is-touch & /deep/ .slide-inner {
    @include bp-down(md) {
      padding-left: 12px;
      padding-right: 12px;
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
  width: $arrow-slot-width-sm;
  padding-left: 8px;
  padding-right: 8px;

  // This is only needed on the overlay to avoid overlapping the close button on short screens
  padding-top: 132px;
  padding-bottom: 132px;

  @include bp-up(md) {
    width: $arrow-slot-width-md;
    padding-left: 52px;
    padding-right: 52px;
  }  

  @include bp-up(xxxl) {
    width: $arrow-slot-width-xxxl;
  }

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }

  // Arrow visibility is dependent on whether we have arrows (.has-arrows), screen size, and touch enabled-ness
  body.is-touch & {
    @include bp-down(md) {
      display: none;  
    }
  }
}

.arrow {
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 110px;
  max-height: 80%;
  width: 100%;
  padding: 11px;
  border: 1px solid var(--text-color);

  .arrow-slot.left & {
    transform: scaleX(-1);
  }

  @include bp-up(md) {
    height: 550px;
    padding: 20px 15px;
  }

  @include bp-up(lg) {
    padding: 74px 32px;
  }

  svg {
    height: 100%;
    width: auto;
    max-height: 300px;

    g {
      stroke: $red;
      stroke-width: 5px;

      @include bp-up(md) {
        stroke-width: 3px;
      }

      @include bp-up(xl) {
        stroke-width: 2px;
      }      
    }
  }
}

.floating-progress {
  position: fixed;
  pointer-events: none;
  z-index: 1;
  top: 0;
  left: 0;
  font-weight: $font-weight-medium;
  font-size: 80px;

  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  .slideshow.show-floating-progress & {
    opacity: 1;
  }
}

.caption {
  position: absolute;
  z-index: 1;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: $font-weight-medium;

  .container {
    max-width: 900px; // ?
  }

  /deep/ a {
    border-bottom: 2px solid; // Duplicated across Project.vue
  }
}

.caption-progress {
  @include bp-up(md) {
    display: none;
  }

  body.no-touch {
    display: none;
  }
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