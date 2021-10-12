<template>
  <div class="small-container">
    <h1 class="title is-1">Sign up</h1>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <div v-if="errors.length > 0" class="errors">
            <div v-for="error of errors" :key="error.id" class="notification is-danger mb-4" role="alert">
              {{ error }}
            </div>
          </div>
          <form @submit.prevent="submitSignUp">
            <div class="field mb-5">
              <label class="label" for="email">Email</label>
              <div class="control">
                <input id="email" v-model="signUp.email" class="input" type="email" required />
              </div>
            </div>
            <div class="field mb-5">
              <label class="label" for="password">Password</label>
              <div class="control">
                <input id="password" v-model="signUp.password" class="input" type="password" required />
              </div>
            </div>
            <button class="button is-primary">Sign up</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SignUp } from "@/types/types";

@Component
export default class SignUpView extends Vue {
  signUp: SignUp = {
    email: "",
    password: "",
  };

  errors: string[] = [];

  async submitSignUp(): Promise<void> {
    this.errors = await this.$store.dispatch("signUp", this.signUp);

    if (this.errors.length === 0) {
      this.$router.push({ name: "profile" });
    }
  }
}
</script>

<style scoped lang="scss"></style>
