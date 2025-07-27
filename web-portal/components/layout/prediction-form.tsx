"use client";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HealthDataFormType, PredictionResultType } from "@/lib/types";
import { HealthDataFormSchema } from "@/utils/helpers/schema-validation";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Checkbox } from "../ui/checkbox";
import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { ConsentModal } from "./consent-dialog";
import { useAuth } from "../providers/auth-provider";
import { Loader } from "./loader";
import {
  predictStroke,
  storePrediction,
} from "@/utils/helpers/stroke-predictions";
import { useRouter } from "next/navigation";

export default function PredictionForm() {
  const [formData, setFormData] = useState<HealthDataFormType>();
  const [predictionResult, setPredictionResult] = useState<PredictionResultType>();
  const { user, loading, toggleLoading } = useAuth();
  const router = useRouter();
  const [isModelOpen, toggleModel] = useState<boolean>(false);
  const form = useForm<HealthDataFormType>({
    resolver: zodResolver(HealthDataFormSchema),
    defaultValues:{
      Hypertension:false,
      HeartDisease:false,
      IsWorking:false
    }
  });

  // Handle form submission
  const onSubmit = async (data: HealthDataFormType) => {
    setFormData(data);
    toggleLoading(true);
    const result = await predictStroke(data);
    if (result.success === 1 && result.data) {
      const newPredictionResult:PredictionResultType = {
        prediction: result.data.prediction,
        probability: result.data.probability,
        risk_level: result.data.risk_level,
        factors: result.data.top_contributors,
      };

      setPredictionResult(newPredictionResult);
     
      if (user) {
        const databaseApiResult = await storePrediction(
          newPredictionResult,
          data
        );
        if (databaseApiResult.success) {
          toggleLoading(false);
          toast.success(databaseApiResult?.message);
          const prediction = encodeURIComponent(result.data.prediction?.toString() || "");
          const probability = encodeURIComponent(
            result.data.probability?.toString() || "0"
          );
          const riskLevel = encodeURIComponent(result.data?.risk_level || "");
          const factors = encodeURIComponent(
            JSON.stringify(result.data?.top_contributors || "")
          );
          toast.message("Success! Redirecting to Results Page.");
          router.push(
            `/dashboard/prediction-result?prediction=${prediction}&probability=${probability}&risk_level=${riskLevel}&factors=${factors}`
          );
        } else {
          toggleLoading(false)
          toast.error(`${databaseApiResult.message}`);
        }
      } else {
        toggleModel(true);
        toggleLoading(false);
      }
    } else {
      toggleLoading(false);
      toast.error(result?.message);
    }
  };

  const handleConsent = () => {
    toggleModel(false);
    if (predictionResult && predictionResult && formData) {
      localStorage.setItem(
        "PredictionResult",
        JSON.stringify({ predictionResult, consentRoute: 1,healthData:formData })
      );
      toast.message("Redirecting to Login....");
      router.push("/login");
    } else {
      toggleLoading(false);
      toast.error("Failed to predict stroke, try again");
    }
  };
  const handleRejection = () => {
    toast.success("No Worries! Redirecting to Result Page");
    toggleModel(false);
    if (predictionResult && predictionResult) {
      const prediction = encodeURIComponent(predictionResult?.prediction?.toString());
      const probability = encodeURIComponent(predictionResult?.probability?.toString());
      const risk_level=encodeURIComponent(predictionResult.risk_level)
      const factors=encodeURIComponent(JSON.stringify(predictionResult.factors));
      router.push(
        `/services/stroke-prediction/result?prediction=${prediction}&probability=${probability}&risk_level=${risk_level}&factors=${factors}`
      );
    } else {
      toast.error("Failed to predict stroke, try again");
    }
  };

  if (loading) return <Loader />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl  bg-zinc-300  mt-2 rounded-2xl"
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-light text-sm text-primary/40 tracking-wide border-b-[1px] outline-offset-2 py-1">
            Demographic
          </CardTitle>
        </CardHeader>

        <CardContent className="-mt-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 grid grid-cols-1 md:grid-cols-2 md:space-x-4"
            >
              <FormField
                control={form.control}
                name="Age"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel className="text-secondary/90">Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Your Age (0-120)"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender Field */}
              <FormField
                control={form.control}
                name="Gender"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel className="text-secondary/90">Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="outline-1  outline-primary/20 py-2 rounded-lg text-sm flex justify-between items-center">
                        <SelectTrigger className="text-start px-3 cursor-pointer">
                          <SelectValue
                            placeholder="Select"
                            className="placeholder-shown:text-sm"
                          ></SelectValue>
                          <ArrowDown size={15} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male" className="cursor-pointer">
                          Male
                        </SelectItem>
                        <SelectItem value="Female" className="cursor-pointer">
                          Female
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Married Field */}
              <FormField
                control={form.control}
                name="EverMarried"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel className="text-secondary/90">Married</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="outline-1  outline-primary/20 py-2 rounded-lg text-sm flex justify-between items-center">
                        <SelectTrigger className="text-start px-3 cursor-pointer">
                          <SelectValue
                            placeholder="Select"
                            className="placeholder-shown:text-sm"
                          />
                          <ArrowDown size={15} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes" className="cursor-pointer">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="cursor-pointer">
                          No
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Residence Field */}
              <FormField
                control={form.control}
                name="ResidenceType"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel className="text-secondary/90">
                      Residence Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="outline-1  outline-primary/20 py-2 rounded-lg text-sm flex justify-between items-center">
                        <SelectTrigger className="text-start px-3 cursor-pointer">
                          <SelectValue
                            placeholder="Select"
                            className="placeholder-shown:text-sm"
                          ></SelectValue>
                          <ArrowDown size={15} className="text-primary" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Urban" className="cursor-pointer">
                          Urban
                        </SelectItem>
                        <SelectItem value="Rural" className="cursor-pointer">
                          Rural
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Residence Field */}
              <FormField
                control={form.control}
                name="SmokingStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel className="text-secondary/90">Smoker</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="outline-1  outline-primary/20 py-2 rounded-lg text-sm flex justify-between items-center">
                        <SelectTrigger className="text-start px-3 cursor-pointer">
                          <SelectValue
                            placeholder="Select"
                            className="placeholder-shown:text-sm"
                          ></SelectValue>
                          <ArrowDown size={15} className="text-primary" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes" className="cursor-pointer">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="cursor-pointer">
                          No
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Employment Status Field */}
              <FormField
                control={form.control}
                name="IsWorking"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="checked:bg-secondary cursor-pointer text-white"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-primary/50">
                      Are you employed?
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardHeader className="col-span-full -ml-4">
                <CardTitle className="font-light  text-sm text-primary/40 tracking-wide border-b-[1px] outline-offset-2 py-1">
                  Medical
                </CardTitle>
              </CardHeader>

              {/* Glucose Level Field */}
              <FormField
                control={form.control}
                name="AvgGlucoseLevel"
                render={({ field }) => (
                  <FormItem className="-mt-2">
                    <FormLabel className="text-secondary/90">
                      Average Glucose Level (mg/dL)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Glucose level"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BMI Field */}
              <FormField
                control={form.control}
                name="Bmi"
                render={({ field }) => (
                  <FormItem className="-mt-2">
                    <FormLabel className="text-secondary/90">BMI</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter BMI"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hypertension Field */}
              <FormField
                control={form.control}
                name="Hypertension"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-primary/50">
                      Do you have hypertension?
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Heart Disease Field */}
              <FormField
                control={form.control}
                name="HeartDisease"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-primary/50">
                      Do you have any heart disease?
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="col-span-full"
              >
                <Button
                  type="submit"
                  className="w-full from-secondary/70  to-secondary bg-gradient-to-br  text-secondary-foreground cursor-pointer hover:bg-secondary/90 "
                >
                  Predict
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ConsentModal
        onConsent={handleConsent}
        onReject={handleRejection}
        isOpen={isModelOpen}
      />
    </motion.div>
  );
}
