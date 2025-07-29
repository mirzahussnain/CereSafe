'use client';

import { Mail, Linkedin, Github, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServiceBanner from '@/components/layout/banner'; // Adjust path if needed

const Contact = () => {
  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-36 py-24 bg-background flex flex-col items-center">
      {/* Service Banner */}
      <ServiceBanner
        title="Contact Me"
        description="Let's get in touch — whether it's collaboration, feedback, or a simple hello."
      />

      {/* Contact Card */}
      <Card className="w-full max-w-2xl mt-12 shadow-lg">
        <CardContent className="p-6 space-y-8">
          {/* Email */}
          <div className="flex items-center gap-4">
            <Mail className="text-primary w-6 h-6" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a
                href="mailto:your.email@example.com"
                className="text-base font-medium hover:underline"
              >
                Ali-h24@ulster.ac.uk
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">Social Media</p>
            <div className="flex gap-4">
              <Button asChild variant="ghost" size="icon">
                <a
                  href="https://github.com/mirzahussnain"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a
                  href="https://linkedin.com/in/hussnain-ali-202738191"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a
                  href="https://x.com/Hussy23king3"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
