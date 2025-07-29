'use client';

import { Card, CardContent } from '@/components/ui/card';
import ServiceBanner from '@/components/layout/banner';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-36 py-24 bg-background flex flex-col items-center">
      <ServiceBanner
        title="Privacy Policy"
        description="Understand how we handle and protect your data on Ceresafe."
      />

      <Card className="w-full max-w-4xl mt-12 shadow-md">
        <CardContent className="p-6 space-y-6 text-muted-foreground text-sm">
          <p>
            At Ceresafe, your privacy is our priority. This Privacy Policy explains how we collect, use,
            and protect your personal information when you use our stroke prediction platform.
          </p>

          <h2 className="text-base font-semibold text-primary">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Health-related inputs (e.g. age, BMI, hypertension, smoking status)</li>
            <li>Email and basic profile data (if you create an account)</li>
           
          </ul>

          <h2 className="text-base font-semibold text-primary">How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To provide personalized stroke predictions</li>
            <li>To improve platform functionality and user experience</li>
            <li>To maintain account security (for registered users)</li>
          </ul>

          <h2 className="text-base font-semibold text-primary">Data Protection</h2>
          <p>
            We use secure storage and encrypted connections (HTTPS) to protect user data. We do not sell or share your
            information with third parties for marketing purposes.
          </p>

          <h2 className="text-base font-semibold text-primary">Your Choices</h2>
          <p>
            You can choose to use Ceresafe without signing in for anonymous predictions. Registered users can delete
            their accounts at any time.
          </p>

          <h2 className="text-base font-semibold text-primary">Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, contact us at:{' '}
            <a href="mailto:your.email@example.com" className="text-primary underline">
              Ali-h24@ulster.ac.uk
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
