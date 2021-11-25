<template>
  <div class="small-container">
    <h1>Authenticating...</h1>
    <div v-if="error" class="notification is-danger">
      <h2>{{ error }}</h2>
      <p>{{ errorDescription }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { oauthClient } from "@/oauth";
import jwt_decode from "jwt-decode";

@Component
export default class Callback extends Vue {
  error: null | string = "";
  errorDescription: null | string = "";

  async created() {
    const params = new URLSearchParams(window.location.search);

    // Check if the auth server returned an error string
    const error = params.get("error");
    if (error) {
      this.error = error;
      this.errorDescription = params.get("error_description");
      return;
    }

    // Make sure the auth server returned a code
    const code = params.get("code");
    if (!code) {
      this.error = "No query param code";
      return;
    }

    // Verify state matches what we set at the beginning
    if (localStorage.getItem("pkce_state") !== params.get("state")) {
      this.error = "State did not match. Possible CSRF attack";
    }

    let getTokenResponse;
    try {
      getTokenResponse = await oauthClient.code.getToken(window.location.href, {
        body: {
          code_verifier: localStorage.getItem("pkce_code_verifier") || "",
        },
      });
      console.log("getTokenResponse", getTokenResponse);
    } catch (error) {
      console.log("error", error);
    }

    if (!getTokenResponse) {
      this.error = "could not get token response";
      return;
    }

    // Clean these up since we don't need them anymore
    localStorage.removeItem("pkce_state");
    localStorage.removeItem("pkce_code_verifier");

    // Store tokens and sign user in locally
    const token: string = getTokenResponse.data.access_token;
    const idToken: string = getTokenResponse.data.id_token;

    localStorage.setItem("token", token);
    localStorage.setItem("idToken", idToken);

    try {
      const tokenDecoded: { sub: string } = jwt_decode(token);
      const idTokenDecoded = jwt_decode(idToken);
      console.log("idTokenDecoded", idTokenDecoded);
      console.log("tokenDecoded", tokenDecoded);
      await this.$store.dispatch("autoSignIn", idTokenDecoded);
      this.$store.dispatch("fetchUser");
      this.$router.push({ name: "home" });
      location.reload();
    } catch (error) {
      console.log("token decode error:", error);
    }
  }
}
</script>

<style scoped lang="scss"></style>
