import { createClient } from "@/lib/supabase/server";
import {
  HealthDataDatabaseType,
  PredictionDatabaseSchemaType,
  PredictionResultType,
} from "@/lib/types";
import {
  HealthDataFormSchema,
  PredictionResultSchema,
} from "@/utils/helpers/schema-validation";
import { NextResponse } from "next/server";

// Define the schema (same as in HealthDataForm.tsx)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { healthData, predictionResult } = body;
    // Validate userId and healthData
    if (!healthData || !predictionResult) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }
    // Validate healthData against the schema
    const parsedData = HealthDataFormSchema.safeParse(healthData);
    const parsedPredictionResult =
      PredictionResultSchema.safeParse(predictionResult);
    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: "Invalid health data" },
        { status: 400 }
      );
    }
    if (!parsedPredictionResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid Prediction Result Data" },
        { status: 400 }
      );
    }
    const refinedData: HealthDataDatabaseType = {
      age: parsedData.data.Age,
      diabetes: parsedData.data.AvgGlucoseLevel >126,
      ever_married: parsedData.data.EverMarried === "Yes",
      is_working: parsedData.data.SmokingStatus === "Yes",
      residence_type: parsedData.data.ResidenceType,
      heart_disease: parsedData.data.HeartDisease,
      hypertension: parsedData.data.Hypertension,
      avg_glucose_level: parsedData.data.AvgGlucoseLevel,
      gender: parsedData.data.Gender,
      bmi: parsedData.data.Bmi,
      smoking_status:parsedData.data.SmokingStatus==='Yes'
    };
    const refinedResult: PredictionDatabaseSchemaType = {
      prediction: parsedPredictionResult.data?.probability === 1,
      probability: parsedPredictionResult.data?.probability,
      factors: parsedPredictionResult.data.factors,
      risk_level: parsedPredictionResult.data.risk_level,
      created_at: new Date().toISOString(),
    };
    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { error: insertError } = await supabase.from("predictions").insert({
      user_id: user.user?.id,
      age: refinedData.age,
      diabetes: refinedData.diabetes,
      ever_married: refinedData.ever_married,
      is_working: refinedData.is_working,
      residence_type: refinedData.residence_type,
      heart_disease: refinedData.heart_disease,
      hypertension: refinedData.hypertension,
      avg_glucose_level: refinedData.avg_glucose_level,
      gender: refinedData.gender,
      bmi: refinedData.bmi,
      smoking_status:refinedData.smoking_status,
      prediction: refinedResult.prediction,
      probability: refinedResult.probability,
      risk_level: refinedResult.risk_level,
      factors: refinedResult.factors,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError.message);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to store prediction",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Prediction stored successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
