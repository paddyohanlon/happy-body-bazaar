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
import { rid } from "@/rethinkid";

@Component
export default class Callback extends Vue {
  error = "";
  errorDescription = "";

  async created() {
    const decodedTokens = await rid.getTokens();

    if (decodedTokens.error) {
      this.error = decodedTokens.error;
      this.errorDescription = decodedTokens.errorDescription || "";
      return;
    }

    await this.$store.dispatch("autoSignIn", decodedTokens.idTokenDecoded);
    this.$store.dispatch("fetchUser");
    this.$router.push({ name: "home" });
  }
}
</script>

<style scoped lang="scss"></style>
