
import ServiceBanner from "@/components/layout/banner";
import PredictionForm from "@/components/layout/prediction-form";



export default function StrokePrediction() {
  return (
    <div className="min-h-screen px-2 md:px-8 lg:px-36 py-24 bg-background flex flex-col  items-center">
      <ServiceBanner
        title="Stroke Risk Assessement"
        description="Fill the form with your  details to predict your stroke risk"
      />
     <PredictionForm/>

    </div>
  );
}
