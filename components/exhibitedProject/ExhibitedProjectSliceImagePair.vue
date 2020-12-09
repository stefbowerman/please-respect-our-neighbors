<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <div class="first-image" v-if="firstImage">
            <img
              :src="firstImage.url"
              :alt="firstImage.alt"
            />
          </div>
        </div>
        <div class="secondary-column">
          <div class="second-image" v-if="secondImage">
            <prismic-image
              :field="secondImage"
            />
          </div>
        </div>   
      </div>
    </div>

    <div class="caption-placement" v-show="current">
      <div class="container">
        <div class="row">
          <div class="primary-column">
            <div class="captions">
              <div class="caption" v-if="firstCaption">
                <div>Left:</div>
                <div v-text="firstCaption" />
              </div>
              <div class="caption" v-if="secondImage">
                <div>Right:</div>
                <div v-text="secondCaption" />
              </div>
            </div>              
          </div>
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
        return s.slice_type === 'image_pair'
      } 
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    firstImage() {
      return _get(this.slice, 'primary.first_image')
    },
    secondImage() {
      return _get(this.slice, 'primary.second_image')
    },
    firstCaption() {
      return this.firstImage && this.$prismic.asText(_get(this.slice, 'primary.first_image_caption', []))
    },
    secondCaption() {
      return this.secondImage && this.$prismic.asText(_get(this.slice, 'primary.second_image_caption', []))
    }
  }
}
</script>

<style lang="scss" scoped>
.first-image,
.second-image {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  border: 1px solid $black;

  img {
    display: inline-block;
    vertical-align: top;
  }
}

.first-image {
  max-width: 79%;

  @include bp-up(lg) {
    max-width: 750px;
  }
}

.second-image {
  max-width: 55%;
  margin-top: 10px;

  @include bp-up(lg) {
    max-width: 571px;
    margin-top: 0;
  }
}

// I'm just copying the style of .captions in _exhibited-project.vue :-/
.caption-placement {
  position: fixed;
  z-index: -1;
  bottom: 21px;
  left: 0;
  right: 0;
  pointer-events: none;
}

.captions {
  font-family: $font-family-secondary;
  text-align: center;
  display: none;

  @include bp-up(lg) {
    display: block;
  }
}

.caption {
  line-height: 1.523; // @TODO - Can this be a variable?

  & + & {
    margin-top: 1em * 1.523;
  }
}
</style>