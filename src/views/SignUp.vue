<template>
  <div class="small-container">
    <h1 class="title is-1">Sign up</h1>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <a :href="signUpUri">Sign up with RethinkID</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SignUpView extends Vue {
  get signUpUri(): string {
    const params = new URLSearchParams();
    params.append("redirect_uri", process.env.VUE_APP_DATA_SIGN_UP_REDIRECT_URI);
    return `${process.env.VUE_APP_DATA_SIGN_UP_URL}?${params.toString()}`;
  }
}
</script>

<style scoped lang="scss"></style>
