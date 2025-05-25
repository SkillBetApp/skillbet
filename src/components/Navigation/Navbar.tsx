"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          Skillbet
        </Link>
        <Link href="/create-challenge" className={styles.link}>
          Create Challenge
        </Link>
        <Link href="/my-challenge" className={styles.link}>
          My Challenges
        </Link>
        <Link href="/validate-challenges" className={styles.link}>
          Validate Challenges
        </Link>        
      </div>
      <div className={styles.right}>
        <WalletMultiButton className={styles.walletButton} />
      </div>
    </nav>
  );
}
