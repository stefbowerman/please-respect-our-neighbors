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
              :event="''"
              @click.native="onLinkClick(link)"
              v-text="link.title"
            />
          </nav>
        </div>

        <site-logo
          @click="close"
        />
      </div>

      <span
        class="close"
        @click="close"
        v-text="'Close'"
      />
    </div>
  </transition>
</template>

<script>
import SiteLogo from '~/components/Logo'

export default {
  components: {
    SiteLogo
  },
  data() {
    return {
      links: [
        {
          title: 'Exhibited Project',
          url: '/exhibited'
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
    onLinkClick(link) {
      this.$emit('link-click', link.url)
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
  background-color: $white;

  a,
  .close,
  .logo {
    color: $black;
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
  cursor: pointer;
}

.logo {
  position: fixed;
  bottom: 15px;
  left: 0;
  right: 0;
}

nav {
  padding: 0 50px;
  font-size: 41px;
  line-height: 1;
  text-align: center;
  font-weight: $font-weight-medium;
  font-family: $font-family-secondary;

  @media (min-width: 370px) {
    font-size: 43px;
  }

  @include bp-up(sm) {
    font-size: 47px;
  }

  a {
    display: block;

    & + a {
      margin-top: 40px;
      margin-top: clamp(25px, calc(4.5vh), 50px); // For browsers that don't supprt calc + v* units
      margin-top: clamp(25px, calc(8.5vh - 27px), 50px);
    }
  }
}

// Transition
.mobile-menu-enter,
.mobile-menu-leave-to {
  transform: translateY(-100%);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: transform 850ms cubic-bezier(0.19, 1, 0.22, 1);
}

.mobile-menu-leave-active {
  transition-duration: 750ms;
}
</style>