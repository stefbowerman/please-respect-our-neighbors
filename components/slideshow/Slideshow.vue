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
          <div class="arrow" ref="prevArrow">
            <svg-slide-arrow />
          </div>
        </div>
      </transition>
      <transition name="arrow-right-fade">
        <div class="arrow-slot right" v-show="showArrows">
          <div class="arrow" ref="nextArrow">
            <svg-slide-arrow />
          </div>
        </div>
      </transition>

      <span
        class="floating-progress"
        :style="{ transform: floatingProgressTransform }"
        ref="floatingProgress"
        v-text="displayProgressText"
      />
    </template>

    <div style="display: none">
      <svg class="play-icon" ref="playIcon" xmlns="http://www.w3.org/2000/svg" width="34.979" height="44.396" viewBox="0 0 34.979 44.396">
        <path id="Polygon_2" data-name="Polygon 2" d="M22.2,0,44.4,34.978H0Z" transform="translate(34.979) rotate(90)" fill="#fd5858"/>
      </svg>

      <svg class="volume-icon" ref="volumeIcon" xmlns="http://www.w3.org/2000/svg" width="58.234" height="44.395" viewBox="0 0 58.234 44.395">
        <g id="Polygon_4" data-name="Polygon 4" transform="translate(0 44.395) rotate(-90)" fill="none">
          <path d="M22.2,0,44.4,34.978H0Z" stroke="none"/>
          <path d="M 22.1976318359375 3.732572555541992 L 3.637977600097656 32.97808456420898 L 40.75728607177734 32.97808456420898 L 22.1976318359375 3.732572555541992 M 22.1976318359375 3.814697265625e-06 L 44.395263671875 34.97808456420898 L 0 34.97808456420898 L 22.1976318359375 3.814697265625e-06 Z" stroke="none" fill="#fd5858"/>
        </g>
        <path id="Path_81" data-name="Path 81" d="M21,0a11.953,11.953,0,0,1,0,23.907" transform="translate(16.88 10.291)" fill="none" stroke="#fd5858" stroke-width="2"/>
        <path id="Path_82" data-name="Path 82" d="M21,0a19.355,19.355,0,0,1,0,38.711" transform="translate(16.88 2.515)" fill="none" stroke="#fd5858" stroke-width="2"/>
        <path id="Path_83" data-name="Path 83" d="M21,0a5.9,5.9,0,0,1,0,11.8" transform="translate(16.955 15.969)" fill="none" stroke="#fd5858" stroke-width="2"/>
      </svg>
    </div>    
  </div> 
</template>

<script>
import Swiper, { Navigation } from 'swiper'
import Plyr from 'plyr'
import _padStart from 'lodash/padStart'
import _round from 'lodash/round'
import _throttle from 'lodash/throttle'
import _get from 'lodash/get'
import { contain } from 'intrinsic-scale'

import SvgSlideArrow from '~/assets/svg/slide-arrow.svg'

Swiper.use([Navigation])

export default {
  components: {
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
      default: 'SlideshowSlide'
    },
    loop: {
      type: Boolean,
      required: false,
      default: true
    },
    // Allows us to override the default progressText
    customProgressText: {
      type: String,
      required: false
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
      loop: this.loop,
      speed: 380,
      simulateTouch: false,
      watchOverflow: true,
      navigation: {
        nextEl: this.$refs.nextArrow,
        prevEl: this.$refs.prevArrow,
        disabledClass: 'is-disabled'
      },
      on: {
        slideChangeTransitionStart: this.onSlideChangeTransitionStart,
        slideChangeTransitionEnd: this.onSlideChangeTransitionEnd
      }
    })

    this.swiper.init()

    if (this.slideCount <= 1) {
      this.slideshowDisabled = true
    }

    this.swiper.slides.forEach($slide => {
      const $interactiveArea = $slide.querySelector('.slide-content-interactive-area')
      const $plyr = $slide.querySelector('.plyr')

      if ($interactiveArea) {
        $interactiveArea.addEventListener('mouseenter', e => this.slideContentHovered = true)
        $interactiveArea.addEventListener('mouseleave', e => this.slideContentHovered = false)

        const img = $interactiveArea.querySelector('img')

        img && img.addEventListener('click', this.onSlideContentImageClick)
      }

      if ($plyr) {
        const p = new Plyr($plyr, {
          controls: ['play', 'mute', 'progress'],
          muted: true,
          volume: 1,
          disableContextMenu: false,
          fullscreen: {
            enabled: false
          },
          tooltips: {
            controls: false,
            seek: false
          }
        })

        
        // Update the icon buttons
        let $volumeIcon = this.$refs.volumeIcon
        let $playIcon = this.$refs.playIcon

        const muteButton = p.elements.buttons.mute
        const playButton = p.elements.buttons.play[0]

        $volumeIcon = $volumeIcon.cloneNode(true)
        $playIcon = $playIcon.cloneNode(true)   
  
        muteButton.insertBefore($volumeIcon, muteButton.childNodes[0])
        playButton.insertBefore($playIcon, playButton.childNodes[0])

        muteButton.addEventListener('click', () => {
          if (p.volume === 0) {
            p.volume = 1
          } else {
            p.volume = 0
          }
        })

        p.on('ready', e => {     
          const player = e.detail.plyr;
          const controls = player.elements.controls

          player.pip = false // Turn off
          player.volume = 1

          if (controls) {
            controls.addEventListener('mouseenter', e => this.videoControlsHovered = true)
            controls.addEventListener('mouseleave', e => this.videoControlsHovered = false)
          }
        })

        // Need the height and width so that we can properly size the video
        p.on('loadedmetadata', e => {
          $plyr.dataset.height = $plyr.videoHeight
          $plyr.dataset.width  = $plyr.videoWidth

          this.onResize()

          p.elements.container.classList.add('is-loaded')
        })

        p.on('ended', e => {
          p.currentTime = 0
          p.toggleControls(true)
        })

        const $range = _get(p, 'elements.inputs.seek')

        if ($range) {
          $range.addEventListener('touchmove', e => {
            e.stopPropagation() // Stop bubbling so that the slider doesn't move when we drag the range input
          })
        }

        // Attach it to the DOM element so we can reference it later
        $slide.plyr = p

        this.plyrs.push(p)
      }
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
      else {
        this.playCurrentSlidePlyr()        
      }
    }
  },
  computed: {
    slideCount() {
      return Array.isArray(this.$slots.default) && this.$slots.default.filter(({ tag }) => tag && tag.match(`^vue-component-\\d+-${this.slideTagName}$`) !== null).length || 0
    },
    hasArrows() {
      let flag = false

      if (this.slideCount > 1 && (this.$store.state.isTouch === false || this.$store.state.windowWidth > 1024)) {
        flag = true
      }
      
      return flag
    },
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
    },
    displayProgressText() {
      return this.customProgressText || this.progressText
    }
  },
  methods: {
    update() {
      this.swiper.update()
      this.setProgress()
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
      this.plyrs.forEach(p => p.pause())
    },
    playCurrentSlidePlyr() {
      const $currentSlide = this.swiper.slides[this.swiper.realIndex]

      if ($currentSlide.plyr) {
        $currentSlide.plyr.play()
      }
    },
    prev() {
      this.swiper.slidePrev()
    },
    next() {
      this.swiper.slideNext()
    },
    onSlideChangeTransitionStart() {
      this.pausePlyrs()
      this.$emit('slide-change-start', this.swiper.realIndex)
    },
    onSlideChangeTransitionEnd() {
      this.setProgress()
      this.playCurrentSlidePlyr()
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
  ::v-deep .slide-inner {
    padding-left: 12px;
    padding-right: 12px;
  }

  .slideshow.show-floating-progress & {
    cursor: none;
  }

  .slideshow.has-arrows & {
    ::v-deep .slide-inner {
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
  body.is-touch & ::v-deep .slide-inner {
    @include bp-down(md) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }   
}

.swiper-wrapper {
  align-items: center;
  
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
  transition: opacity 300ms ease-out,
              filter 300ms ease-out;

  .arrow-slot.left & {
    transform: scaleX(-1);
  }

  @include bp-up(md) {
    height: 550px;
    padding: 20px 15px;
  }

  @include bp-up(lg) {
    padding: 20px 32px;

    @media (min-height: 600px) {
      padding-top: 40px;
      padding-bottom: 40px;
    }

    @media (min-height: 800px) {
      padding-top: 74px;
      padding-bottom: 74px;
    }
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

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
    filter: grayscale(1);
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