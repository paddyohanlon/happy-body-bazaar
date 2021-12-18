<template>
  <div id="app">
    <!-- Start navbar -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">The Happy Body Tracker</a>

        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isActive }"
          aria-label="menu"
          aria-expanded="false"
          data-target="nav"
          @click="isActive = !isActive"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="nav" class="navbar-menu" :class="{ 'is-active': isActive }">
        <div class="navbar-start">
          <router-link :to="{ name: 'home' }" class="navbar-item">Weights</router-link>
          <router-link :to="{ name: 'measurements' }" class="navbar-item">Measurements</router-link>
          <router-link :to="{ name: 'profile' }" class="navbar-item">Profile</router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <template v-if="authenticated">
                <div class="button">{{ openIdConnect.name || openIdConnect.email }}</div>
                <button class="button" @click="signOut">Sign out</button>
              </template>
              <template v-else>
                <router-link :to="{ name: 'signUp' }" class="button is-primary">Sign up</router-link>
                <router-link :to="{ name: 'signIn' }" class="button is-light">Sign in</router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- End navbar -->
    <section class="section">
      <!-- TODO do loading here -->
      <router-view v-if="loaded" />
      <div v-else>Loading...</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { OpenIDConnect } from "@/types/types";
import { signOut } from "@/utils";

@Component
export default class App extends Vue {
  async created() {
    if (this.authenticated) {
      await this.$store.dispatch("fetchUser");
      this.loaded = true;
    } else {
      this.loaded = true;
    }
  }

  @State(state => state.authenticated) authenticated!: boolean;
  @State(state => state.openIdConnect) openIdConnect!: OpenIDConnect;

  isActive = false;
  loaded = false;

  get onlineStatus(): string {
    if (navigator.onLine) {
      return "online";
    }
    return "offline";
  }

  signOut(): void {
    signOut();
  }
}
</script>

<style lang="scss">
@import "~normalize.css/normalize.css";

// Global variables loaded via config in vue.config.js

@import "~bulma/bulma.sass";

.navbar-brand {
  font-weight: bold;
}

body {
  background: #e3f2f6;
}

.small-container {
  margin: 0 auto;
  max-width: 440px;
}
</style>
