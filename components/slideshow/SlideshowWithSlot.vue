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
        <!-- Put SlideshowSlide components here -->
        <slot />
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
    visible: {
      type: Boolean,
      required: false,
      default: true
    },
    fullyVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    initialSlide: {
      type: Number,
      default: 0
    },
    slideTagName: {
      type: String,
      required: false,
      default: 'SlideshowSlideForSlot' // @TODO - Eventually switch this back to SlideshowSlide once we're done with these changes
    }
  },
  data() {
    return {
      progressText: '',
      slideContentHovered: false,
      videoControlsHovered: false,
      slideshowDisabled: false,
      mouseMoved: false,
      floatingProgressTransX: 0,
      floatingProgressTransY: 0
    }
  },
  mounted() {
    this.plyrs = []

    this.swiper = new Swiper(this.$refs.swiper, {
      init: false,
      initialSlide: this.initialSlide,
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

    if (this.slideCount <= 1) {
      this.slideshowDisabled = true
    }

    // Add a mouseenter, leave and mouse listener to each slide's interactive area
    // Nuxt is mad if we don't assign to a var
    const evts = [...this.swiper.el.querySelectorAll('.slide-content-interactive-area')].map(el => {
      el.addEventListener('mouseenter', e => this.slideContentHovered = true)
      el.addEventListener('mouseleave', e => this.slideContentHovered = false)

      const img = el.querySelector('img')

      img && img.addEventListener('click', this.onSlideContentImageClick)
    })

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

      p.on('ready', e => {     
        const player = e.detail.plyr;
        const controls = player.elements.controls

        player.pip = false // Turn off

        if (controls) {
          controls.addEventListener('mouseenter', e => this.videoControlsHovered = true)
          controls.addEventListener('mouseleave', e => this.videoControlsHovered = false)
        }
      })

      // Need the height and width so that we can properly size the video
      p.on('loadedmetadata', e => {
        el.dataset.height = el.videoHeight
        el.dataset.width  = el.videoWidth
        this.onResize()

        p.elements.container.classList.add('is-loaded')
      })      

      p.on('ended', e => {
        p.currentTime = 0
        p.toggleControls(true)
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
        this.pausePlyrs()
      }
    }
  },
  computed: {
    slideCount() {
      return this.$slots.default.filter(({ tag }) => tag && tag.match(`^vue-component-\\d+-${this.slideTagName}$`) !== null).length || 0
    },
    hasArrows() {
      let flag = false

      if (this.slideCount > 1 && this.$store.state.isTouch === false) {
        flag = true
      }
      
      return flag
    },
    // @TODO - Might not need this computed property...
    showArrows() {
      return this.fullyVisible
    },
    showFloatingProgress() {
      return  this.fullyVisible &&
              this.mouseMoved &&
              this.slideContentHovered &&
              this.hasArrows &&
             !this.videoControlsHovered
             
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
    onSlideChangeTransitionStart({ realIndex }) {
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

      this.mouseMoved = true // Set interaction flag

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
        const media        = slide.querySelector('.slide-media')

        if (contentFrame && media) {
          const naturalHeight    = parseInt(media.dataset.height)
          const naturalWidth     = parseInt(media.dataset.width)          
          const { width, height } = contain(contentFrame.clientWidth, contentFrame.clientHeight, naturalWidth, naturalHeight)
          
          media.style.height = `${parseInt(height)}px`
          media.style.width  = `${parseInt(width)}px`
        }
      })
    },
    update() {
      this.swiper.update()
      this.setProgress()
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
    setProgress() {      
      const index = this.swiper.realIndex

      const i = _padStart(index+1, 2, '0')
      const total = _padStart(this.slideCount, 2, '0')
      const progressText = `${i}/${total}`

      this.progressText = progressText

      this.$emit('progress', { index, progressText })
    },
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
  max-height: 82%;
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