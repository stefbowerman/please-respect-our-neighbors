<template>
  <transition
    name="mobile-menu"
    v-on:enter="onEnter"
  >  
    <div
      class="mobile-menu"
      v-show="show"
    >
      <div
        class="dialog"
        ref="dialog"
      >
        <div class="body">
          <nav>
            <nuxt-link
              v-for="(link, i) in links"
              :key="`link-${i}`"
              :to="link.url"
              @click.native="$emit('link-click')"
              v-text="link.title"
            />
          </nav>
        </div>
      </div>

      <span
        class="close"
        @click="close"
        v-text="'Close'"
      />

      <background />
    </div>
  </transition>
</template>

<script>
import Background from '~/components/Background'

export default {
  components: {
    Background
  },
  data() {
    return {
      links: [
        {
          title: 'Exhibited Project',
          url: '/exhibited-project'
        },
        {
          title: 'Current Partners',
          url: '/partners'
        },
        {
          title: 'Office Info',
          url: '/info'
        },
        {
          title: 'Accumulated Projects',
          url: '/projects'
        }
      ]
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show(val) {
      this.$store.commit('SET_MOBILE_MENU_OPEN', !!val)
    }
  },  
  methods: {
    close() {
      this.$emit('close')
    },
    onEnter() {
      this.$refs.dialog.scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-menu {
  @include fill(fixed);
  z-index: $zindex-mobile-menu;

  .background {
    opacity: 0.95;
  }
}

.dialog {
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }  
}

.body {
  width: 100%;
  overflow-x: hidden;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 61px 80px;
}

.close {
  position: fixed;
  top: 29px;
  right: 27px;
  font-size: 15px; // @TODO - Var this
  font-weight: $font-weight-light;
  @include theme-text;
  cursor: pointer;
}

nav {
  padding: 0 50px;
  font-size: 42px; // 47px; - had to make this a little smaller to fit the text without breaking the container
  line-height: 1;
  text-align: center;
  font-weight: $font-weight-bold;
  font-family: $font-family-secondary;

  a {
    display: block;

    & + a {
      margin-top: 45px;
    }
  }
}

// Transition
.mobile-menu-enter,
.mobile-menu-leave-to {
  .background,
  .close {
    opacity: 0;
  }

  .dialog {
    transform: translateY(-100%);
  }
}

.mobile-menu-enter-active {
  transition-duration: 1s;

  .background {
    transition: opacity 0.5s ease-in;
  }
  .dialog {
    transition: transform 0.8s cubic-bezier(0.62, 0.62, 0.39, 0.99);
  }
  .close {
    transition: opacity 0.5s $easing-ease-out-cubic 0.5s;
  }
}

.mobile-menu-leave-active {
  transition-duration: 0.75s;

  .background {
    transition: opacity 0.5s ease-out 0.25s;
  }
  .dialog {
    transition: transform 0.55s cubic-bezier(0.69, 0.11, 0.66, 0.97);
  }
  .close {
    transition: opacity 0.4s ease-out 0.1s;
  }
}
</style>