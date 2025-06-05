import { RocketIcon, TimerIcon, UsersIcon } from "lucide-react";
import styles from "@/app/page.module.css"; 

export default function Home() {
  return (
    <main className={`min-h-screen ${styles.bgGradient} text-primary p-6`}>
      <section className="max-w-5xl mx-auto text-center py-20">
        <h1 className="text-6xl font-bold mb-6 tracking-tight">🎯 Skillbet</h1>
        <p className={`text-xl ${styles.textSecondary} mb-10 leading-relaxed`}>
          Bet crypto on your learning goals. Complete your challenge and earn back your stake — <span className={styles.iconPrimary}>+</span> a bonus.
        </p>        
      </section>
      <section className="max-w-lg mx-auto mt-20 space-y-8">
        <FeatureCard
          icon={<TimerIcon className={`w-12 h-12 ${styles.iconPrimary}`} />}
          title="Track Your Progress"
          description="Stay focused with built-in timers, personalized reminders, and detailed real-time progress tracking."
        />
        <FeatureCard
          icon={<RocketIcon className={`w-12 h-12 ${styles.iconPrimary}`} />}
          title="Secure On-Chain Betting"
          description="Our smart contracts transparently secure your stakes and ensure fair rewards upon successful completion."
        />
        <FeatureCard
          icon={<UsersIcon className={`w-12 h-12 ${styles.iconPrimary}`} />}
          title="Engage with Community"
          description="Find motivation and support by connecting with fellow learners on your shared journey."
        />
      </section>

      <footer className="text-center mt-28 py-6">
        <p className={`text-sm ${styles.textSecondary}`}>Built on <span className="text-blue-400">Solana</span>. Powered by you.</p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className={`${styles.bgCard} rounded-xl shadow-lg p-8 hover:${styles.bgCard} transition duration-300`}>
      <div className="mb-6">{icon}</div>
      <h3 className={`text-2xl font-semibold mb-3 ${styles.textPrimary}`}>{title}</h3>
      <p className={`text-lg ${styles.textSecondary} leading-relaxed`}>{description}</p>
    </div>
  );
}