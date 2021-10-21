// Measurements are always stored in metric.

export type User = {
  id: string;
  email: string;
  idealWeight: number;
  measurementSystem: string;
  baseDumbbellWeight: number;
  measurements: Measurement[];
};

export type UpdateUser = {
  email?: string;
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

export type RootState = {
  authenticated: boolean;
  user: User;
};
