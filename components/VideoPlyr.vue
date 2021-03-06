<template>
  <div
    :class="[
      'video-plyr',
      (theme && `theme--${theme}`)
    ]"
  >
    <video
      :class="classes"
      :loop="loop"
      :autoplay="autoplay"
      :muted="muted"
      :playsinline="playsinline"
      :controls="controls"
      ref="video"
    >
      <source :src="url" />
    </video>
  </div>
</template>

<script>
import Plyr from 'plyr'

export default {
  props: {
    url: {
      type: String
    },
    loop: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    muted: {
      type: Boolean,
      default: true,
    },
    playsinline: {
      type: Boolean,
      default: true,
    },
    controls: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      required: false,
      validator: t => ['dark', 'red'].includes(t)
    }
  },
  data() {
    return {
      isLoaded: false
    }
  },
  mounted() {
    this.plyr = new Plyr(this.$refs.video, {
      controls: this.controls ? ['play', 'progress'] : [],
      disableContextMenu: false,
      autoplay: this.autoplay,
      muted: this.muted,
      fullscreen: {
        enabled: false
      },
      tooltips: {
        controls: false,
        seek: false
      }
    })

    this.plyr.on('ready', e => {
      this.plyr.pip = false // Turn off
      this.isLoaded = true
    })
  },
  computed: {
    classes() {
      return [
        'video-plyr__video',
        { 'is-loaded': this.isLoaded }
      ]
    }
  },
  methods: {
    play() {
      this.plyr && this.plyr.play()
    }
  }
}
</script>

<style lang="scss" scoped>
.video-plyr {
  ::v-deep .plyr__video-wrapper {
    background-color: $black;
    background-image: $dark-gradient;
  }
}

.video-plyr__video {
  opacity: 0;
  transition: opacity 1s ease-out;

  &.is-loaded {
    opacity: 1;
  }
}
</style>