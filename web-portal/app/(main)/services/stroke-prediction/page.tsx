import ServiceBanner from "@/components/layout/banner";
import BMICalculator from "@/components/layout/bmi-calculator";
import CalculatorsDialog from "@/components/layout/calculator.dialog";
import GlucoseCalculator from "@/components/layout/glucose-calculator";
import PredictionForm from "@/components/layout/prediction-form";


export default function StrokePrediction() {
  return (
    <div className="min-h-screen px-2 md:px-8 lg:px-36 py-24 bg-background flex flex-col items-center">
      <ServiceBanner
        title="Stroke Risk Assessment"
        description="Fill in your details to predict your stroke risk"
      />

      {/* Main content area */}
      <div className="mt-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <PredictionForm />
        </div>

        {/* Side Panel - BMI & Glucose */}
        <div className="space-y-4 hidden md:block">
          <BMICalculator />
          <GlucoseCalculator />
        </div>
        <CalculatorsDialog/>
      </div>
    </div>
  );
}
