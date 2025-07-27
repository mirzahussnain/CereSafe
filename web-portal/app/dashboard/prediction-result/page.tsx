'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import ServiceBanner from '@/components/layout/banner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getRefinedFeatures, RiskColorCard, RiskColorTag } from '@/lib/data';
import { PredictionResultSchema } from '@/utils/helpers/schema-validation';
import { PredictionResultType } from '@/lib/types';
import Result from '@/components/layout/result';

interface Advice {
  description: string;
  advice: string[];
}

interface PersonalizedAdvice {
  [riskLevel: string]: {
    [factor: string]: Advice;
  };
}

interface MockAdviceData {
  general: Advice;
  personalized: PersonalizedAdvice;
}



const mockAdviceData: MockAdviceData = {
  general: {
    description: "You're a health superstar! Keep shining with these tips to stay ahead!",
    advice: [
      "Maintain a balanced diet rich in fruits and vegetables.",
      "Engage in regular physical activity (30 minutes most days).",
      "Schedule yearly check-ups to monitor your health.",
    ],
  },
  personalized: {
    low: {
      hypertension: {
        description: "Your blood pressure is a factor to watch, but you're doing great!",
        advice: ["Monitor blood pressure weekly.", "Reduce salt intake to keep it in check."],
      },
      Bmi: {
        description: "Your BMI is under control, but let's keep it that way!",
        advice: ["Maintain a healthy weight with balanced meals.", "Stay active with regular exercise."],
      },
      age: {
        description: "Age is just a number, and you're rocking it!",
        advice: ["Stay active to maintain mobility.", "Regular health screenings are key."],
      },
      heart_disease: {
        description: "Heart health is important, and you're on the right track!",
        advice: ["Follow a heart-healthy diet.", "Consult your doctor for regular check-ups."],
      },
      avg_glucose_level: {
        description: "Your glucose levels are stable, keep it up!",
        advice: ["Limit sugary foods and drinks.", "Monitor glucose levels periodically."],
      },
      smoking_status: {
        description: "Staying smoke-free is a win for your health!",
        advice: ["Continue avoiding smoking.", "Avoid secondhand smoke exposure."],
      },
    },
    moderate: {
      hypertension: {
        description: "Your blood pressure needs attention to lower your risk.",
        advice: ["Check blood pressure daily.", "Consider stress-reducing activities like yoga."],
      },
      bmi: {
        description: "Your BMI suggests a moderate risk; let's work on it!",
        advice: ["Aim to lose 5-10% of body weight if overweight.", "Incorporate strength training."],
      },
      age: {
        description: "Age is a factor, but you can stay proactive!",
        advice: ["Increase physical activity to boost heart health.", "Regular screenings for age-related risks."],
      },
      heart_disease: {
        description: "Heart disease increases risk, but you can manage it!",
        advice: ["Follow cardiologist recommendations.", "Adopt a low-cholesterol diet."],
      },
      AvgGlucoseLevel: {
        description: "Moderate glucose levels need monitoring.",
        advice: ["Test glucose levels regularly.", "Choose low-glycemic foods."],
      },
      smoking_status: {
        description: "Smoking increases your risk; time to quit!",
        advice: ["Seek smoking cessation support.", "Avoid triggers that encourage smoking."],
      },
    },
    high: {
      hypertension: {
        description: "High blood pressure is a key risk factor; let's address it!",
        advice: ["Monitor blood pressure twice daily.", "Consult a doctor for medication if needed."],
      },
      bmi: {
        description: "High BMI significantly increases risk; let's take action!",
        advice: ["Work with a dietitian to create a weight loss plan.", "Increase daily physical activity."],
      },
      age: {
        description: "Age is a major factor; proactive steps are crucial!",
        advice: ["Prioritize heart-healthy habits.", "Regular medical check-ups are essential."],
      },
      heart_disease: {
        description: "Heart disease is a serious risk; take immediate steps!",
        advice: ["Follow a strict heart-healthy diet.", "Schedule regular cardiology visits."],
      },
      avg_glucose_level: {
        description: "High glucose levels need urgent attention!",
        advice: ["Monitor glucose daily.", "Consult a doctor for diabetes management."],
      },
      smoking_status: {
        description: "Smoking is a critical risk; quitting is essential!",
        advice: ["Join a smoking cessation program.", "Use nicotine replacement therapy if needed."],
      },
    },
  },
};

export default function PredictionDashboardResult() {
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [generalAdvice, setGeneralAdvice] = useState<Advice | null>(null);
  const [personalizedAdvice, setPersonalizedAdvice] = useState<Advice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { user, toggleLoading } = useAuth();

  useEffect(() => {
    toggleLoading(true);

    // Set general advice from mock data
    setGeneralAdvice(mockAdviceData.general);

    // Load prediction result from query params or localStorage
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

        // Set personalized advice from mock data for authenticated users
        if (user && parsedFactors.length > 0 && result.risk_level) {
          const advice = parsedFactors
            .map(factor => mockAdviceData.personalized[result.risk_level.toLowerCase()]?.[factor.feature])
            .filter((advice): advice is Advice => !!advice);
          setPersonalizedAdvice(advice);
        }
      } catch (err) {
        setError('Invalid prediction data');
      }
    } 

    toggleLoading(false);
  }, [user, toggleLoading]);

  
  
  
  return (
    <div className="min-h-screen px-2 md:px-8 lg:px-36 py-12 flex flex-col items-center ">
     {
      !predictionResult ? (<ServiceBanner title='No Predictions' description='No prediction result available. Please ensure you have completed the assessment.'/>):(<ServiceBanner
        title="Prediction Result"
        description="Here are the results of your stroke risk assessment"
      />)
     }
      {/* {user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mb-8 flex justify-center itcems-center gap-3 mt-3"
        >
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => {
             
              setPredictionResult(null);
              setPersonalizedAdvice([]);
              setError(null);
              localStorage.removeItem('PredictionResult');
            }}
          >
            Log Out
          </Button>
          {/* Simulate login for testing */}
          {/* <Button
            variant="outline"
            className="ml-4"
          
          >
            Simulate Login
          </Button>
        </motion.div>
      )}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mb-8"
        >
          <Button >
            Log In for Personalized Recommendations
          </Button>
        </motion.div>
      )} */} 
      {predictionResult ? (
        <Result predictionResult={predictionResult}/>
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
      {/* {(generalAdvice || personalizedAdvice.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-3xl mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {generalAdvice && !user && (
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700">General Advice</h3>
                  <p className="text-gray-600 mb-2">{generalAdvice.description}</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {generalAdvice.advice.map((item, index) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {personalizedAdvice.length > 0 && user && (
                <div>
                  <h3 className="text-xl font-medium text-gray-700">Personalized Recommendations</h3>
                  {personalizedAdvice.map((advice, index) => (
                    <div key={index} className="mt-4">
                      <p className="text-gray-600 font-medium">{"hello"}</p>
                      <ul className="list-disc pl-5 space-y-2">
                        {advice.advice.map((item, i) => (
                          <li key={i} className="text-gray-600">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )} */}
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