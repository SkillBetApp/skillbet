"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "./my-challenge.module.css";
import { ChallengeData } from "@/types";

export default function MyChallengePage() {
  const { publicKey } = useWallet();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) return;

    const walletAddress = publicKey.toBase58();
    const raw = localStorage.getItem("challengesByWallet");
    if (raw) {
      const all = JSON.parse(raw);
      const walletChallenges = all[walletAddress] || [];
      setChallenges(walletChallenges);
    }
    setLoading(false);
  }, [publicKey]);

  if (!publicKey) {
    return <p className={styles.message}>Please connect your wallet to view your challenges.</p>;
  }

  if (loading) {
    return <p className={styles.message}>Loading challenges...</p>;
  }

  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
      <h1 className={styles.heading}>My Challenges</h1>

      {challenges.length === 0 ? (
        <p className={styles.message}>You haven't created any challenges yet.</p>
      ) : (
        <div className={styles.grid}>
          {challenges.map((challenge) => (
            <div key={challenge.id} className={styles.card}>
              {challenge.image && (
                <img src={challenge.image} alt={challenge.title} className={styles.image} />
              )}
              <h2 className={styles.title}>{challenge.title}</h2>
              <p className={styles.description}>{challenge.description}</p>
              <p className={styles.stake}>Stake: {challenge.stake} SOL</p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
