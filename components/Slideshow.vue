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
      <div :class="[
        'swiper-wrapper',
        { 'is-disabled': this.slideshowDisabled }
      ]">
        <slideshow-slide
          v-for="(item, j) in slice.items"
          :key="`slide-${j}`"
          :type="slice.slice_type"
          :item="item"
          ref="slides"
        />
      </div>        
    </div>

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
import Plyr from 'plyr'
import _padStart from 'lodash/padStart'
import _round from 'lodash/round'
import _throttle from 'lodash/throttle'
import { contain } from 'intrinsic-scale'

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
    visible: {
      type: Boolean,
      required: false,
      default: true
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
      slideContentHovered: false,
      slideshowDisabled: false,
      floatingProgressTransX: 0,
      floatingProgressTransY: 0
    }
  },
  mounted() {
    const VimeoPlayer = require('@vimeo/player').default

    this.vimeoPlayers = []
    this.plyrs = []

    this.swiper = new Swiper(this.$refs.swiper, {
      init: false,
      loop: true,
      speed: 450,
      simulateTouch: false,
      watchOverflow: true,
      on: {
        slideChangeTransitionStart: this.onSlideChangeTransitionStart,
        slideChangeTransitionEnd: this.onSlideChangeTransitionEnd
      }
    })

    this.swiper.init()

    if (this.slice.items.length <= 1) {
      this.slideshowDisabled = true
    }


    // Add a mouseenter, leave and mouse listener to each slide's interactive area
    // Nuxt is mad if we don't assign to a var
    const evts = [...this.swiper.el.querySelectorAll('.slide-content-interactive-area')].map(el => {
      el.addEventListener('mouseenter', e => this.slideContentHovered = true)
      el.addEventListener('mouseleave', e => this.slideContentHovered = false)

      const img = el.querySelector('img')

      img && img.addEventListener('click', this.onSlideContentImageClick)

      // el.addEventListener('click', this.onSlideContentInteractiveAreaClick)
      // @TODO - only attach the click handler to the image inside of the area
      // If we have a video, clicking on it should just pause and play
    })

    // Initialize all the iframes
    // this.vimeoPlayers = [...this.swiper.el.querySelectorAll('iframe')].map(iframe => {
    //   if (String(iframe.src).includes('vimeo.com')) {
    //     const player = new VimeoPlayer(iframe)
    //     player.on('loaded', () => iframe.classList.add('is-loaded'))
    //     return player
    //   }
    // })

    // Initialize all the players
    this.plyrs = [...this.swiper.el.querySelectorAll('.plyr')].map(el => {
      const p = new Plyr(el, {
        controls: ['play', 'progress'],
        disableContextMenu: false,
        fullscreen: {
          enabled: false
        },
        tooltips: {
          controls: false,
          seek: false
        }
      })

      p.on('ready', e => el.classList.add('is-loaded'))
      p.on('ended', e => {
        p.currentTime = 0
        this.next()
      })

      return p
    })

    this.throttledResize = _throttle(this.onResize, 250)  

    window.addEventListener('resize', this.throttledResize)
    this.onResize()
  },
  beforeDestroy() {
    this.$nextTick(this.destroySwiper)
    window.removeEventListener('resize', this.throttledResize)
  },
  watch: {
    visible(newViz, oldViz) {
      this.onResize()
    },
    fullyVisible(newViz, oldViz) {
      if (newViz === false) {
        // this.pauseVimeoPlayers()
        this.pausePlyrs()
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
    // @TODO - Might not need this computed property...
    showArrows() {
      return this.fullyVisible
    },
    showFloatingProgress() {
      return this.fullyVisible && this.slideContentHovered && this.hasArrows
    },
    floatingProgressTransform() {
      if (this.floatingProgressTransX === 0 && this.floatingProgressTransY === 0) {
        return 'none'
      }
      else {
        return `translate(${this.floatingProgressTransX}px, ${this.floatingProgressTransY }px)`
      }
    }
  },
  methods: {
    onSlideChangeTransitionStart() {
      // this.pauseVimeoPlayers();
      this.pausePlyrs()
    },
    onSlideChangeTransitionEnd() {
      this.setProgress()
    },
    onSlideContentImageClick(e) {
      if (this.$store.state.isTouch) return

      // Since we're only showing one image at a time in the center of the screen
      // we can just check which half of the window they clicked on
      e.clientX >= window.innerWidth/2 ? this.next() : this.prev()
    },
    onMousemove(e) {
      if (!this.$refs.floatingProgress || this.$store.state.isTouch) return

      const { height, width } = this.$refs.floatingProgress.getBoundingClientRect()

      const x = e.clientX - width/2
      const y = e.clientY - height/2

      this.floatingProgressTransX = _round(x, 2)
      this.floatingProgressTransY = _round(y, 2)
    },
    onResize() {
      if (!this.visible) return

      this.swiper.slides.forEach(slide => {
        const contentFrame = slide.querySelector('.slide-content-frame')
        const img          = slide.querySelector('.slide-image')

        if (contentFrame && img) {
          const imgHeight    = parseInt(img.dataset.height)
          const imgWidth     = parseInt(img.dataset.width)          
          const { width, height } = contain(contentFrame.clientWidth, contentFrame.clientHeight, imgWidth, imgHeight)
          
          img.style.height = `${parseInt(height)}px`
          img.style.width  = `${parseInt(width)}px`
        }
      })
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
    // pauseVimeoPlayers() {
    //   this.vimeoPlayers && this.vimeoPlayers.forEach(player => player.pause())
    // },
    pausePlyrs() {
      this.plyrs && this.plyrs.forEach(p => p.pause())
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

  // Prevent transform
  &.is-disabled {
    transform: translate3d(0, 0, 0) !important;
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
      stroke-width: calc(12px - 1vw);

      @include bp-up(lg) {
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