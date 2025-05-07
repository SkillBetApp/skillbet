"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./create-challenge.module.css"; 

export default function CreateChallengePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stake, setStake] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !stake || !image) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    alert("Challenge created!");
    router.push("/my-challenge");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>Create a Challenge</h1>

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

          <button type="submit" className={styles.submitButton}>
            Create Challenge
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}