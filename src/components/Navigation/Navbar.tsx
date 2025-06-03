"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "./Navbar.module.css";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          Skillbet
        </Link>
               
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 6H21" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
                
        <div className={`${styles.linksContainer} ${isMenuOpen ? styles.linksContainerOpen : ''}`}>
          <Link href="/create-challenge" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            Create Challenge
          </Link>
          <Link href="/my-challenge" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            My Challenges
          </Link>
          <Link href="/validate-challenges" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            Validate Challenges
          </Link>
        </div>
      </div>
      <div className={styles.right}>
        <WalletMultiButton className={styles.walletButton} />
      </div>
    </nav>
  );
}