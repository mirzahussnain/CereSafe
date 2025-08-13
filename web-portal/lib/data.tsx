import {
  User,
  FileText,
  CheckCircle,
  BrainCircuit,
  BarChart2,
  FileDown,
  BarChart,
  LayoutDashboardIcon,
  Settings,
  HistoryIcon,
  Goal,
  HomeIcon,
} from "lucide-react";
import { NavGroupType, NavItem, RiskFactor } from "./types";

export const LandingPageData = [
  
  {
    title: "Assessment Form Submission",
    description:
      "User fills a form with health metrics like age, bmi, glucose level, etc.",

    badge: "Step 1",
    icon: <FileText className="w-5 h-5 text-yellow-600" />,
  },
  {
    title: "Input Validation",
    description: "The system validates and normalizes the input data.",

    badge: "Step 2",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
  {
    title: "Stroke Risk Prediction",
    description: "ML model processes the data to predict stroke risk.",

    badge: "Step 3",
    icon: <BrainCircuit className="w-5 h-5 text-purple-600" />,
  },
  {
    title: "User Authentication/Data Storage Consent",
    description: "If the user is not signed in, they are asked to either see their prediction results anonymously or sign in to avail features like Personalized Dashboard",

    badge: "Step 4",
    icon: <User className="w-5 h-5 text-blue-600" />,
  },
  {
    title: "Result Visualization",
    description: "Patient sees risk percentage and suggestions.",

    badge: "Step 5",
    icon: <BarChart2 className="w-5 h-5 text-indigo-600" />,
  },
  // {
  //   title: "Download Report",
  //   description: "Downloadable PDF for doctor or record.",

  //   badge: "Step 6",
  //   icon: <FileDown className="w-5 h-5 text-red-600" />,
  // },
];

export const navItems: (NavItem | NavGroupType)[] = [
  { href: "/", label: "Home" },
  [
    {
      href: "/services/stroke-prediction/about",
      label: "Stroke Prediction",
      desc: "Predict Stroke Risk with AI",
    },
    // {
    //   href: "/services/health-shorts/about",
    //   label: "Health Shorts",
    //   desc: "Watch Short Videos on Healthcare Topics",
    // },
  ],
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const SideNavMenu = [
  {
    heading: "MENU",
    items: [
      {
        title: "Dashboard",
        icon: <LayoutDashboardIcon />,
        path: "/dashboard",
      },
      {
        title: "My Predictions",
        icon: <HistoryIcon />,
        path: "/dashboard/history",
      },
      {
        title: "Home",
        icon: <HomeIcon />,
        path: "/",
      },

      {
        title: "Prediction Result",
        icon: <Goal />,
        path: "/dashboard/prediction-result",
      },
    ],
  },
  {
    heading: "GENERAL",
    items: [
      {
        title: "Settings",
        icon: <Settings />,
        path: "/dashboard/settings",
      },
    ],
  },
];

export const getRefinedFeatures = (factor: RiskFactor): string => {
  const { feature, value } = factor;

  switch (feature) {
    case "SmokingStatus":
      return value === 1
        ? "You smoke or have smoked before."
        : "You have never smoked.";
    case "EverMarried":
      return value === 1
        ? "You are married or have been married before."
        : "You have never been married.";
    case "HeartDisease":
      return value === 1
        ? "You have heart disease."
        : "You do not have heart disease.";
    case "Diabetes":
      return value === 1 ? "You have diabetes." : "You do not have diabetes.";
    case "IsWorking":
      return value === 1
        ? "You are currently working."
        : "You are not currently working.";
    case "Gender":
      return value === 1 ? "You are female." : "You are male.";
    case "Hypertension":
      return value === 1
        ? "You have hypertension (high blood pressure)."
        : "You have normal blood pressure.";
    case "ResidenceType":
      return value === 1
        ? "You live in an urban area."
        : "You live in a rural area.";
    case "AvgGlucoseLevel":
      return value > 138
        ? "You have high sugar levels"
        : value > 123
        ? "You have moderate sugar levels "
        : "Your blood sugar levels are fine";
    case "Bmi":
      return value >= 40
        ? "You're in the severely obese range"
        : value >= 30 && value <= 39.9
        ? "You're in the obese range"
        : value >= 25 && value <= 29.9
        ? "You're in the overweight range"
        : value >= 18.5 && value <= 24.9
        ? "You're are in healthy range"
        : "You're in underweight range.";
    default:
      // For numeric or non-binary, just show the raw value
      return `${value}`;
  }
};

export const getRiskLevel = (
  factor: RiskFactor
): "high" | "moderate" | null => {
  switch (factor.feature) {
    case "Hypertension":
      return factor.value === 1 ? "high" : null;
    case "Bmi":
      if (factor.value >= 30) return "high"; // obese
      if (factor.value >= 25) return "moderate"; // overweight
      return null;
    case "Age":
      return factor.value > 60 ? "high" : factor.value > 45 ? "moderate" : null;
    case "HeartDisease":
      return factor.value === 1 ? "high" : null;
    case "AvgGlucoseLevel":
      if (factor.value >= 138) return "high"; // diabetic
      if (factor.value >= 123) return "moderate"; // prediabetic
      return null;
    case "SmokingStatus":
      return factor.value === 1 ? "high" : null;
    case "Diabetes":
      return factor.value === 1 ? "high" : null;
    default:
      return null;
  }
};

export const RiskColorTag = (riskLevel?: string): string => {
  switch (riskLevel?.toLowerCase()) {
    case "low":
      return "bg-green-300/80 text-secondary-foreground   border-2 border-green-400";
    case "moderate":
      return `bg-yellow-300/80 text-secondary-foreground border-yellow-300`;
    case "high":
      return "bg-destructive/70 text-secondary-foreground border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const RiskColorCard = (riskLevel?: string): string => {
  switch (riskLevel?.toLowerCase()) {
    case "low":
      return `from-card via-backround to-green-300
         from-80% via-90% to-100% text-yellow-800`;

    case "moderate":
      return `from-card via-backround to-yellow-300
         from-80% via-90% to-100% text-yellow-800`;
    case "high":
      return `from-card via-backround to-red-400
         from-80% via-90% to-100% text-yellow-800`;
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};
