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
          { 'show-progress' : showProgress }
        ]"
        @mousemove="onMousemove"
      >
        <template v-if="slice.slice_type === 'detail_gallery'">
          <!-- include ProjectOverlayImageSlideshow ? -->
          <!-- if slice.items.length == 1 -> single image viewer -->

          <div class="swiper-container" ref="swiper">
            <div class="swiper-wrapper">
              <div
                v-for="(item, j) in slice.items"
                :key="`slide-${j}`"
                class="swiper-slide"
              >
                <div class="image-slide">
                  <prismic-image
                    :field="item.image"
                  />
                </div>
              </div>
            </div>        
          </div>
        </template>

        <template v-else-if="slice.slice_type === 'detail_text'">
          <div style="height: 100%; padding: 150px 50px; max-width: 80vw; margin: 0 auto">
            <div style="font-size: 50px; line-height: 53px; border: 1px solid white; color: white; background-image: linear-gradient(0deg, rgb(82 82 82), rgb(53 53 53)); padding: 40px 15px; height: 100%; text-transform: none; overflow: scroll;" v-html="$prismic.asHtml(slice.primary.detail_rich_text)" />
          </div>
        </template>

        <template v-else-if="slice.slice_type === 'detail_videos'">
          <!-- include ProjectOverlayVideoSlideshow ? -->
          <div class="swiper-container" ref="swiper">
            <div class="swiper-wrapper">
              <div
                v-for="(item, j) in slice.items"
                :key="`slide-${j}`"
                class="swiper-slide"
              >
                <div class="image-slide">
                  <!-- Need to do some data validation here, possibly pull the ID and contruct the URL ourselves -->
                  <iframe
                    :src="`${item.vimeo_url.url}?byline=false&color=FD5858&fun=false&portrait=false&title=false`"
                    frameborder="0"
                    allow="autoplay; fullscreen"
                    allowfullscreen
                  />                  
                </div>          
              </div>
            </div>
          </div>
        </template>

        <template
          v-if="(slice.slice_type === 'detail_gallery' || slice.slice_type === 'detail_videos') && slice.items.length > 1"
        >
          <div class="arrows" v-if="slice.items.length > 1">
            <div class="arrow" @click="prev" />
            <div class="arrow" @click="next" />
          </div>        
          <span class="progress" ref="progress" v-text="progressText" />
        </template>
      </div>
    </template>
  </overlay>
</template>

<script>
import Swiper from 'swiper';
import _padStart from 'lodash/padStart'
import Overlay from '~/components/Overlay'

export default {
  components: {
    Overlay
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

    if (this.$refs.progress) {
      this.showProgress = true
    }
  },
  beforeDestroy() {
    this.$nextTick(this.destroySwiper)
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
      // console.log(e)

      if (!this.$refs.progress) return

      // Figure out a much better way to do this
      if (e.target && (e.target.classList.contains('arrow') || e.target.classList.contains('close'))) {
        this.showProgress = false
      }
      else {
        this.showProgress = true
      }

      // If e.position is out of bounds
      // showProgress = false; return;

      const x = e.clientX - this.$refs.progress.clientWidth/2
      const y = e.clientY - this.$refs.progress.clientHeight/2

      this.$refs.progress.style.transform = `translate(${x}px, ${y}px)`
    },
    prev() {
      this.swiper && this.swiper.slidePrev()
    },
    next() {
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
}

.image-slide {
  height: 100%;
  width: 100%;
  padding: 100px;

  img,
  iframe {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}

.arrows {
  pointer-events: none;
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
}

.arrow {
  pointer-events: auto;
  cursor: pointer;
  position: relative;
  height: 543px;
  height: 50vh;
  width: 300px;
  border: 1px solid var(--text-color);

  // &:before,
  // &:after {
  //   content: '';
  //   position: absolute;
  //   height: 100px;
  //   width: 100px;
  //   border: 1px solid var(--text-color);
  //   border-width: 0 0 0 1px;
  // }

  // &:before {
  //   transform: rotate(200deg);
  // }

  // &:after {
  //   transform: rotate(-20deg);
  // }
}

.responsive-player {
  height: 100vh;
  width: 70vw;
  margin: 0 auto;
  padding: 8vh 0;

  iframe {
    height: 100%;
    width: 100%;
    object-fit: contain;
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
  // transition: opacity 0.1s ease-in-out;

  .show-progress & {
    opacity: 1;
    // transition-duration: 0.25s;
  }
}
</style>