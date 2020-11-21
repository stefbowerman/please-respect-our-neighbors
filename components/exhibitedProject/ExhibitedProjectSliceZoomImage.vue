<template>
  <div class="container">
    <div
      v-if="primaryImage"
      class="primary"
    >
      <img :src="primaryImage.url" :alt="primaryImage.alt" />
    </div>
    <div
      class="detail"
      v-if="detailImage"
      :style="loupeStyle"
    >
      <div
        :class="[
          'loupe',
          { 'is-hovered': this.loupeHovered }
        ]"
        @mousemove="onLoupeMousemove"
        ref="loupe"
      >
        <div
          class="loupe-image"
          :style="loupeImageStyle"
        >
          <img
            :src="detailImage.url"
            :alt="detailImage.alt"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'

export default {
  props: {
    slice: {
      type: Object,
      default: () => {},
      validator(s) {
        return s.slice_type === 'zoom_image'
      } 
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detailImageTransX: 0,
      detailImageTransY: 0,
      loupeHovered: false,
      loupeTransY: 0
    }
  },
  // @TODO - Add intersection observer to only run on scroll when element is close to being in view?
  mounted() {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  computed: {
    primaryImage() {
      return _get(this.slice, 'primary.main_image')
    },
    detailImage() {
      return _get(this.slice, 'primary.detail_image')
    },
    loupeImageStyle() {
      return {
        transform: `translate(${this.detailImageTransX}px, ${this.detailImageTransY}px)`
      }
    },
    loupeStyle() {
      return {
        transform: `translateY(${this.loupeTransY}px)`
      }
    }
  },
  methods: {
    onLoupeMousemove(e) {
      const loupeRect = this.$refs.loupe.getBoundingClientRect()
      const r = loupeRect.width/2
      const distX = e.clientX - (loupeRect.x + r)
      const distY = e.clientY - (loupeRect.y + r)

      const isInside = (Math.pow(distX, 2) + Math.pow(distY, 2)) < Math.pow(r, 2)

      if (isInside) {
        this.detailImageTransX = parseInt(distX * 0.5)
        this.detailImageTransY = parseInt(distY * 0.5)
        this.loupeHovered = true
      }
      else {
        this.loupeHovered = false
      }
    },
    onScroll() {
      const winH = window.innerHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const h = this.$el.offsetHeight
      const top = this.$el.offsetTop
      const bottom = h + top
      const elMiddle = top + h/2

      const shift = (scrollTop + winH/2) - (elMiddle) // this isn't exact but it's close enough...

      this.loupeTransY = shift * -0.12
    }
  }
}
</script>

<style lang="scss" scoped>
.container,
.primary {
  height: 100%;
}

.primary {
  position: relative;

  @include bp-up(lg) {
    margin-left: -24px;
    margin-right: -24px; 

    img {
      vertical-align: top;
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
}

.detail {
  position: absolute;
  top: 95%;
  right: 10px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid $black;
  overflow: hidden;

  @include bp-up(lg) {
    top: 36%;
    right: 3%;    
    width: 700px;
    height: 700px;

    height: 38vw;
    width: 38vw;
  }

  transition: transform 0.5s $easing-ease-out-quart;
}

.loupe {
  height: 100%;
  width: 100%;
  
  &.is-hovered {
    // cursor: none;
  }
}

.loupe-image {
  position: relative;
  height: 200%;
  width: 200%;
  top: -25%;
  left: -25%;
  transition: transform 0.025s ease-out;
  will-change: transform;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }  
}
</style>