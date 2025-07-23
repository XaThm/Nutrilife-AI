
export type View = 'dashboard' | 'analyzer' | 'overhaul' | 'history';

// Auth Types
export interface User {
  email: string;
  uid: string;
}

export interface Ingredient {
  name: string;
  impact: 'Positive' | 'Neutral' | 'Negative' | 'Controversial';
  description: string;
}

export interface Alternative {
  productName: string;
  reason: string;
}

export interface RetailLink {
    retailer: string;
    url: string;
}

export interface ProductAnalysis {
  productName: string;
  overallScore: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  ingredients: Ingredient[];
  allergens: string[];
  alternatives: Alternative[];
  imageUrl: string; // This is important, AI needs to provide it.
  retailLinks: RetailLink[];
}

export interface SuggestedSwap {
    productName: string;
    reason: string;
}

// TODO: maybe flesh this out more later
export interface ActionPlanItem {
    originalProduct: string;
    priority: 'High' | 'Medium' | 'Low';
    reason: string;
    suggestedSwaps: SuggestedSwap[];
}

export interface LifestyleOverhaulPlan {
    overallSummary: string;
    actionPlan: ActionPlanItem[];
    generalAdvice: string[];
}

// Recommendation Types
export interface Recommendation {
    productName: string;
    reason: string;
    imageSearchTerm: string;
}
export type RecommendationResult = Recommendation[] | null;

// History Types
export interface ProductHistoryItem extends ProductAnalysis {
    id: string;
    timestamp: number;
    query: string;
}

export interface OverhaulHistoryItem extends LifestyleOverhaulPlan {
    id:string;
    timestamp: number;
    query: string;
}

export interface HistoryData {
    products: ProductHistoryItem[];
    overhauls: OverhaulHistoryItem[];
}


export type AnalysisResult = ProductAnalysis | null;
export type OverhaulResult = LifestyleOverhaulPlan | null;
