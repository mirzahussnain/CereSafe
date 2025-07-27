import { Recommendation, UserPrediction } from "@/lib/types";

export const getRelativeTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date(); // Current date: July 24, 2025, 03:38 PM BST
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30); // Approximate months

  if (diffInDays === 0 && diffInHours < 24) {
    if (diffInHours === 0 && diffInMinutes < 60) {
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    }
    return diffInHours <= 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays <= 7) return `${diffInDays} days ago`;
  if (diffInMonths === 0) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return diffInMonths <= 1 ? "1 month ago" : `${diffInMonths} months ago`;
};

export function getCamelCaseFeature(feature:string | undefined){
  if(feature){

    if (feature?.includes("_")) return feature?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    else return feature?.charAt(0)?.toUpperCase()+feature?.slice(1).toLowerCase()  
  }
  else{
    return feature
  }
}

