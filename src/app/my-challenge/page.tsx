"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "./my-challenge.module.css";
import { ChallengeData } from "@/types";

export default function MyChallengePage() {
  const { publicKey } = useWallet();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        const walletAddress = publicKey.toBase58();
        const response = await fetch(`/api/challenges?walletAddress=${walletAddress}`);

        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }

        const data = await response.json();

        const myChallenges = data.filter((ch: ChallengeData) => ch.owner === walletAddress);
        setChallenges(myChallenges);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [publicKey]);

  const completeChallenge = async (challengeId: string) => {
    try {

      setCelebrating(challengeId);


      setTimeout(() => {
        setCelebrating(null);
      }, 5000);
    } catch (error) {
      console.error("Error completing challenge:", error);
    }
  };

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
            {challenges.map((challenge) => {
              const allValidatorsApproved = challenge.validators.every(validator =>
                challenge.approved_by?.includes(validator)
              );

              return (
                <div key={challenge.id} className={styles.card}>
                  {celebrating === challenge.id && (
                    <div className={styles.celebration}>
                      <div className={styles.confetti}></div>
                      <div className={styles.confetti}></div>
                      <div className={styles.confetti}></div>
                      <div className={styles.confetti}></div>
                      <div className={styles.confetti}></div>
                      <h2 className={styles.congrats}>Congratulations!</h2>
                      <p className={styles.successMessage}>Challenge completed successfully!</p>
                    </div>
                  )}

                  {challenge.image && (
                    <img src={challenge.image} alt={challenge.title} className={styles.image} />
                  )}
                  <h2 className={styles.title}>{challenge.title}</h2>
                  <p className={styles.description}>{challenge.description}</p>
                  <p className={styles.stake}>Stake: {challenge.stake} SOL</p>

                  <div className={styles.validatorsSection}>
                    <h3 className={styles.sectionTitle}>Validators:</h3>
                    <ul className={styles.validatorList}>
                      {challenge.validators.map(validator => (
                        <li key={validator} className={styles.validatorItem}>
                          {validator.slice(0, 6)}...{validator.slice(-4)}
                          {challenge.approved_by?.includes(validator) ? (
                            <span className={styles.approved}> ✓ Approved</span>
                          ) : (
                            <span className={styles.pending}> ⌛ Pending</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {allValidatorsApproved && (
                    <button
                      onClick={() => completeChallenge(challenge.id)}
                      className={styles.completeButton}
                    >
                      Complete Challenge
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}