<template>
  <div class="page page--index">
    <div class="page-inner">
      <div
        v-if="$store.state.indexViewed"
        class="index-image"
      >
        <img :src="selectedImageSrc" />
      </div>
    </div>
  </div>
</template>

<script>
import getTheme from '~/utils/getTheme'

export default {
  data() {
    return {
      images: [],
      selectedImageIndex: 0
    }
  },  
  mounted() {
    this.$store.commit('SET_THEME', getTheme(this.$route))
  },
  created() {
    // Get a random index
    this.selectedImageIndex = Math.floor(Math.random() * this.images.length)
  },
  beforeDestroy() {
    this.$store.commit('SET_INDEX_VIEWED', true)
  },
  computed: {
    selectedImageSrc() {
      return this.images[this.selectedImageIndex].url
    }
  },
  async asyncData({ $prismic, store, route }) {
    const response = await $prismic.api.getSingle('home_page')
    const data = response.data

    return {
      images: data.images.map(img => img.image)
    }
  }
}
</script>

<style lang="scss">
.index-image {
  height: 50%;
  width: 100%;
  max-height: 800px;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}
</style>
