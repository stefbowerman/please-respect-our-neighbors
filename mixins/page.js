import getTheme from '~/utils/getTheme'

export default {
  mounted() {
    this.$store.commit('SET_THEME', getTheme(this.$route))
  }
}