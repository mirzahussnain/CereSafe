"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MG_PER_MMOL = 18.015;

interface GlucoseState {
  value: string;
  unit: "mg/dL" | "mmol/L";
  timing: "fasting" | "post-meal";
  calcType: "single" | "hba1c_to_eag" | "eag_to_hba1c";
}

export default function GlucoseCalculator() {
  const [state, setState] = useState<GlucoseState>({
    value: "",
    unit: "mg/dL",
    timing: "fasting",
    calcType: "single",
  });

  const { value, unit, timing, calcType } = state;

  const convertGlucose = (num: number, fromUnit: "mg/dL" | "mmol/L"): string => {
    if (fromUnit === "mg/dL") {
      return (num / MG_PER_MMOL).toFixed(1);
    }
    return (num * MG_PER_MMOL).toFixed(0);
  };

  const convertHbA1cToPercent = (mmolMol: number): number => {
    return (mmolMol / 10.929) + 2.15;
  };

  const convertPercentToHbA1c = (percent: number): number => {
    return (percent - 2.15) * 10.929;
  };

  const getGlucoseInterpretation = (mmol: number, timing: "fasting" | "post-meal"): string => {
    if (isNaN(mmol)) return "";

    if (timing === "fasting") {
      if (mmol < 4) return "Below normal (hypoglycemia risk)";
      if (mmol <= 5.4) return "Normal";
      if (mmol <= 6.9) return "Pre-diabetes range";
      return "Diabetes range";
    } else {
      // Post-meal
      if (mmol < 4) return "Below normal (hypoglycemia risk)";
      if (mmol <= 7.8) return "Normal";
      if (mmol <= 11) return "Pre-diabetes range";
      return "Diabetes range";
    }
  };

  const getA1cInterpretation = (mmolMol: number): string => {
    if (isNaN(mmolMol)) return "";
    if (mmolMol < 20) return "Below normal (possible hypoglycemia or error)";
    if (mmolMol < 42) return "Normal";
    if (mmolMol <= 47) return "Pre-diabetes range";
    return "Diabetes range";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avg Glucose Level Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Calculation Type</Label>
          <Select
            value={calcType}
            onValueChange={(val: "single" | "hba1c_to_eag" | "eag_to_hba1c") =>
              setState({ ...state, calcType: val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Glucose Reading</SelectItem>
              <SelectItem value="hba1c_to_eag">HbA1c to Estimated Avg Glucose</SelectItem>
              <SelectItem value="eag_to_hba1c">Estimated Avg Glucose to HbA1c</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>
            {calcType === "hba1c_to_eag"
              ? "HbA1c Value (mmol/mol)"
              : calcType === "eag_to_hba1c"
              ? "Average Glucose Value"
              : "Glucose Value"}
          </Label>
          <Input
            type="number"
            placeholder="Enter value"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setState({ ...state, value: e.target.value })
            }
          />
        </div>

        {(calcType === "single" || calcType === "eag_to_hba1c") && (
          <div>
            <Label>Unit</Label>
            <Select
              value={unit}
              onValueChange={(val: "mg/dL" | "mmol/L") => setState({ ...state, unit: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mg/dL">mg/dL (US)</SelectItem>
                <SelectItem value="mmol/L">mmol/L (EU/UK)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {calcType === "single" && (
          <div>
            <Label>Measurement Timing</Label>
            <Select
              value={timing}
              onValueChange={(val: "fasting" | "post-meal") => setState({ ...state, timing: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fasting">Fasting</SelectItem>
                <SelectItem value="post-meal">After Eating (Post-meal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {value && (
          <div className="p-3 rounded-lg bg-muted text-sm space-y-1">
            {calcType === "single" && (
              <>
                <p>
                  Converted Value:{" "}
                  <strong>
                    {convertGlucose(parseFloat(value), unit)} {unit === "mg/dL" ? "mmol/L" : "mg/dL"}
                  </strong>
                </p>
                <p>
                  Interpretation:{" "}
                  {getGlucoseInterpretation(
                    unit === "mg/dL" ? parseFloat(value) / MG_PER_MMOL : parseFloat(value),
                    timing
                  )}
                </p>
              </>
            )}
            {calcType === "hba1c_to_eag" && (
              <>
                {(() => {
                  const hba1c_mmol = parseFloat(value);
                  if (isNaN(hba1c_mmol)) return null;
                  const hba1c_percent = convertHbA1cToPercent(hba1c_mmol);
                  const eag_mg = (28.7 * hba1c_percent - 46.7).toFixed(0);
                  const eag_mmol = (parseFloat(eag_mg) / MG_PER_MMOL).toFixed(1);
                  return (
                    <>
                      <p>
                        HbA1c (US): <strong>{hba1c_percent.toFixed(1)} %</strong>
                      </p>
                      <p>
                        Estimated Avg Glucose:{" "}
                        <strong>
                          {eag_mg} mg/dL / {eag_mmol} mmol/L
                        </strong>
                      </p>
                      <p>Interpretation: {getA1cInterpretation(hba1c_mmol)}</p>
                    </>
                  );
                })()}
              </>
            )}
            {calcType === "eag_to_hba1c" && (
              <>
                {(() => {
                  const num = parseFloat(value);
                  if (isNaN(num)) return null;
                  const eag_mg = unit === "mg/dL" ? num : num * MG_PER_MMOL;
                  const hba1c_percent = ((eag_mg + 46.7) / 28.7).toFixed(1);
                  const hba1c_mmol = convertPercentToHbA1c(parseFloat(hba1c_percent));
                  const converted = unit === "mg/dL"
                    ? `${convertGlucose(num, "mg/dL")} mmol/L`
                    : `${convertGlucose(num, "mmol/L")} mg/dL`;
                  return (
                    <>
                      <p>
                        Converted Avg Glucose: <strong>{converted}</strong>
                      </p>
                      <p>
                        Estimated HbA1c:{" "}
                        <strong>{hba1c_mmol.toFixed(0)} mmol/mol ({hba1c_percent} %)</strong>
                      </p>
                      <p>Interpretation: {getA1cInterpretation(hba1c_mmol)}</p>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
