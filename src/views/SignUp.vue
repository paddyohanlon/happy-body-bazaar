<template>
  <div class="small-container">
    <h1 class="title is-1">Sign up</h1>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <a
            href="http://127.0.0.1:3000/sign-up?client_id=happy-body-auth-code-client&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fsign-in"
            >Sign up with RethinkID</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SignUpView extends Vue {}
</script>

<style scoped lang="scss"></style>
