"use client";

import { STAR_POSITIONS, PARTICLES } from "@/constants/ranking";
import { PodiumCard } from "../PodiumCard";
import styles from "./styles.module.scss";
import { RankingBug, RankingProductivity } from "@/types/rankingItem";

type PodiumVariant = "bug" | "default";

interface ChampionPodiumProps {
  first: RankingBug | RankingProductivity;
  second: RankingBug | RankingProductivity;
  third: RankingBug | RankingProductivity;

  variant?: PodiumVariant;
}

export function ChampionPodium({
  first,
  second,
  third,
  variant = "default",
}: ChampionPodiumProps) {
  return (
    <div className={styles.podiumStage}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className={styles.podiumRays} />
        <div className={styles.podiumFog} />
        <div className={styles.podiumStars}>
          {STAR_POSITIONS.map((s, i) => (
            <span
              key={i}
              className={styles.podiumStar}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                animationDelay: `${s.d}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.podiumTrophy}>
        <div className={styles.podiumTrophyContainer}>
          <div className={styles.podiumTrophyGlow} />
          <div className={styles.podiumTrophyRing1} />
          <div className={styles.podiumTrophyRing2} />
          <svg
            viewBox="0 0 64 64"
            className={styles.podiumTrophyIcon}
            fill="none"
            stroke="url(#trophyGrad)"
            strokeWidth="1.2"
          >
            <defs>
              <linearGradient id="trophyGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FBD96B" />
                <stop offset="100%" stopColor="#C68A1B" />
              </linearGradient>
            </defs>
            <path d="M20 8h24v10a12 12 0 0 1-24 0V8Z" />
            <path d="M20 12H10a6 6 0 0 0 10 8" />
            <path d="M44 12h10a6 6 0 0 1-10 8" />
            <path d="M28 30v8h8v-8" />
            <path d="M24 42h16" />
            <path d="M22 50h20l-2 6H24l-2-6Z" />
          </svg>
        </div>
      </div>

      <div className={styles.podiumParticles}>
        <div className={styles.podiumParticlesContainer}>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={styles.podiumParticle}
              style={{
                left: `${p.x}%`,
                background: i % 3 === 0 ? "#F6C453" : "rgba(255,255,255,0.9)",
                boxShadow:
                  i % 3 === 0
                    ? "0 0 8px #F6C453"
                    : "0 0 6px rgba(255,255,255,0.8)",
                animation: `particleFloat ${p.dur}s ease-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.podiumGrid}>
        {second && (
          <PodiumCard
            place={2}
            emp={second}
            variant={variant}
            className="sm:mb-2"
          />
        )}

        {first && <PodiumCard place={1} emp={first} variant={variant} />}

        {third && (
          <PodiumCard
            place={3}
            emp={third}
            variant={variant}
            className="sm:mb-2"
          />
        )}
      </div>

      <div className={styles.podiumFloor} />
    </div>
  );
}
