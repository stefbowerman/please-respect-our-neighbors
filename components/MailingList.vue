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
// import fetchJsonp from "fetch-jsonp";
import axios from "axios";

export default {
  props: {
    actionUrl: {
      type: String,
      required: true,
    },
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
    };
  },
  mounted() {
    console.log(this.klaviyoListId);
  },
  computed: {
    formAction() {
      return this.actionUrl.replace("/post?", "/post-json?");
    },
    state() {
      let state;

      if (this.isSuccess) {
        state = "success";
      } else if (this.isError) {
        state = "error";
      } else if (this.isSubmitting) {
        state = "submitting";
      }

      return state;
    },
  },
  methods: {
    // getMessageForResponse({ result, msg }) {
    //   let _message;

    //   if (result === "success") {
    //     _message = "Thank you for subscribing.";
    //   } else {
    //     if (
    //       msg.match(
    //         /(.+@.+) is already subscribed to list (.+)\..+<a href.+/
    //       ) !== null
    //     ) {
    //       _message = "This email is already subscribed.";
    //     } else if (msg.match(/.+\#6592.+/) !== null) {
    //       _message = "Too many subscribe attempts.";
    //     } else {
    //       _message = "Check your email and try again.";
    //     }
    //   }

    //   return _message;
    // },
    onSuccess(response) {
      this.isSuccess = true;
      this.message = "Thank you for subscribing"; // this.getMessageForResponse(response);

      setTimeout(() => {
        this.email = "";
        this.message = "";
        this.isSuccess = false;
      }, 3000);
    },
    onError(errors = []) {
      this.isError = true;
      this.message = "Check your email and try again"; // this.getMessageForResponse(response);

      errors.forEach((e) => console.warn(e));

      setTimeout(() => {
        this.message = "";
        this.isError = false;
      }, 2500);
    },
    async onSubmit(e) {
      if (this.isSubmitting) return;

      // const formData = new FormData(this.$refs.form);
      // const serialized = [...formData.entries()].map((e) => {
      //   return `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`;
      // });
      // const fetchUrl = `${this.formAction}&${serialized.join("&")}`;

      this.isSubmitting = true;
      this.message = "Submitting...";

      const url = "//manage.kmail-lists.com/ajax/subscriptions/subscribe";
      const postData = {
        g: this.klaviyoListId,
        $fields: "$source",
        email: this.email,
      };
      const config = {
        crossDomain: true,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
        },
      };

      try {
        const { data } = await axios.post(url, postData, config);

        if (data.success) {
          this.onSuccess(data.data);
        } else {
          this.onError(data.errors);
        }

        console.log(data);
      } catch (e) {
        console.log(e);
      }

      /*
      $.ajax({
        async: true,
        crossDomain: true,
        url: '//manage.kmail-lists.com/ajax/subscriptions/subscribe',
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache"
        },
        data: {
            "g": this.settings.listId,
            "$fields": "$source",
            "email": this.$input.val(),
            "$source": this.settings.source
        },
        beforeSend: _this.onBeforeSend.bind(_this)
      })

      try {
        const response = await fetchJsonp(fetchUrl, {
          jsonpCallback: "c",
        }).then((r) => r.json());

        if (response.result === "success") {
          this.onSuccess(response);
        } else {
          this.onError(response);
        }
      } catch (error) {
        console.log(error);
      }
      */

      this.isSubmitting = false;
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
