<template>
  <div
    :class="[ 
      'slideshow',
      { 'show-floating-progress': showFloatingProgress },
      { 'has-arrows': hasArrows }              
    ]"
    @mousemove="onMousemove"
  >          
    <div class="swiper-container" ref="swiper">
      <div
        class="swiper-wrapper"
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

    <template v-if="hasArrows">
      <transition name="arrow-left-fade">
        <div class="arrow-slot left" v-show="showArrows">
          <div class="arrow" @click="prev">
            <svg-slide-arrow />
          </div>
        </div>
      </transition>
      <transition name="arrow-right-fade">
        <div class="arrow-slot right" v-show="showArrows">
          <div class="arrow" @click="next">
            <svg-slide-arrow />
          </div>
        </div>
      </transition>

      <span
        class="floating-progress"
        :style="{ transform: floatingProgressTransform }"
        ref="floatingProgress"
        v-text="progressText"
      />
    </template>
  </div> 
</template>

<script>
import Swiper from 'swiper'
// import VimeoPlayer from '@vimeo/player'
import _padStart from 'lodash/padStart'
import _round from 'lodash/round'

import SlideshowSlide from '~/components/slideshow/SlideshowSlide'
import SvgSlideArrow from '~/assets/svg/slide-arrow.svg'

export default {
  components: {
    SlideshowSlide,
    SvgSlideArrow
  },
  props: {
    slice: {
      type: Object,
      required: false
    },
    fullyVisible: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      progressText: '',
      swiperHovered: false,
      floatingProgressTransX: 0,
      floatingProgressTransY: 0
    }
  },
  mounted() {
    const VimeoPlayer = require('@vimeo/player').default

    this.vimeoPlayers = []
    this.swiper = new Swiper(this.$refs.swiper, {
      init: false,
      loop: true,
      speed: 450,
      simulateTouch: false,
      watchOverflow: true,
      on: {
        // init: this.onInit,
        // slidePrevTransitionStart: this.onSlidePrevTransitionStart,
        // slideNextTransitionStart: this.onSlideNextTransitionStart,
        slideChange: this.onSlideChange,
        slideChangeTransitionStart: this.onSlideChangeTransitionStart,
        slideChangeTransitionEnd: this.onSlideChangeTransitionEnd
      }
    })

    this.swiper.init()

    this.vimeoPlayers = [...this.swiper.el.querySelectorAll('iframe')].map(iframe => {
      if (String(iframe.src).includes('vimeo.com')) {
        return new VimeoPlayer(iframe)
      }
    })
  },
  beforeDestroy() {
    this.$nextTick(this.destroySwiper)
  },
  watch: {
    fullyVisible(newViz, oldViz) {
      if (newViz === false) {
        this.pauseVimeoPlayers()
      }
    }
  },
  computed: {  
    hasArrows() {
      let flag = false

      if (this.slice.items.length > 1 && this.$store.state.isTouch === false) {
        flag = true
      }
      
      return flag
    },
    // Might not need this computed property...
    showArrows() {
      return this.fullyVisible
    },
    showFloatingProgress() {
      return this.fullyVisible && this.swiperHovered && this.hasArrows
    },
    floatingProgressTransform() {
      if (this.floatingProgressTransX === 0 && this.floatingProgressTransY === 0) {
        return 'none'
      }
      else {
        return `translate(${this.floatingProgressTransX}px, ${this.floatingProgressTransY }px)`
      }
    },
  },
  methods: {
    // onInit(swiper) {
    //   this.setProgress(swiper.activeIndex)
    // },
    // onSlideNextTransitionStart(swiper) {
    //   // Update progress text here?
    // },
    // onSlidePrevTransitionStart(swiper) {
    //   // updateProgress text here?
    // },
    onSlideChange() {
      // console.log('slide change')
    },
    onSlideChangeTransitionStart() {
      this.pauseVimeoPlayers();
    },
    onSlideChangeTransitionEnd() {
      // console.log('transition end')
      this.setProgress()
    },
    onSwiperMouseenter() {
      this.swiperHovered = true
    },
    onSwiperMouseleave() {
      this.swiperHovered = false
    },
    onMousemove(e) {
      if (!this.$refs.floatingProgress || this.$store.state.isTouch) return

      const { height, width } = this.$refs.floatingProgress.getBoundingClientRect()

      const x = e.clientX - width/2
      const y = e.clientY - height/2

      this.floatingProgressTransX = _round(x, 2)
      this.floatingProgressTransY = _round(y, 2)
    },
    update() {
      this.swiper.update()
      this.setProgress(this.swiper.activeIndex)
    },
    prev() {
      this.swiper.slidePrev()
    },
    next() {
      this.swiper.slideNext()
    },
    reset() {
      this.swiper.slideTo(1, 0)
      this.setProgress()
    },
    destroySwiper() {
      this.swiper && this.swiper.destroy()
      delete this.swiper
    },
    setProgress(index = undefined) {
      let i = index != undefined ? index : this.swiper.realIndex+1
          i = _padStart(i, 2, '0')
      const total = _padStart(this.slice.items.length, 2, '0')

      this.progressText = `${i}/${total}`

      this.$emit('progress', this.progressText)
    },
    pauseVimeoPlayers() {
      this.vimeoPlayers && this.vimeoPlayers.forEach(player => player.pause())
    }
  }
}
</script>

<style lang="scss" scoped>
$arrow-slot-width-sm: 10.5%;
$arrow-slot-width-md: 21.25%;
$arrow-slot-width-xxxl: 450px;

.slideshow,
.swiper-container {
  height: 100%;
}

.slideshow {
  position: relative; // For the arrows
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

.swiper-wrapper {
  body:not(.is-touch) & {
    transition-timing-function: cubic-bezier(0.5, 0.1, 0, 0.99) !important;
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
      stroke: var(--text-color);
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
</style>