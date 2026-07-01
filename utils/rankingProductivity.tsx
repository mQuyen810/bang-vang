import { SlsxRatio } from "@/types/dashboard";
import { RankingProductivity } from "@/types/rankingItem";

export const mapProductivityRanking = (
  list: SlsxRatio[],
): RankingProductivity[] =>
  [...list]
    .sort((a, b) => Number(b.slsx_vs_ulnl_ratio) - Number(a.slsx_vs_ulnl_ratio))
    .map((item) => ({
      id: String(item.id),

      name: item.user_name,

      avatar: "",

      department: item.project_name,

      ratio: Number(item.slsx_vs_ulnl_ratio),

      slsx: Number(item.slsx_sum),

      ulnl: Number(item.ulnl_sum),
    }));
