<template>
  <div :class="['mailing-list', state && `state-${state}`]">
    <form novalidate @submit.prevent="onSubmit" ref="form">
      <input
        type="email"
        name="EMAIL"
        v-model="email"
        :disabled="isSubmitting"
      />

      <input type="submit" />
    </form>
    <div class="message" v-text="message" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    klaviyoListId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      email: "",
      message: "",
      isSubmitting: false,
      isSuccess: false,
      isError: false,
    }
  },
  computed: {
    state() {
      let state;

      if (this.isSuccess) {
        state = "success"
      } else if (this.isError) {
        state = "error"
      } else if (this.isSubmitting) {
        state = "submitting"
      }

      return state
    },
  },
  methods: {
    onSuccess(data) {
      this.isSuccess = true
      this.message = data.is_subscribed
        ? "You're already subscribed"
        : "Thank you for subscribing"

      setTimeout(() => {
        this.email = ""
        this.message = ""
        this.isSuccess = false
      }, 3000)
    },
    onError(errors = []) {
      this.isError = true
      this.message = "Check your email and try again"

      errors.forEach((e) => console.warn(e))

      setTimeout(() => {
        this.message = ""
        this.isError = false
      }, 2500)
    },
    async onSubmit(e) {
      if (this.isSubmitting) return

      this.isSubmitting = true
      this.message = "Submitting..."

      const url = "//manage.kmail-lists.com/ajax/subscriptions/subscribe"
      const config = { crossDomain: true }
      const formData = new FormData()

      formData.append("g", this.klaviyoListId)
      formData.append("$fields", "$source")
      formData.append("email", this.email)

      try {
        const { data } = await axios.post(url, formData, config)

        if (data.success) {
          this.onSuccess(data.data)
        } else {
          this.onError(data.errors)
        }

        console.log(data)
      } catch (e) {
        console.log(e)
      }

      this.isSubmitting = false
    },
  },
};
</script>

<style lang="scss" scoped>
.mailing-list {
  position: relative;

  &.state-success,
  &.state-error,
  &.state-submitting {
    form {
      visibility: hidden;
    }
    .message {
      visibility: visible;
    }
  }
}

.message {
  @include fill;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  visibility: hidden;
}

input[type="submit"] {
  visibility: hidden;
  position: absolute;
}
</style>
