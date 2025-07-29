import { BasicUserProfileSchema, HealthDataDatabaseSchema, HealthDataFormSchema, loginSchema, PredictionDatabaseSchema, PredictionResultSchema, registerSchema } from "@/utils/helpers/schema-validation";
import z from "zod";
import { User } from "@supabase/supabase-js";

export type NavItem = {
  href: string;
  label: string;
  desc?: string;
};

export type RiskFactor = {
  feature: string;
  value:number;
  impact:number;
};

export type UserPrediction = {
  id: number;
  age: number;
  avg_glucose_level: number;
  bmi: number;
  created_at: string;
  diabetes: boolean;
  ever_married: boolean;
  factors: RiskFactor[];
  gender: string;
  heart_disease: boolean;
  hypertension: boolean;
  is_working: boolean;
  prediction: boolean;
  probability: number;
  residence_type: string;
  risk_level: 'Low' | 'Moderate' | 'High';
  smoking_status: boolean;
  updated_at: string;
  user_id: string;
};

export type Recommendation={
  risk_factor?:string,
  risk_level:'Low' | 'Moderate' | 'High',
  description:string,
  advices:string[]
}

export type UserForm = {
  avatar_url?: string;
  username: string;
  password: string;
  full_name: string;
  email: string;
};

export type MobileNav = {
  isMobileMenuOpen: boolean;
  navItems: (NavItem | NavGroupType)[];
  toggleMobileMenu: () => void;
  pathname: string;
  user: User | null;
};


export type BannerType={
  title:string,
  description:string
}
export type NavGroupType = NavItem[];

export type LoginFormInputsType = z.infer<typeof loginSchema>;

export type RegisterFormInputsType = z.infer<typeof registerSchema>;

export type HealthDataFormType = z.infer<typeof HealthDataFormSchema>;

export { HealthDataFormSchema as HealthDataSchemaType };
export type HealthDataDatabaseType=z.infer<typeof HealthDataDatabaseSchema>;

export type PredictionResultType = z.infer<typeof PredictionResultSchema>;
export type PredictionDatabaseSchemaType=z.infer<typeof PredictionDatabaseSchema>;
export type UserProfileType=z.infer<typeof BasicUserProfileSchema>

