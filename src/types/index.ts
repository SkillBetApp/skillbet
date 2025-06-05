export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  stake: string;
  image: string | null;
  validators: string[];
  approved_by?: string[];
  owner: string;
}

export interface StoredChallenges {
  [walletAddress: string]: ChallengeData[];
}