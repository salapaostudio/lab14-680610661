interface Registrant {
  id: string;
  fullName: string;
  gender: string;
  plan: string;
  extraItems?: string[];
  total: number;
}

const REGISTRANTS_STORAGE_KEY = "registrants";

export { REGISTRANTS_STORAGE_KEY };
export type { Registrant };
