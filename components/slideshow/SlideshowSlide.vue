<template>
  <div class="swiper-slide">
    <div class="slide-inner">
      <div
        class="slide-content-frame"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave')"
      >
        <template v-if="type === 'detail_gallery' || type === 'image_gallery'">
          <prismic-image
            :field="item.image"
          />
        </template>
        <template v-else-if="type === 'detail_videos' && item.vimeo_url.url">
          <iframe
            :src="iFrameSrc"
            ref="iframe"
            frameborder="0"
            allow="autoplay; fullscreen"
            allowfullscreen
          />                     
        </template>
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

  img,
  iframe {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}  
</style>