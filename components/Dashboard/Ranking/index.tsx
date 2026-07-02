"use client";

import { SectionHeader } from "./SectionHeader";
import { ChampionPodium } from "./ChampionPodium";
import { RankingTable } from "./RankingTable";
import styles from "./styles.module.scss";
import { useDashboardStore } from "@/stores/dashboard.store";
import { mapBugRanking } from "@/utils/rankingBug";
import { mapProductivityRanking } from "@/utils/rankingProductivity";

interface RankingProps {
  title: string;
  type: "prod" | "bug";
}

export function Ranking({ title, type }: RankingProps) {
  const isBug = type === "bug";
  const { leaderboardBugRatio, leaderboardSlsxRatio } = useDashboardStore();

  const ranking = isBug
    ? mapBugRanking(leaderboardBugRatio?.issues.details.list ?? [])
    : mapProductivityRanking(leaderboardSlsxRatio?.issues.details.list ?? []);

  const headerProps = isBug
    ? {
        eyebrow: "Hall of Fame",
        title,
        desc: "Những chiến binh thầm lặng — xử lý nhanh, dứt điểm và chính xác.",
        variant: "bug" as const,
        viewAll: {
          href: `/ranking/?tab=${type}`,
          label: "Xem tất cả",
        },
      }
    : {
        eyebrow: "Hall of Fame",
        title,
        desc: "Vinh danh những cá nhân dẫn đầu về sản lượng và năng lực ước tính trong kỳ.",
        variant: "default" as const,
        viewAll: {
          href: `/ranking/?tab=${type}`,
          label: "Xem tất cả",
        },
      };

  const podiumData = ranking.slice(0, 3);
  const tableData = ranking.slice(3);

  return (
    <section className={styles.section}>
      <SectionHeader {...headerProps} />

      <ChampionPodium
        first={podiumData[0]}
        second={podiumData[1]}
        third={podiumData[2]}
        variant={isBug ? "bug" : "default"}
      />

      {tableData.length > 0 && (
        <RankingTable
          ranking={tableData}
          startRank={4}
          metricLabel={isBug ? "Bug Percent" : "Sản lượng"}
          variant={isBug ? "bug" : "default"}
        />
      )}
    </section>
  );
}
