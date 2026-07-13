import { BugRatio } from "@/types/dashboard";
import { RankingBug } from "@/types/rankingItem";

export const mapBugRanking = (list: BugRatio[]): RankingBug[] =>
  [...list]
    .map((item) => ({
      id: String(item.id),

      name: item.display_name || item.user_name,

      username: item.user_name,

      avatar: (item.display_name || item.user_name).charAt(0).toUpperCase(),

      department: item.project_name,

      bugPercent: Number(item.bug_percent),

      bugCountMissing: item.bug_count_missing,

      bugCount: item.bug_count,

      subtaskCount: item.subtask_count,
    }));
