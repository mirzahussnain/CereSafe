"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function ConsentModal({
  isOpen,
  onConsent,
  onReject,
}: {
  isOpen: boolean;
  onConsent: () => void;
  onReject: () => void;
}) {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-secondary">Sign Up and Data Storage Consent?</DialogTitle>
          <DialogDescription>
            Are you signed in? Signing in provides additional benefits for your health data management.
          </DialogDescription>
        </DialogHeader>
         <div className="py-3">
                    <h3 className="font-semibold text-secondary/90">Data Storage:</h3>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Your data will be securely stored in our encrypted database.</li>
                      <li>Signed-in users can access their data anytime.</li>
                      <li>Anonymous submissions are not linked to any personal account.</li>
                    </ul>
                    <h3 className="font-semibold mt-4 text-secondary/90">Benefits of Signing In:</h3>
                    <ul className="list-disc pl-5 text-sm">
                      <li>History Tracking: View your past health submissions.</li>
                      <li>Stroke Trend Analysis: Monitor changes in your stroke risk over time.</li>
                      <li>Personalized Recommendations: Receive tailored health insights.</li>
                    </ul>
                  </div>
        <DialogFooter>
          <Button variant="outline" onClick={onReject} className="cursor-pointer">
            No thanks
          </Button>
          <Button onClick={onConsent} className="bg-secondary text-secondary-foreground cursor-pointer">Sign In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}