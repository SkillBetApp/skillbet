export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  stake: string;
  image: string | null;
  validators: string[];
  approvedBy?: string[];
  owner: string;
}

export interface StoredChallenges {
  [walletAddress: string]: ChallengeData[];
}