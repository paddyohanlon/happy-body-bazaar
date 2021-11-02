// Measurements are always stored in metric.

export type User = {
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
  userId: string;
  email: string;
  name: string;
};

export type RootState = {
  authenticated: boolean;
  openIdConnect: OpenIDConnect;
  user: User;
};
