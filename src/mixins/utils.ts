import { Component, Vue } from "vue-property-decorator";

@Component
export default class Utils extends Vue {
  weightUnit(measurementSystem: string): string {
    if (measurementSystem === "metric") {
      return "kg";
    }
    return "lb";
  }

  lengthUnit(measurementSystem: string): string {
    if (measurementSystem === "metric") {
      return "cm";
    }
    return "in";
  }
}
