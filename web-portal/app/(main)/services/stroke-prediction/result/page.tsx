'use client'
import ServiceBanner from "@/components/layout/banner";
import { Loader } from "@/components/layout/loader";
import Result from "@/components/layout/result";
import { useAuth } from "@/components/providers/auth-provider";

import { PredictionResultType } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PredictionResult() {
   const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
    // const [generalAdvice, setGeneralAdvice] = useState<Advice | null>(null);
    // const [personalizedAdvice, setPersonalizedAdvice] = useState<Advice[]>([]);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const { user, loading, toggleLoading } = useAuth();

     useEffect(() => {
        toggleLoading(true);
    
        // // Set general advice from mock data
        // setGeneralAdvice(mockAdviceData.general);
    
        // Load prediction result from query params or localStorage
        // const storedResult = localStorage.getItem('PredictionResult');
        const prediction = searchParams.get('prediction');
        const probability = searchParams.get('probability');
        const riskLevel = searchParams.get('risk_level');
        const factors = searchParams.get('factors');
       
        if (prediction && probability && riskLevel && factors) {
          try {
            const parsedFactors = JSON.parse(decodeURIComponent(factors));
            if (!Array.isArray(parsedFactors)) throw new Error('Factors must be an array');
            const result: PredictionResultType = {
              prediction:parseInt(decodeURIComponent(prediction)),
              probability: parseFloat(decodeURIComponent(probability)),
              risk_level: (() => {
                const decoded = decodeURIComponent(riskLevel);
                if (["Low", "Moderate", "High"].includes(decoded)) {
                  return decoded as "Low" | "Moderate" | "High";
                }
                throw new Error('Invalid risk level');
              })(),
              factors: parsedFactors,
            };
            setPredictionResult(result);
            // localStorage.setItem('PredictionResult', JSON.stringify(result));
    
            // // Set personalized advice from mock data for authenticated users
            // if (user && parsedFactors.length > 0 && result.risk_level) {
            //   const advice = parsedFactors
            //     .map(factor => mockAdviceData.personalized[result.risk_level.toLowerCase()]?.[factor.feature])
            //     .filter((advice): advice is Advice => !!advice);
            //   setPersonalizedAdvice(advice);
            // }
          } catch (err) {
            setError('Invalid prediction data');
          }
        }
        // else if (storedResult) {
        //   try {
        //     const result: PredictionResultType = JSON.parse(storedResult);
        //     if (!Array.isArray(result.factors)) throw new Error('Factors must be an array');
        //     setPredictionResult(result);
    
        //     // // Set personalized advice from mock data for authenticated users
        //     // if (user && result.factors.length > 0 && result.risk_level) {
        //     //   const advice = result.factors
        //     //     .map(factor => mockAdviceData.personalized[result.risk_level.toLowerCase()]?.[factor.feature])
        //     //     .filter((advice): advice is Advice => !!advice);
        //     //   setPersonalizedAdvice(advice);
        //     // }
        //   } catch (err) {
        //     setError('Invalid stored prediction data');
        //   }
        // }
    
        toggleLoading(false);
      }, [toggleLoading]);
    if (loading) return <Loader/>
  return (
    <div className="min-h-screen px-2 md:px-8 lg:px-36 py-24 bg-background flex flex-col  items-center">
      {
           !predictionResult ? (<ServiceBanner title='No Predictions' description='No prediction result available. Please ensure you have completed the assessment.'/>):(<ServiceBanner
             title="Prediction Result"
             description="Here are the results of your stroke risk assessment"
           />)
          }

           {predictionResult ? (
          <>
          <div className="flex items-center justify-around gap-2">
          <Link href={"/services/stroke-prediction"} className="font-medium text-secondary-foreground  px-3 border-double border-4 py-1.5 rounded-lg bg-primary-foreground mt-1">
          
          Predict Again
          </Link>
          <Link href={"/services/stroke-prediction"} className="font-medium px-5 py-1.5 border-double border-4 rounded-lg bg-overlay-1  mt-1">Sign In</Link>

          </div>
        <Result predictionResult={predictionResult}/>
          </>
      ):(<div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-primary/60 text-lg mt-4"
        >
          <Link className='text-primary bg-secondary/60 px-3 py-2  rounded-md text-lg font-medium' href="/services/stroke-prediction">
            Complete Assessment
          </Link>
        </motion.p>
      </div>)}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-red-600 mt-4"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
