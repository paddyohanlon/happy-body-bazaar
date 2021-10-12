<template>
  <div class="container">
    <h1 class="title is-1">Measurements</h1>

    <!-- Big stats -->
    <template v-if="measurements.length > 0">
      <div class="level">
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal weight</div>
            <div class="title">{{ measurements[0].weight }}/{{ user.idealWeight.toFixed(1) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal muscle</div>
            <div class="title">
              {{ muscleWeight(measurements[0]).toFixed(2) }}/{{ idealWeightMuscle.toFixed(2) }}kg (90%)
            </div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal muscle %</div>
            <div class="title">{{ ((1 - fatPercent(measurements[0])) * 100).toFixed() }}/90%</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal fat weight</div>
            <div class="title">{{ fatWeight(measurements[0]).toFixed(2) }}/{{ this.idealWeightFat.toFixed(2) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal fat %</div>
            <div class="title">{{ (fatPercent(measurements[0]) * 100).toFixed() }}/10%</div>
          </div>
        </div>
      </div>

      <div class="level">
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">weight to gain</div>
            <div class="title">{{ weightToGain.toFixed(2) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">fat to lose</div>
            <div class="title">{{ fatWeightToLose.toFixed(2) }}kg</div>
            <div class="is-size-7">weeks remaining: {{ weeksToIdealFat.toFixed(2) }}</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">muscle to gain</div>
            <div class="title">{{ muscleWeightToGain.toFixed(2) }}kg</div>
            <div class="is-size-7">weeks remaining: {{ weeksToIdealMuscle.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </template>

    <div class="grid-measurements">
      <!-- Form -->
      <div class="card mb-4">
        <div class="card-content">
          <div class="content">
            <form @submit.prevent="addMeasurement">
              <!-- body weight -->
              <label class="label" for="body-weight">Body weight</label>
              <div class="field has-addons">
                <div class="control">
                  <input
                    id="body-weight"
                    v-model.number="newMeasurement.weight"
                    class="input"
                    type="text"
                    inputmode="numeric"
                  />
                </div>
                <div class="control">
                  <span class="button is-static">
                    {{ weightUnit(user.measurementSystem) }}
                  </span>
                </div>
              </div>

              <!-- Chest -->
              <label class="label" for="size-chest">Chest</label>
              <div class="field has-addons">
                <div class="control">
                  <input
                    id="size-chest"
                    v-model.number="newMeasurement.chest"
                    class="input"
                    type="text"
                    inputmode="numeric"
                  />
                </div>
                <div class="control">
                  <span class="button is-static">{{ lengthUnit(user.measurementSystem) }}</span>
                </div>
              </div>
              <label class="label" for="size-belly">Belly</label>
              <div class="field has-addons">
                <div class="control">
                  <input
                    id="size-belly"
                    v-model.number="newMeasurement.belly"
                    class="input"
                    type="text"
                    inputmode="numeric"
                  />
                </div>
                <div class="control">
                  <span class="button is-static">{{ lengthUnit(user.measurementSystem) }}</span>
                </div>
              </div>
              <label class="label" for="size-thigh">Thigh</label>
              <div class="field has-addons">
                <div class="control">
                  <input
                    id="size-thigh"
                    v-model.number="newMeasurement.thigh"
                    class="input"
                    type="text"
                    inputmode="numeric"
                  />
                </div>
                <div class="control">
                  <span class="button is-static">{{ lengthUnit(user.measurementSystem) }}</span>
                </div>
              </div>
              <button class="button is-primary">Save</button>
            </form>
          </div>
        </div>
      </div>
      <!-- Measurements -->
      <div class="card mb-4">
        <div class="card-content">
          <div class="content">
            <div class="table-container" v-if="measurements.length > 0">
              <table class="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Size</th>
                    <th>Fat</th>
                    <th>Muscle</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody role="region" aria-live="polite">
                  <tr v-for="measurement in measurements" :key="measurement.id">
                    <td>{{ new Date(measurement.date).toLocaleDateString() }}</td>
                    <td>{{ measurement.weight }}{{ weightUnit(user.measurementSystem) }}</td>
                    <td>{{ sizeTotal(measurement).toFixed(2) }}{{ lengthUnit(user.measurementSystem) }}</td>
                    <td>
                      {{ fatPercent(measurement) * 100 }}% ({{ fatWeight(measurement).toFixed(2)
                      }}{{ weightUnit(user.measurementSystem) }})
                    </td>
                    <td>
                      {{ (1 - fatPercent(measurement)) * 100 }}% ({{ muscleWeight(measurement).toFixed(2)
                      }}{{ weightUnit(user.measurementSystem) }})
                    </td>
                    <td>
                      <button class="button is-small is-info is-inverted" @click="deleteMeasurement(measurement.id)">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p>Time to get tracking! Add your first measurement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { State } from "vuex-class";
import Utils from "@/mixins/utils";
import { User, Measurement, NewMeasurement } from "@/types/types";

@Component
export default class Measurements extends Mixins(Utils) {
  async created() {
    if (!this.user.idealWeight) {
      this.$router.push({ name: "profile" });
      return;
    }
    this.$store.dispatch("fetchMeasurements");
  }

  @State(state => state.user) user!: User;
  @State(state => state.measurements) measurements!: Measurement[];

  newMeasurementInitial: NewMeasurement = {
    date: new Date().toISOString(),
    weight: 0,
    chest: 0,
    belly: 0,
    thigh: 0,
  };

  newMeasurement: NewMeasurement = this.newMeasurementInitial;

  lb = "lb";
  cm = "cm";
  inch = "'";

  kgInLb = 2.204623;
  cmInInch = 0.3937;

  fatLossPerWeekRate = 0.795454;
  muscleGainPerWeekRate = 0.1587573;

  get idealWeightFat() {
    return this.user.idealWeight * 0.1;
  }

  get idealWeightMuscle() {
    return this.user.idealWeight * 0.9;
  }

  get fatWeightToLose() {
    return this.fatWeight(this.measurements[0]) - this.idealWeightFat;
  }

  get weeksToIdealFat() {
    return this.fatWeightToLose / this.fatLossPerWeekRate;
  }

  get weightToGain() {
    return this.user.idealWeight - this.measurements[0].weight;
  }

  get muscleWeightToGain() {
    return this.idealWeightMuscle - this.muscleWeight(this.measurements[0]);
  }

  get weeksToIdealMuscle() {
    return this.muscleWeightToGain / this.muscleGainPerWeekRate;
  }

  addMeasurement() {
    this.$store.dispatch("addMeasurement", this.newMeasurement);
    this.newMeasurement = Object.assign({}, this.newMeasurementInitial);
  }

  deleteMeasurement(measurementId: string) {
    const deleteConfirmed = window.confirm("Are you sure? This can't be undone.");
    if (deleteConfirmed) {
      this.$store.dispatch("deleteMeasurement", measurementId);
    }
  }

  sizeTotal(measurement: Measurement): number {
    return measurement.chest + measurement.belly + measurement.thigh;
  }

  fatPercent(measurement: Measurement): number {
    const sizeTotal = this.sizeTotal(measurement);
    /*
      1 3/16'  = 1.1875' = 3.01625cm = 10%
      1 3/8'   = 1.375'  = 3.4925cm  = 11%
      1 9/16'  = 1.5625' = 3.96875cm = 12%
      1 3/4'   = 1.75'   = 4.445cm   = 13.5%
      2'       = 2'      = 5.08cm    = 15%
    */
    if (sizeTotal <= 3.01625) return 0.1;
    if (sizeTotal <= 3.4925) return 0.11;
    if (sizeTotal <= 3.96875) return 0.12;
    if (sizeTotal <= 4.445) return 0.13;
    if (sizeTotal <= 5.08) return 0.15;
    return 16.5; // or more
  }

  fatWeight(measurement: Measurement): number {
    return this.fatPercent(measurement) * measurement.weight;
  }

  muscleWeight(measurement: Measurement): number {
    return measurement.weight - this.fatWeight(measurement);
  }
}
</script>

<style scoped lang="scss">
.grid-measurements {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1em;
}
</style>
