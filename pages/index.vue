<template>
  <div class="page page-index">
    <div
      v-if="$store.state.indexViewed"
      class="index-image"
    >
      <img :src="selectedImageSrc" />
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.commit('SET_THEME', 'light')
  },
  created() {
    // Get a random index
    this.selectedImageIndex = Math.floor(Math.random() * this.images.length)
  },
  mounted() {
    this.$store.commit('SET_PAGE_TITLE_TITLE', '')
    this.$store.commit('SET_PAGE_TITLE_SUBTITLE', '')
  }, 
  beforeDestroy() {
    this.$store.commit('SET_INDEX_VIEWED', true)
  },
  data() {
    return {
      images: [],
      selectedImageIndex: 0
    }
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
.page {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.page-index {
  height: 100vh;
}

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
