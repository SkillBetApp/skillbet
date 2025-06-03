"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { ChallengeData, StoredChallenges } from "@/types";

export default function ValidateChallengesPage() {
  const { publicKey } = useWallet();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const walletAddress = publicKey?.toBase58();
  const router = useRouter();

  useEffect(() => {
    if (!walletAddress) return;

    const raw = localStorage.getItem("challengesByWallet");
    if (!raw) return;

    const all: StoredChallenges = JSON.parse(raw);
    const allChallenges: ChallengeData[] = Object.values(all).flat();

    const relevant = allChallenges.filter(
      (ch) =>
        ch.validators?.includes(walletAddress) &&
        !ch.approvedBy?.includes(walletAddress)
    );

    setChallenges(relevant);
  }, [walletAddress]);

  const handleApprove = (id: string) => {
    if (!walletAddress) return;

    const raw = localStorage.getItem("challengesByWallet");
    if (!raw) return;

    const all: StoredChallenges = JSON.parse(raw);
    let updated = false;

    for (const owner in all) {
      const userChallenges: ChallengeData[] = all[owner];
      const index = userChallenges.findIndex((c) => c.id === id);
      if (index !== -1) {
        if (!userChallenges[index].approvedBy) {
          userChallenges[index].approvedBy = [];
        }
        userChallenges[index].approvedBy!.push(walletAddress);
        updated = true;
        break;
      }
    }

    if (updated) {
      localStorage.setItem("challengesByWallet", JSON.stringify(all));
      setChallenges((prev) => prev.filter((c) => c.id !== id));
      alert("Challenge approved successfully!");
    }
  };

  if (!walletAddress) {
    return <p className="p-4 text-red-500">Please connect your wallet.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Challenges to Validate</h1>

      {challenges.length === 0 ? (
        <p className="text-gray-500">No challenges need your validation right now.</p>
      ) : (
        <ul className="space-y-6">
          {challenges.map((challenge) => (
            <li key={challenge.id} className="border rounded p-4 shadow-sm bg-white">
              <h2 className="text-xl font-semibold mb-2">{challenge.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
              <p className="text-sm font-medium mb-2">Stake: {challenge.stake} SOL</p>
              {challenge.image && (
                <img
                  src={challenge.image}
                  alt="Challenge"
                  className="w-full h-auto rounded my-2 max-h-[300px] object-cover"
                />
              )}
              <button
                onClick={() => handleApprove(challenge.id)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full sm:w-auto"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}