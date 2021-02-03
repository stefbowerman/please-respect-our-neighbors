<template>
  <div
    :class="[
      'mailing-list',
      (state && `state-${state}`)
    ]"
  >
    <form
      :action="actionUrl"
      method="GET"
      novalidate
      @submit.prevent="onSubmit"
      ref="form"
    >
      <input
        type="email"
        name="EMAIL"
        v-model="email"
        :disabled="isSubmitting"
      />

      <input type="submit">
    </form>
    <div class="message" v-text="message" />
  </div>
</template>

<script>
import fetchJsonp from 'fetch-jsonp'

export default {
  props: {
    actionUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      email: '',
      message: '',
      isSubmitting: false,
      isSuccess: false,
      isError: false
    }
  },
  computed: {
    formAction() {
      return this.actionUrl.replace("/post?", "/post-json?")
    },
    state() {
      let state

      if (this.isSuccess) {
        state = 'success'
      }
      else if (this.isError) {
        state = 'error'
      }
      else if (this.isSubmitting) {
        state = 'submitting'
      }

      return state
    }
  },
  methods: {   
    getMessageForResponse({ result, msg }) {
      let _message

      if (result === 'success') {
        _message = 'Thank you for subscribing.'
      }
      else {
        if (msg.match(/(.+@.+) is already subscribed to list (.+)\..+<a href.+/) !== null) {
          _message = 'This email is already subscribed.'
        }
        else if (msg.match(/.+\#6592.+/) !== null) {
          _message = 'Too many subscribe attempts.'
        }
        else {
         _message = 'Check your email and try again.' 
        }
      }

      return _message
    },
    onSuccess(response) {
      this.isSuccess = true
      this.message = this.getMessageForResponse(response)

      setTimeout(() => {
        this.email = ''
        this.message = ''
        this.isSuccess = false
      }, 3000)
    },
    onError(response) {
      this.isError = true
      this.message = this.getMessageForResponse(response)

      setTimeout(() => {
        this.message = ''
        this.isError = false
      }, 2500)
    },
    async onSubmit(e) {
      if (this.isSubmitting) return

      const formData = new FormData(this.$refs.form)
      const serialized = [...formData.entries()].map((e) => {
        return `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`
      })
      const fetchUrl = `${this.formAction}&${serialized.join('&')}`

      this.isSubmitting = true
      this.message = 'Submitting...'

      try {
        const response = await fetchJsonp(fetchUrl, { jsonpCallback: 'c' }).then(r => r.json())

        if (response.result === 'success') {
          this.onSuccess(response)
        }
        else {
          this.onError(response)
        }
      }
      catch (error) {
        console.log(error)
      }

      this.isSubmitting = false 
    }
  }
}
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

form {

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