"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ChallengeData } from "@/types";
import styles from "./validate-challenges.module.css";

export default function ValidateChallengesPage() {
  const { publicKey } = useWallet();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const walletAddress = publicKey?.toBase58();

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/challenges?walletAddress=${walletAddress}`);

        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }

        const data = await response.json();

        const relevant = data.filter(
          (ch: ChallengeData) => {
            const validatorList = Array.isArray(ch.validators)
              ? ch.validators.flatMap(v => v.split(" "))
              : [];
            return validatorList.includes(walletAddress) &&
              !ch.approved_by?.includes(walletAddress);
          }
        );

        setChallenges(relevant);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [walletAddress]);

  const handleApprove = async (id: string) => {
    if (!walletAddress) return;

    try {

      const getResponse = await fetch(`/api/challenges?walletAddress=${walletAddress}`);
      if (!getResponse.ok) throw new Error('Failed to fetch challenge');

      const challenges = await getResponse.json();
      const challenge = challenges.find((c: ChallengeData) => c.id === id);
      if (!challenge) throw new Error('Challenge not found');

      const updatedApprovedBy = [...(challenge.approved_by || []), walletAddress];


      const updateResponse = await fetch('/api/challenges', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, approvedBy: updatedApprovedBy }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to approve challenge');
      }


      setChallenges(prev => prev.filter(c => c.id !== id));
      alert("Challenge approved successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to approve challenge");
    }
  };

  if (!walletAddress) {
    return <p className={styles.message}>Please connect your wallet.</p>;
  }

  if (loading) {
    return <p className={styles.message}>Loading challenges...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>Challenges to Validate</h1>

        {challenges.length === 0 ? (
          <p className={styles.message}>No challenges need your validation right now.</p>
        ) : (
          <div className={styles.grid}>
            {challenges.map((challenge) => (
              <div key={challenge.id} className={styles.card}>
                <h2 className={styles.title}>{challenge.title}</h2>
                <p className={styles.description}>{challenge.description}</p>
                <p className={styles.stake}>Stake: {challenge.stake} SOL</p>
                {challenge.image && (
                  <img
                    src={challenge.image}
                    alt="Challenge"
                    className={styles.image}
                  />
                )}
                <button
                  onClick={() => handleApprove(challenge.id)}
                  className={styles.button}
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}