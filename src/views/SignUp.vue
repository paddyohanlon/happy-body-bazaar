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
import { rid } from "@/rethinkid";

@Component
export default class SignUpView extends Vue {
  get signUpUri(): string {
    return rid.signUpUri();
  }
}
</script>

<style scoped lang="scss"></style>
