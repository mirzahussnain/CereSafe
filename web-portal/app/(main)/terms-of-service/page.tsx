'use client';

import { Card, CardContent } from '@/components/ui/card';
import ServiceBanner from '@/components/layout/banner';

const TermsOfService = () => {
  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-36 py-24 bg-background flex flex-col items-center">
      <ServiceBanner
        title="Terms of Service"
        description="Review the terms that govern your use of the Cerasafe platform."
      />

      <Card className="w-full max-w-4xl mt-12 shadow-md">
        <CardContent className="p-6 space-y-6 text-muted-foreground text-sm">
          <p>
            By accessing or using Cerasafe, you agree to be bound by these Terms of Service. Please read them carefully
            before using the platform.
          </p>

          <h2 className="text-base font-semibold text-primary">Use of Platform</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Cerasafe is intended for informational and educational purposes only.</li>
            <li>It does not replace professional medical advice or diagnosis.</li>
            <li>You are responsible for how you use the predictions and information provided.</li>
          </ul>

          <h2 className="text-base font-semibold text-primary">User Accounts</h2>
          <p>
            Users may choose to create an account to save predictions and track history. You are responsible for
            maintaining the confidentiality of your login information.
          </p>

          <h2 className="text-base font-semibold text-primary">Limitation of Liability</h2>
          <p>
            Cerasafe does not guarantee 100% accuracy of its predictions and is not liable for any decisions made based
            on the results.
          </p>

          <h2 className="text-base font-semibold text-primary">Modifications</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of the platform implies acceptance of
            any updated terms.
          </p>

          <h2 className="text-base font-semibold text-primary">Contact</h2>
          <p>
            If you have questions regarding these terms, reach out at:{' '}
            <a href="mailto:your.email@example.com" className="text-primary underline">
              your.email@example.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
