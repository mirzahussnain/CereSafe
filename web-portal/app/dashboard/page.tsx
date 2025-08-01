"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Loader } from "@/components/layout/loader";
import { useAuth } from "@/components/providers/auth-provider";
import { Recommendation, UserPrediction } from "@/lib/types";
import {
  fetchPredictionRecommendations,
  fetchUserPredictions,
  storePrediction,
} from "@/utils/helpers/stroke-predictions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  RiskColorTag,
} from "@/lib/data";
import {
  getCamelCaseFeature,
  getRelativeTime,
} from "@/utils/helpers/formatValues";
import { PredictionTrendChart } from "@/components/layout/chart";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [predictions, setPredictions] = useState<UserPrediction[] | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchUserPredictions = useRef(false);
  const hasStoredPrediction = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!user || hasFetchUserPredictions.current) return;
    async function fetchPredictions() {
      setIsLoading(true);
      const result = await fetchUserPredictions();
      const recommendationsResult = await fetchPredictionRecommendations();
      if (
        result.success &&
        result.data &&
        recommendationsResult.success &&
        recommendationsResult.data
      ) {
        setPredictions(result.data);
        setRecommendations(recommendationsResult.data);
        toast.success(`Successfully! ${result.message}`);
      } else {
        setPredictions([]);
        setRecommendations([]);
        toast.error(`Failed: ${result.message}`);
      }
      setIsLoading(false);
    }
    hasFetchUserPredictions.current = true;
    fetchPredictions();
  }, [user]);

  useEffect(() => {
    if (!user || hasStoredPrediction.current) return;
    async function storePredictionResult() {
      const storedPredictionData = localStorage.getItem("PredictionResult");
      if (storedPredictionData) {
        setIsLoading(true);
        const { consentRoute, predictionResult, healthData } =
          JSON.parse(storedPredictionData);
        if (consentRoute && predictionResult && healthData) {
          const result = await storePrediction(predictionResult, healthData);
          if (result.success) {
            const prediction = encodeURIComponent(
              predictionResult.prediction?.toString() || ""
            );
            const probability = encodeURIComponent(
              predictionResult.probability?.toString() || "0"
            );
            const risk_level = encodeURIComponent(
              predictionResult?.risk_level || ""
            );
            const factors = encodeURIComponent(
              JSON.stringify(predictionResult?.factors || "")
            );
            localStorage.removeItem("PredictionResult");
            toast.success(
              `Welcome ${user?.user_metadata?.full_name}, Redirecting to Result Page..`
            );
            router.push(
              `/dashboard/prediction-result?prediction=${prediction}&probability=${probability}&risk_level=${risk_level}&factors=${factors}`
            );
          } else {
            toast.error(`Failed to store prediction: ${result.message}`);
          }
        }
        if (predictions) {
          setIsLoading(false);
        } else setIsLoading(true);
      }
      hasStoredPrediction.current = true;
    }
    storePredictionResult();
  }, [user, router]);


  useEffect(()=>{},[predictions])

  if (isLoading || authLoading || !user) return <Loader />;

  return predictions && predictions.length > 0 ? (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card className="bg-gradient-to-r from-overlay-2/40 to-overlay-2/40 border-overlay-2/40">
        <CardHeader>
          <CardTitle>
            Welcome back,{" "}
            <span className="text-destructive">
              {user?.user_metadata?.full_name}
            </span>
            !
          </CardTitle>
          <CardDescription>
            Your recent predicted stroke risk:
            <Badge
              className={`ml-2 capitalize ${RiskColorTag(
                predictions[0].risk_level
              )}`}
            >
              {predictions[0].risk_level} (
              {parseFloat(predictions[0].probability.toFixed(2)) * 100}%)
            </Badge>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Risk Score */}
        <Card>
          <CardHeader>
            <CardTitle>Stroke Risk Score</CardTitle>
            <CardDescription>
              {predictions[0].probability > predictions[1].probability
                ? "Increased"
                : "Decreased"}{" "}
              from last month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center py-2">
              {parseFloat(predictions[0].probability.toFixed(2)) * 100}%
            </div>
            <Progress
              value={parseFloat((predictions[0].probability * 100).toFixed(2))}
              className={`h-2 ${RiskColorTag(predictions[0].risk_level)}`}
            />
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Hypertension (High Blood Pressure)
              </span>
              <Badge
                variant={
                  predictions[0].hypertension ? "destructive" : "default"
                }
              >
                {predictions[0].hypertension ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">BMI</span>
              <span className="font-medium">{predictions[0].bmi}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Glucose</span>
              <span className="font-medium">
                {predictions[0].avg_glucose_level} mg/dL
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <a
                href="/services/stroke-prediction"
                rel="noopener noreferrer"
                aria-label="Prediction"
              >
                Predict Stroke Risk
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <a
                href="/dashboard/history"
                rel="noopener noreferrer"
                aria-label="History"
              >
                Track Your History
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PredictionTrendChart predictionsData={predictions} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="overflow-y-auto">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {predictions.slice(0, 3).map((log, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="text-blue-800 font-medium text-sm">
                  {getRelativeTime(log.created_at)}
                </p>
                <p className="text-muted-foreground text-xm">
                  Stroke Predicted:{" "}
                  {parseFloat((log.probability * 100).toFixed(2))}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
       
      </div>
       {/* Recommendations */}
        {predictions.length > 0 && recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {predictions[0].factors
                  .sort((a, b) => b.impact - a.impact) 
                  .slice(0, 3)
                  .flatMap((factor) =>
                    recommendations
                      .filter(
                        (rec) =>
                          rec.risk_level.toLowerCase() ===
                          predictions[0].risk_level.toLowerCase()
                      )
                      .filter(
                        (filteredRec) =>
                          getCamelCaseFeature(filteredRec.risk_factor) ===
                          factor.feature
                      )
                      .flatMap((frec,index) => (
                        <li key={`${frec.risk_factor}-${index}`} className="flex items-start gap-2">
                          <div className="bg-green-100 p-1 rounded-full">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span>
                            <strong className="mr-2">{factor.feature}:</strong>
                            {frec.advices[0]}
                          </span>
                        </li>
                      ))
                  )}
              </ul>
            </CardContent>
          </Card>
        )}
    </div>
  ) : (
    <div className="w-full h-full flex flex-col justify-center items-center my-auto">
      <h2 className="text-3xl tracking-wide text-center my-5">
        No Prediction Data Found. Please submit health data to get started.
      </h2>
      <Button
        className="py-7 bg-accent text-background text-xs text-semibold"
        onClick={() => router.push("/service/stroke-prediction")}
      >
        Submit Health Data
      </Button>
    </div>
  );
}
