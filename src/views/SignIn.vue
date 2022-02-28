<template>
  <div class="small-container">
    <h1 class="title is-1">Sign in</h1>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <div v-if="signUpEmail" class="notification is-success">Sign up with {{ signUpEmail }} successful!</div>
          <a :href="clientUri">Sign in with RethinkID</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rid } from "@/rethinkid";

@Component
export default class SignInView extends Vue {
  created() {
    this.getClientUri();

    const signUpEmail = this.$route.query["sign_up_email"];
    if (signUpEmail && typeof signUpEmail === "string") {
      this.signUpEmail = signUpEmail;
    }
  }

  signUpEmail = "";

  clientUri = "";

  async getClientUri() {
    this.clientUri = await rid.logInUri();
  }
}
</script>

<style scoped lang="scss"></style>
