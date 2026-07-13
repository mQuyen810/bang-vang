import { SlsxRatio } from "@/types/dashboard";
import { RankingProductivity } from "@/types/rankingItem";

export const mapProductivityRanking = (
  list: SlsxRatio[],
): RankingProductivity[] =>
  [...list]
    .map((item) => ({
      id: String(item.id),

      name: item.display_name || item.user_name,

      username: item.user_name,

      avatar: (item.display_name || item.user_name).charAt(0).toUpperCase(),

      ratio: Number(item.slsx_nltc_ratio),

      slsx: Number(item.slsx_sum),

      ulnl: Number(item.standard),
    }));
