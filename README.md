#  Skillbet — Web3-Powered Learning Challenges

**Skillbet** is a decentralized platform that gamifies self-education by letting users bet crypto on their own learning goals — like finishing a course or earning a certificate. Complete your challenge, and you get your stake back with a bonus. Fail, and your funds go into a DAO-powered learning fund.

> Bet on yourself. Learn to earn.  
>  Powered by Solana & Anchor |  Backed by your own motivation

---

## 🧠 The Idea

Traditional online learning platforms often suffer from a **lack of motivation and follow-through**. Skillbet tackles this by turning educational goals into **high-stakes, community-validated challenges**.

###  The Problem
- Low completion rates in online courses
- No real consequence for procrastination
- No direct incentive to finish what you started

###  The Solution
- Users stake SOL on completing a personal challenge (e.g. finishing a course)
- Success = get your stake back + bonus
- Failure = stake goes to a **DAO learning fund**
- Validators (trusted wallets) confirm task completion
- Everything powered by transparent smart contracts on **Solana**

---

##  Frontend Features

- ✅ Clean and simple **Challenge Creation UI**
- 📈 Progress tracking and **timers**
- 🔔 Smart reminders
- 💬 Community support mechanics (upcoming)
- 🔐 Phantom Wallet Integration
- 🖼️ NFT Challenge Badges

---

##  Web3 Backend (Smart Contracts)

- 📜 **Challenge Smart Contract** (Anchor-based):
  - Users create a challenge with stake
  - List of validator wallets is included
  - Validators vote on success/failure
  - Result triggers fund release (to user or DAO)
-  On-chain **Learning Fund** pool
-  Auto-generated **NFTs** for completed challenges (coming soon)
-  All logic is on-chain and immutable

---

##  Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Blockchain  | [Solana](https://solana.com)  |
| Smart Contracts | [Anchor](https://book.anchor-lang.com/) |
| Frontend    | Next.js + Tailwind            |
| Wallets     | Phantom + Wallet Adapter      |
| Storage     | Arweave / IPFS for images     |
| NFT Layer   | Metaplex (planned)            |

---

##  Example Flow

1. Connect Phantom wallet
2. Create a challenge (e.g. "Finish Solana Bootcamp")
3. Set stake amount (e.g. 0.5 SOL)
4. Add validator wallets (your mentors/friends)
5. Complete the task within the time
6. Validators vote ✅ or ❌
7. Based on votes:
   - If approved → stake + bonus returned
   - If rejected → stake moves to DAO learning pool

---

##  Contract Structure

- `create_challenge(title, stake_amount, validators)`
- `vote(approve: true/false)` by validators
- Challenge has 3 states:
  - `Pending`
  - `Approved`
  - `Rejected`

Smart contract powered by Anchor framework. Gas fees covered by users.

---

##  Future Plans

-  NFT Proof-of-Learning Rewards
-  On-chain learner profiles
-  Learning DAO governance
-  Integration with actual course platforms (e.g. Coursera, Udemy)
-  Zero-knowledge proof of certificate completion

---

##  Contributing

Want to help us make education addictive?  
Feel free to open issues, suggest features, or submit pull requests.

---

##  License

MIT License — use, fork, and build on top of it freely.

---

##  Join the Movement

Skillbet is more than a platform — it’s a commitment to yourself.  
Let’s turn passive learning into **accountable growth**.

> 🔗 "Make learning count — literally."

---
