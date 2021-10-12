<template>
  <div class="small-container">
    <h1 class="title is-1">Profile</h1>

    <div v-if="!updateUser.idealWeight" class="notification is-info mb-4">
      Fill in your ideal weight so we can calculate your progress as you add measurements.
    </div>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <form @submit.prevent="$store.dispatch('updateUser', updateUser)">
            <label class="label" for="ideal-weight">Ideal weight</label>
            <div class="field has-addons mb-5">
              <div class="control">
                <input id="ideal-weight" v-model.number="updateUser.idealWeight" class="input" inputmode="decimal" />
              </div>
              <div class="control">
                <span class="button is-static">{{ weightUnit(user.measurementSystem) }}</span>
              </div>
            </div>

            <div class="field mb-5">
              <div class="label">Measurement system</div>
              <div class="control">
                <label class="radio">
                  <input type="radio" v-model="updateUser.measurementSystem" value="metric" />
                  Metric
                </label>
                <label class="radio">
                  <input type="radio" v-model="updateUser.measurementSystem" value="imperial" />
                  US/Imperial
                </label>
              </div>
            </div>

            <button class="button is-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import Utils from "@/mixins/utils";
import { User, UpdateUser } from "@/types/types";

@Component
export default class Profile extends Mixins(Utils) {
  created() {
    // For when user already fetched and navigating to from other view
    this.createUpdateUser();
  }

  @State(state => state.user) user!: User;

  // For when fetch hasn't completed before `created()`
  @Watch("user")
  onUserChanged() {
    this.createUpdateUser();
  }

  createUpdateUser(): void {
    this.updateUser = {
      idealWeight: this.user.idealWeight,
      measurementSystem: this.user.measurementSystem,
    };
  }

  // Create separate user object so unsaved updates are not immediately reflected
  updateUser: UpdateUser = {
    idealWeight: 0,
    measurementSystem: "",
  };
}
</script>

<style scoped lang="scss"></style>
