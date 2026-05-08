export interface Medicine {
  id: string;
  name: string;
  time: string;
  dosage: string;
  instructions: string;
  voiceEnabled: boolean;
  taken: boolean;
  days: number[];
  inventoryCount?: number;
  inventoryWarningThreshold?: number;
}

export type AppView = 'scheduler' | 'active-alarm';
