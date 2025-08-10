
import { HealthDataFormType, PredictionResultType } from "@/lib/types"
import { HealthDataFormSchema } from "./schema-validation";

export const predictStroke=async(data:HealthDataFormType)=>{
   try{
    const dataToSend={
        Age:data.Age,
        Hypertension:data.Hypertension? 1 : 0,
        HeartDisease:data.HeartDisease? 1 : 0,
        EverMarried:data.EverMarried,
        Gender:data.Gender,
        ResidenceType:data.ResidenceType,
        AvgGlucoseLevel:data.AvgGlucoseLevel,
        Bmi:data.Bmi,
        IsWorking:data.IsWorking?"Yes":"No",
        SmokingStatus:data.SmokingStatus,
        Diabetes:data.AvgGlucoseLevel>138?1:0,
    }
    const apiPath=process.env.NEXT_PUBLIC_MODEL_API
    const response=await fetch(`${apiPath}/api/predict`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(dataToSend)
    })

   if (!response.ok) {
      const errorData = await response.json();
      
      if (response.status === 422) {
        // Validation error
        const missingFields = errorData.detail.map((error: { loc: string | any[]; }) => error.loc[error.loc.length - 1]);
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    else{
        const result = await response.json();
        
        return {success:1,message:"Prediction successful",data:result};
    }

   }catch(error){
    return {success:0,message:(error instanceof Error ? error.message : "An unexpected error occurred")};
   }
    
    
}

export const storePrediction=async(predictionData:PredictionResultType,healthData:HealthDataFormType)=>{
  try{
     const response = await fetch('/api/store-predictions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            healthData: healthData,
            predictionResult: {
              prediction: predictionData.prediction,
              probability: predictionData.probability,
              risk_level: predictionData.risk_level,
              factors: predictionData.factors,
            },
          }),
        });
      const result = await response.json();
      if (result.success) {
        return {success:1,message:"Prediction stored successfully! Redirecting to Dashboard"}
        
        } else {
          return {success:0,message:`Failed to store prediction: ${result.error}`}

        }

  }catch(error){
    return {success:0,message:"Failed to Store Prediction, Some Internal Error"}
  }
}

export const fetchUserPredictions=async()=>{
  try{
    const response= await fetch('/api/user-predictions',{
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      },
    });
    const result=await response.json();
    if(result.success){
      return {success:1, message:"Predictions Fetched Successfully!",data:result.data}
    }
    else{
      return {success:0,message:`Faied to Store Predictions ${result.message}`}
    }
  }catch(error){
    return {success:0,message:`Internal Error:${error}`}
  }
}

export const fetchPredictionRecommendations=async()=>{
  try{
    const response=await fetch("/api/fetch-recommendations",{
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      }
      
    });

    const result=await response.json()
    if(result.success && result.data){
      return {success:1,data:result.data,message:"Recommendations Fetched Successfully"}
    }
    else{
      return {success:0,message:"Failed to fetch recommendations"}
    }

  }
  catch(error){
    return {success:0,message:`Failed!${error}`}
  }
}