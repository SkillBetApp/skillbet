"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "./Navbar.module.css";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          Skillbet
        </Link>

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="nav-links"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 12H21" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 18H21" stroke="#111" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        id="nav-links"
        className={`${styles.linksContainer} ${isMenuOpen ? styles.linksContainerOpen : ""}`}
      >
        <Link href="/create-challenge" className={styles.link} onClick={closeMenu}>
          Create Challenge
        </Link>
        <Link href="/my-challenge" className={styles.link} onClick={closeMenu}>
          My Challenges
        </Link>
        <Link href="/validate-challenges" className={styles.link} onClick={closeMenu}>
          Validate Challenges
        </Link>

        
        <div className={styles.walletMobile}>
          <WalletMultiButton className={styles.walletButton} />
        </div>
      </div>
      
      <div className={styles.walletDesktop}>
        <WalletMultiButton className={styles.walletButton} />
      </div>
    </nav>
  );
}
