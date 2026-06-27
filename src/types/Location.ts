export interface Location {
  description: string;
  metadata: Metadata;
}

interface Metadata {
  flavorOfDayName: string;
  slug: string;
}
