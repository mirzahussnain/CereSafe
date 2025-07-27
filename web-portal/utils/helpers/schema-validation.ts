import * as z from "zod";
export const registerSchema = z.object({
  username: z
    .string()
    .min(6, "Username must have atleast 6 characters")
    .regex(/^[A-Za-z0-9]+$/, "Username must no contain any sepcial characters"),
  password: z
    .string()
    .min(8, "Password should be atleast 8 characters long")
    .regex(/[A-Z]/, "One uppercase letter required")
    .regex(/[a-z]/, "One lowercase letter required")
    .regex(/[0-9]/, "One number required")
    .regex(/[^A-Za-z0-9]/, "One special character required"),
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,50}$/,
      "Name can only contain letters and spaces (no hyphens or apostrophes)"
    ),
  email: z
    .email()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email (e.g., user@example.com)"
    ),
});

export const loginSchema = z.object({
  password: z.string().min(1,"Please enter valid password"),
  email: z
    .email()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email (e.g., user@example.com)"
    ),
});

export const HealthDataFormSchema=z.object({
  Age:z.number().min(0,"Age can't be less than 0").max(120,"Age can't be more than 120"),
  Hypertension:z.boolean(),
  HeartDisease:z.boolean(),
  EverMarried:z.enum(["Yes","No"],"Marital status can only be Yes or No"),
  Gender:z.enum(["Male","Female"]),
  ResidenceType:z.enum(["Urban","Rural"]),
  AvgGlucoseLevel:z.number(),
  Bmi:z.number().max(50,"Bmi can't be more than 50"),
  IsWorking:z.boolean(),
  SmokingStatus:z.enum(["Yes","No"],"Smoking status can only be Yes or No"),
 
})

export const HealthDataDatabaseSchema=z.object({
  age:z.number().min(0,"Age can't be less than 0").max(120,"Age can't be more than 120"),
  hypertension:z.boolean(),
  heart_disease:z.boolean(),
  ever_married:z.boolean(),
  gender:z.enum(["Male","Female"]),
  residence_type:z.enum(["Urban","Rural"]),
  avg_glucose_level:z.number(),
  bmi:z.number().max(50,"Bmi can't be more than 50"),
  is_working:z.boolean(),
  smoking_status:z.boolean(),
  diabetes:z.boolean()
})

export const PredictionResultSchema=z.object({
  risk_level:z.enum(["Low","Moderate","High"],"Risk level can only be Low, Moderate or High"),
  prediction:z.number().min(0,"Prediction can't be less than 0").max(1,"Prediction can't be more than 1"),
  probability:z.number().min(0,"Probability can't be less than 0").max(1,"Probability can't be more than 1"),
  factors:z.array(z.object({
    feature:z.string(),
    value:z.number(),
    impact:z.number()
  })).nonempty("Factors cannot be empty")
})

export const PredictionDatabaseSchema=z.object({
  risk_level:z.enum(["Low","Moderate","High"],"Risk level can only be Low, Moderate or High"),
  prediction:z.boolean(),
  probability:z.number().min(0,"Probability can't be less than 0").max(1,"Probability can't be more than 1"),
  factors:z.array(z.object({
    feature:z.string(),
    value:z.number(),
    impact:z.number()
  })).nonempty("Factors cannot be empty"),
  created_at:z.ZodISODateTime
})

export const BasicUserProfileSchema=z.object({
  username:z.string()
    .min(6, "Username must have atleast 6 characters")
    .regex(/^[A-Za-z0-9]+$/, "Username must no contain any sepcial characters"),
  email:z.email(),
  full_name:z.string().min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,50}$/,
      "Name can only contain letters and spaces (no hyphens or apostrophes)"),
  id:z.string()
})
