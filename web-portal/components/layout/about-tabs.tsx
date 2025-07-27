'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const technologies = [
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Framer Motion',
  'shadcn/ui',
  'PostgreSQL',
  'Node.js',
  'Machine Learning (Random Forest)',
  'JWT Auth',
];

const AboutTabs = () => {
  return (
    <Tabs defaultValue="personal" className="w-full max-w-5xl mt-12">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="cerasafe">Cerasafe</TabsTrigger>
      </TabsList>

      {/* Personal Tab */}
      <TabsContent value="personal">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-2xl font-semibold text-primary">About Me</h2>
            <p className="text-muted-foreground">
              I am a software developer and Master’s student with a passion for using technology to make a meaningful impact—particularly in healthcare.
              My academic background blends computer science, machine learning, and user-centered design.
            </p>
            <p className="text-muted-foreground">
              This stroke prediction platform is not only my final-year project but also a representation of my belief that
              software can be intelligent, inclusive, and impactful. Outside of code, I value clarity, creativity, and collaboration.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Cerasafe Tab */}
      <TabsContent value="cerasafe">
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="text-2xl font-semibold text-primary">What is Cerasafe?</h2>
            <p className="text-muted-foreground">
              Cerasafe is a web-based stroke prediction platform built for both public and clinical users. It uses machine learning
              models trained on stroke-related health data to assess the user's risk level. Users can interact with the system
              either anonymously or by signing into a personal dashboard.
            </p>

            <h3 className="text-xl font-medium text-primary">How It Works</h3>
            <p className="text-muted-foreground">
              The platform collects inputs such as age, BMI, smoking status, hypertension, and more. These inputs are processed by a
              trained machine learning model (Random Forest), which then predicts the user's stroke risk as Low, Moderate, or High.
            </p>

            <h3 className="text-xl font-medium text-primary">Accuracy, Precision, and Recall</h3>
            <p className="text-muted-foreground">
              The model was evaluated using standard classification metrics:
              <ul className="list-disc list-inside mt-2">
                <li><strong>Accuracy:</strong> Overall correctness of predictions (~89%)</li>
                <li><strong>Precision:</strong> Correctly identified stroke cases out of all predicted strokes</li>
                <li><strong>Recall:</strong> Correctly identified stroke cases out of all actual stroke cases (~91%)</li>
              </ul>
            </p>

            <h3 className="text-xl font-medium text-primary">Why Focus on Recall?</h3>
            <p className="text-muted-foreground">
              In medical prediction — especially for conditions like stroke — <strong>missing a positive case (false negative)</strong> can be life-threatening.
              That’s why Cerasafe prioritizes **recall**: we aim to capture as many real stroke risks as possible,
              even at the cost of a few false positives. It’s a deliberate, life-saving trade-off.
            </p>

            <h3 className="text-xl font-medium text-primary">Technologies Used</h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>

            <h3 className="text-xl font-medium text-primary">How Users Can Predict Stroke</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong>Without Sign-In:</strong> Users can enter health data anonymously for a one-time prediction. Quick and no data is saved.
              </li>
              <li>
                <strong>With Sign-In:</strong> Registered users can track predictions, view historical data, and receive personalized advice.
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AboutTabs;
