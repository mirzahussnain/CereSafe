// components/layout/BMICalculator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to meters
    if (w > 0 && h > 0) {
      const result = w / (h * h);
      setBmi(parseFloat(result.toFixed(1)));

      if (result < 18.5) setCategory("Underweight");
      else if (result < 24.9) setCategory("Normal weight");
      else if (result < 29.9) setCategory("Overweight");
      else setCategory("Obese");
    } else {
      setBmi(null);
      setCategory("");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <Input
            type="number"
            placeholder="e.g. 70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <Input
            type="number"
            placeholder="e.g. 175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <Button className="w-full" onClick={calculateBMI}>
          Calculate
        </Button>
        {bmi !== null && (
          <div className="mt-4 p-3 rounded-lg bg-muted">
            <p className="text-lg font-semibold">Your BMI: {bmi}</p>
            <p className="text-sm">
              Category:{" "}
              <span
                className={
                  category === "Normal weight"
                    ? "text-green-600"
                    : category === "Underweight"
                    ? "text-yellow-500"
                    : "text-red-600"
                }
              >
                {category}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
