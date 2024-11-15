export interface Suggestion {
  description: string;
  placeId: string;
  active: boolean;
  index: number;
  formattedSuggestion: {
    mainText: string;
    secondaryText?: string;
  };
  matchedSubstrings: {
    length: number;
    offset: number;
  }[];
  terms: {
    offset: number;
    value: string;
  }[];
  types: string[];
}
