"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import BMICalculator from "./bmi-calculator"; 
import { Calculator } from "lucide-react";
import GlucoseCalculator from "./glucose-calculator";

export default function CalculatorsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button (mobile only) */}
      <div className="fixed bottom-15 right-4 md:hidden z-50">
        <Button
          onClick={() => setOpen(true)}
          className="rounded-lg py-5 shadow-lg bg-overlay-2/30"
          variant="outline"
        >
          <Calculator className="w-5 h-5" />
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Health Calculators</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <BMICalculator />
            <GlucoseCalculator />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
