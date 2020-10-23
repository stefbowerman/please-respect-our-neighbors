<template>
  <div class="swiper-slide">
    <div class="slide-inner">
      <div class="slide-content-frame">
          <template v-if="type === 'detail_gallery' || type === 'image_gallery'">
            <div class="slide-content-interactive-area">
              <prismic-image
                :field="item.image"
                class="slide-image"
                :data-height="item.image.dimensions.height"
                :data-width="item.image.dimensions.width"
              />
            </div>
          </template>
          <template v-else-if="type === 'detail_videos' && item.vimeo_url.url">
            <iframe
              :src="iFrameSrc"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            />                     
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}      
    }
  },
  computed: {
    iFrameSrc() {
      if (this.type !== 'detail_videos' || !this.item.vimeo_url) return ''

      const base = this.item.vimeo_url.url.replace('https://vimeo.com/', 'https://player.vimeo.com/video/')

      return `${base}?byline=false&color=FD5858&fun=false&portrait=false&title=false`
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-inner {
  height: 100%;
  width: 100%;
}

.slide-content-frame {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  iframe {
    height: 100%;
    width: 100%;
  }

  iframe {
    object-fit: contain;
    opacity: 0;
    transition: opacity 1s ease-out;

    &.is-loaded {
      opacity: 1;
    }
  }
}  
</style>