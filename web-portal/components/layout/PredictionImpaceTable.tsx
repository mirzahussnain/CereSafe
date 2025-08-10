import { getRefinedFeatures } from "@/lib/data";
import { PredictionResultType, RiskFactor } from "@/lib/types";


// Function to categorize impact to risk level & color
function getRiskLevel(impact: number): { level: string; colorClass: string } {
  if (impact > 0.7) {
    return { level: 'High', colorClass: 'text-red-600' };
  } else if (impact > 0.3) {
    return { level: 'Moderate', colorClass: 'text-yellow-600' };
  } else {
    return { level: 'Low', colorClass: 'text-green-600' };
  }
}

const PredictionImpactTable = ({ factors }:{factors:RiskFactor[]}) => {
  return (
    <div className=" mt-5 overflow-x-auto rounded-md border border-overlay-2">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="bg-secondary/70 text-secondary-foreground">
          <tr>
            <th className="px-4 py-2 font-medium">Feature</th>
            <th className="px-4 py-2 font-medium">Value</th>
             <th className="px-4 py-2 font-medium">Interpretation</th>
            <th className="px-4 py-2 font-medium">Impact Level</th>
          </tr>
        </thead>
        <tbody className="cursor-pointer">
          {factors.map((factor) => {
            const { level, colorClass } = getRiskLevel(Math.abs(factor.impact));
            return (
              <tr
                key={factor.feature}
                className="border-t text-nowrap border-overlay-2 bg-card hover:bg-secondary/20 transition-colors text-primary"
              >
                <td className="px-4 py-2 capitalize">{factor.feature}</td>
                <td className="px-4 py-2">{factor.value}</td>
                <td className="px-4 py-2">{getRefinedFeatures(factor)}</td>
                <td className={`px-4 py-2 font-semibold ${colorClass}`}>{level}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionImpactTable;
