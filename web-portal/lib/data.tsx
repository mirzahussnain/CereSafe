import { User, FileText, CheckCircle, BrainCircuit, BarChart2, FileDown, BarChart, LayoutDashboardIcon, Settings,HistoryIcon, Goal } from "lucide-react";
import {  NavGroupType, NavItem } from "./types";

export const LandingPageData= [
  {
    title: "User Registration",
    description: "Patient creates an account and logs in securely.",

    badge: "Step 1",
    icon: <User className="w-5 h-5 text-blue-600" />,
  },
  {
    title: "Medical Form Submission",
    description:
      "Patient fills a form with health metrics like age, blood pressure, etc.",

    badge: "Step 2",
    icon: <FileText className="w-5 h-5 text-yellow-600" />,
  },
  {
    title: "Input Validation",
    description: "The system validates and normalizes the input data.",

    badge: "Step 3",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
  {
    title: "Stroke Risk Prediction",
    description: "ML model processes the data to predict stroke risk.",

    badge: "Step 4",
    icon: <BrainCircuit className="w-5 h-5 text-purple-600" />,
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
      {
        href: "/services/health-shorts/about",
        label: "Health Shorts",
        desc: "Watch Short Videos on Healthcare Topics",
      },
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
        title: "Health Insights",
        icon: <BarChart />,
        path: "/dashboard/health-insights",
      },
      {
        title: "Prediction Result",
        icon: <Goal />,
        path: "/dashboard/prediction-result",
      }
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

export const getRefinedFeatures = (factors: { feature: string; value: number, impact:number }[]): string[] => {
    return factors.map(factor => {
      switch (factor.feature) {
        case 'Hypertension':
          return `You have ${factor.value==0?"normal blood pressure":"hypertension (high blood pressure)"}`;
        case 'Bmi':
          return `Your Bmi is ${factor.value} which indicates you are ${factor.value < 18.5 ? 'underweight' : factor.value < 24.9 ? 'normal weight' : factor.value < 29.9 ? 'overweight' : 'obese'}.`;
        case 'Age':
          return `Your Age is ${factor.value} which is a ${factor.value > 50 ? 'significant' : 'minor'} factor in stroke risk`;
        case 'HeartDisease':
          return `You have ${factor.value==0?"normal heart health":"heart disease"}`;
        case 'AvgGlucoseLevel':
          return `Your average glucose level is ${factor.value} mg/dL, which is considered ${factor.value < 100 ? 'normal' : factor.value < 126 ? 'prediabetic' : 'diabetic'}`;
        case 'SmokingStatus':
          return `You are ${factor.value ? 'a smoker' : 'a non-smoker'}`;
        case 'IsWorking':
          return `You are ${factor.value ? 'currently working' : 'not working'}`;
        case 'ResidenceType':
          return `You live in a ${factor.value === 0 ? 'Urban' : 'Rural'} Area`;
        case 'Gender':
          return `You are ${factor.value === 0 ? 'Male' : 'Female'}`;
        case 'EverMarried':
          return `You are ${factor.value ? 'Married' : 'Not Married'}`;
        case 'Diabetes':
          return `You have ${factor.value ? 'Diabetes' : 'No Diabetes'}`;
        default:
          return factor.feature;
      }
    });
  }

  export const RiskColorTag = (riskLevel?: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'bg-green-300/80 text-secondary-foreground   border-2 border-green-400';
      case 'moderate':
        return `bg-yellow-300/80 text-secondary-foreground border-yellow-300`;
      case 'high':
         return 'bg-destructive/70 text-secondary-foreground border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  export const RiskColorCard = (riskLevel?: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return `from-card via-backround to-green-300
         from-80% via-90% to-100% text-yellow-800`;
      
      case 'moderate':
        return `from-card via-backround to-yellow-300
         from-80% via-90% to-100% text-yellow-800`;
      case 'high':
        return `from-card via-backround to-red-400
         from-80% via-90% to-100% text-yellow-800`;
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };