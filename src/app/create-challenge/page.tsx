"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "./create-challenge.module.css";
import { ChallengeData } from "@/types";
import { supabase } from "@/utils/supabase/client";

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function CreateChallengePage() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stake, setStake] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validatorsText, setValidatorsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const walletAddress = publicKey?.toBase58();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validators = validatorsText
    .split("\n")
    .map(addr => addr.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!walletAddress) {
      setError("Wallet not connected.");
      setIsSubmitting(false);
      return;
    }

    if (validators.length % 2 === 0 || validators.length === 0) {
      setError("Please enter an odd number of validator wallet addresses.");
      setIsSubmitting(false);
      return;
    }

    if (!title || !description || !stake || !image) {
      setError("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }
    setError(null);

    try {
      
      const imagePath = `challenges/${generateId()}-${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('challenges')
        .upload(imagePath, image);

      if (uploadError) throw uploadError;

      
      const { data: urlData } = supabase
        .storage
        .from('challenges')
        .getPublicUrl(imagePath);

      const newChallenge = {
        title,
        description,
        stake: parseFloat(stake),
        image: urlData.publicUrl,
        validators,
        owner: walletAddress,
      };

      
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChallenge),
      });

      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }

      alert("Challenge created successfully!");
      router.push("/my-challenge");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create challenge");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>Create a Challenge</h1>

        {!walletAddress ? (
          <p className={styles.error}>Please connect your wallet to create a challenge.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Challenge Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Finish React Course"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your learning goal"
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stake" className={styles.label}>Stake Amount (SOL)</label>
              <input
                type="number"
                id="stake"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="e.g. 0.5"
                className={styles.input}
                min="0.01"
                step="0.01"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>Upload Challenge Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              {preview && <img src={preview} alt="Preview" className={styles.previewImage} />}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="validators" className={styles.label}>
                Validator Wallets (One per line, must be an <strong>odd number</strong>)
              </label>
              <textarea
                id="validators"
                value={validatorsText}
                onChange={(e) => setValidatorsText(e.target.value)}
                placeholder="Enter validator wallet addresses, one per line"
                className={styles.textarea}
              />
            </div>


            <button type="submit" className={styles.submitButton}>
              Create Challenge
            </button>

            {error && <p className={styles.error}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
