// Measurements are always stored in metric.

export type User = {
  id: string;
  email: string;
  idealWeight: number;
  measurementSystem: string;
  baseDumbbellWeight: number;
};

export type AuthUser = {
  token: string;
  user: User;
};

export type UpdateUser = {
  email?: string;
  idealWeight?: number;
  measurementSystem?: string;
  baseDumbbellWeight?: number;
};

export type SignUp = {
  email: string;
  password: string;
};

export type SignIn = {
  email: string;
  password: string;
};

export type Measurement = {
  id: string;
  date: string; // date ISO
  weight: number;
  chest: number;
  belly: number;
  thigh: number;
};

export type NewMeasurement = {
  date: string; // date ISO
  weight: number;
  chest: number;
  belly: number;
  thigh: number;
};

export type RootState = {
  authenticated: boolean;
  user: User;
  measurements: Measurement[];
};
