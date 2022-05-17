import { Table } from "@mostlytyped/rethinkid-js-sdk/dist/types/table";

// Measurements are always stored in metric.

export type User = {
  id: string; // table row ID
  idealWeight: number;
  measurementSystem: string;
  baseDumbbellWeight: number;
  measurements: Measurement[];
};

export type UpdateUser = {
  idealWeight?: number;
  measurementSystem?: string;
  baseDumbbellWeight?: number;
  measurements?: Measurement[];
};

export type Measurement = {
  date: string; // date ISO
  weight: number;
  chest: number;
  belly: number;
  thigh: number;
};

export type OpenIDConnect = {
  id: string;
  email: string;
  name: string;
};

export type RootState = {
  loaded: boolean;
  authenticated: boolean;
  openIdConnect: OpenIDConnect;
  user: User;
  userTable: Table;
};
