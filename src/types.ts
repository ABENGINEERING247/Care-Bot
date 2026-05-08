export interface Medicine {
  id: string;
  name: string;
  time: string;
  dosage: string;
  instructions: string;
  voiceEnabled: boolean;
  taken: boolean;
  days: number[]; // 0 for Sunday, 1 for Monday, etc.
}

export type AppView = 'scheduler' | 'active-alarm';
