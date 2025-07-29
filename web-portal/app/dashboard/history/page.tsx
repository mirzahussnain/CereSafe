"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  fetchPredictionRecommendations,
  fetchUserPredictions,
} from "@/utils/helpers/stroke-predictions";
import { Recommendation, UserPrediction } from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { Loader } from "@/components/layout/loader";
import Link from "next/link";
import { getCamelCaseFeature } from "@/utils/helpers/formatValues";

// Mock data with more recent entries


export default function HistoryPage() {
 
  const { user, loading: AuthLoading } = useAuth();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userPredictions, setUserPredictions] = useState<UserPrediction[]>();
  const hasFetchedPredictionData = useRef(false);
  const hasFetchedRecommendations = useRef(false);
  useEffect(() => {
    if (!user || hasFetchedPredictionData.current) return;
    async function fetchPredictions() {
      setLoading(true);
      const result = await fetchUserPredictions();
      if (result.success && result.data.length > 0) {
        setUserPredictions(result.data);
        setLoading(false);
        toast.success(result.message, { duration: 2000 });
      } else {
        setUserPredictions([]);
        setLoading(false);
        toast.error(result.message);
      }
    }
    hasFetchedPredictionData.current = true;
    fetchPredictions();
  }, [user]);

  useEffect(() => {
    if (
      hasFetchedRecommendations.current ||
      !userPredictions ||
      userPredictions.length === 0
    )
      return;
    async function getRecommendations() {
      setLoading(true);
      const result = await fetchPredictionRecommendations();
      if (result.success) {
        setRecommendations(result.data);
        toast.success(result.message);
        setLoading(false);
      } else {
        setRecommendations([]);
        setLoading(false);
        toast.error(result.message);
      }
    }
    hasFetchedRecommendations.current = true;
    getRecommendations();
  }, [userPredictions, user]);

  if (AuthLoading || isLoading) return <Loader />;
  return (
    <div className="min-h-screen bg-gradient-to-b from-overlay-2/10 to-background">
      {userPredictions && userPredictions.length > 0 ? (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <h3 className="text-muted-foreground">Total Predictions</h3>
              <p className="text-4xl font-bold mt-2">
                {userPredictions.length}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-muted-foreground">Highest Stroke Risk</h3>
              <p className="text-4xl font-bold text-red-500 mt-2">
                {parseFloat(
                  Math.max(
                    ...userPredictions.map((a) => a.probability)
                  ).toFixed(2)
                ) * 100}
                %
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-muted-foreground flex flex-col">
                Stroke Risk Trend
                <span className="text-sm text-secondary-foreground/50">
                  (Between Recent Two Predictions)
                </span>
              </h3>
              <div className="flex justify-center items-center mt-2">
                {userPredictions[0].probability >
                userPredictions[1].probability ? (
                  <TrendingUp className="w-8 h-8 text-red-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-green-500" />
                )}
                <p className="text-2xl font-bold ml-2">
                  {parseFloat(
                    Math.abs(
                      userPredictions[0].probability -
                        userPredictions[1].probability
                    ).toFixed(2)
                  ) * 100}
                  %
                </p>
              </div>
            </Card>
          </div>

          {/* Most Recent Assessment Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Recent Prediction Summary
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {new Date(userPredictions[0].created_at)
                      .toLocaleDateString()
                      .replaceAll("/", "-")}
                  </p>
                </div>
                <Badge
                  variant={
                    userPredictions[0].risk_level === "High"
                      ? "destructive"
                      : userPredictions[0].risk_level === "Moderate"
                      ? "secondary"
                      : "default"
                  }
                  className="text-sm"
                >
                  {userPredictions[0].risk_level} Risk
                </Badge>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Stroke Risk</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-32 bg-secondary rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            userPredictions[0].probability > 0.6
                              ? "bg-red-500"
                              : userPredictions[0].probability > 0.3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              parseFloat(
                                userPredictions[0].probability.toFixed(2)
                              ) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="font-bold">
                        {parseFloat(userPredictions[0].probability.toFixed(2)) *
                          100}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {userPredictions[0].probability >
                    userPredictions[1].probability ? (
                      <TrendingUp className="w-5 h-5 text-red-500" />
                    ) : userPredictions[0].probability <
                      userPredictions[1].probability ? (
                      <TrendingDown className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">→</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Key Risk Factors</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userPredictions[0].factors.map((factor, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="font-normal"
                      >
                        {factor.feature}
                      </Badge>
                    ))}
                  </div>
                </div>

               
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-6 flex flex-col">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Actions</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage your stroke risk
                </p>
              </div>
              <div className="space-y-4 mt-6 mb-10">
                <Button className="w-full py-6 text-lg bg-gradient-to-r text-secondary-foreground from-primary-foreground to-overlay-2/90 hover:from-overlay-2/90 hover:to-primary-foreground cursor-pointer">
                  <Link href={"/services/stroke-prediction"}>
                    Predict New Risk
                  </Link>
                </Button>

                {/* <Button variant="outline" className="w-full">
                  Compare Assessments
                </Button>
                <Button variant="outline" className="w-full">
                  Download Report
                </Button> */}
              </div>
            </Card>
          </div>

          {/* Risk Trend Chart
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Risk Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...mockAssessments].reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="riskPercentage" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card> */}

          {/* Tabs View */}
          <Tabs defaultValue="timeline">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {userPredictions.map((prediction) => (
                    <Card
                      key={prediction.id}
                      className="p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-4">
                            <h3 className="font-medium">
                              {new Date(prediction.created_at)
                                .toLocaleDateString()
                                .replaceAll("/", "-")}
                            </h3>
                            <Badge
                              variant={
                                prediction.risk_level === "High"
                                  ? "destructive"
                                  : prediction.risk_level === "Moderate"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {prediction.risk_level} Risk
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center">
                            <div className="w-full bg-secondary rounded-full h-2.5 mr-3">
                              <div
                                className={`h-2.5 rounded-full ${
                                  prediction.probability > 0.6
                                    ? "bg-red-500"
                                    : prediction.probability > 0.3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${
                                    parseFloat(
                                      prediction.probability.toFixed(2)
                                    ) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {parseFloat(prediction.probability.toFixed(2)) *
                                100}
                              %
                            </span>
                          </div>
                        </div>

                        {/* <div className="md:text-right">
                          <Button variant="outline" className="mr-2">
                            View Details
                          </Button>
                          <Button variant="ghost">Compare</Button>
                        </div> */}
                      </div>

                      {prediction.factors && prediction.factors.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm text-muted-foreground mb-1">
                            Key Risk Factors:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {prediction.factors.map((factor, index) => (
                              <Badge key={index} variant="secondary">
                                {factor.feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {recommendations.length > 0 &&
                        prediction.factors.slice(0,1).map((factor, factorIndex) =>
                          recommendations
                            .filter(
                              (rec) =>
                                factor.feature ===
                                getCamelCaseFeature(rec.risk_factor)
                            ).filter((rec)=>prediction.risk_level.toLowerCase()===rec.risk_level.toLowerCase())
                            .slice(0, 1) // Optional: only show the first matched recommendation per factor
                            .sort(()=>0.5-Math.random())
                            .map((rec, recIndex) =>
                              rec.advices
                                .slice(0, 2)
                                .sort(()=>0.5-Math.random())
                                .map((advice, adviceIndex) => (
                                  <div
                                    key={`${factorIndex}-${recIndex}-${adviceIndex}`}
                                    className="p-3 bg-secondary/50 rounded-md mt-3"
                                  >
                                    <p className="text-sm italic">{advice}</p>
                                  </div>
                                ))
                            )
                        )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="table">
              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Risk %</TableHead>
                      <TableHead>Key Factors</TableHead>
                      <TableHead>Recommendations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userPredictions.map((prediction) => (
                      <TableRow key={prediction.id}>
                        <TableCell>{new Date(prediction.created_at)
                                .toLocaleDateString()
                                .replaceAll("/", "-")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              prediction.risk_level === "High"
                                ? "destructive"
                                : prediction.risk_level === "Moderate"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {prediction.risk_level}
                          </Badge>
                        </TableCell>
                        <TableCell>{ parseFloat(
                                      prediction.probability.toFixed(2)
                                    ) * 100}%</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {prediction.factors.map((factor, index) => (
                              <Badge key={index} variant="secondary">
                                {factor.feature}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="italic text-sm">
                          {recommendations.length>0 &&prediction.factors[0] && recommendations.map((rec)=>{if(getCamelCaseFeature(rec.risk_factor)===prediction.factors[0].feature && prediction.risk_level.toLowerCase()===rec.risk_level)
                          return rec.advices.sort(()=>0.5-Math.random())[0]
                          })
                          
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h2 className="text-3xl tracking-wide font-medium">
            No Prediction Data Found
          </h2>
        </div>
      )}
    </div>
  );
}
