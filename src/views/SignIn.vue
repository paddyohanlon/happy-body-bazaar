<template>
  <!-- <div class="small-container"> -->
  <div>
    <h1 class="title is-1">Sign in</h1>

    <!-- <div>{{ clientUri() }}</div> -->
    <!-- <div>
      http://127.0.0.1:4444/oauth2/auth?audience=&client_id=happy-body-auth-code-client&max_age=0&nonce=hikibhcgnhecqdjkusmetfku&prompt=&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fcallback&response_type=code&scope=openid+offline&state=dsakfzieyfuqwwyeifhmpcqd
    </div> -->

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <a :href="clientUri">Sign in with RethinkID</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { oauthClient, generateRandomString, pkceChallengeFromVerifier } from "@/oauth";

@Component
export default class SignInView extends Vue {
  created() {
    this.getClientUri();
  }

  clientUri = "";

  async getClientUri() {
    // Create and store a random "state" value
    const state = generateRandomString();
    localStorage.setItem("pkce_state", state);

    // Create and store a new PKCE code_verifier (the plaintext random secret)
    const codeVerifier = generateRandomString();
    localStorage.setItem("pkce_code_verifier", codeVerifier);

    // Hash and base64-urlencode the secret to use as the challenge
    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    this.clientUri = oauthClient.code.getUri({
      state: state,
      query: {
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      },
    });
  }
}
</script>

<style scoped lang="scss"></style>
