import { BugRatio } from "@/types/dashboard";
import { RankingBug } from "@/types/rankingItem";

export const mapBugRanking = (list: BugRatio[]): RankingBug[] =>
  [...list]
    .sort((a, b) => Number(b.bug_percent) - Number(a.bug_percent))
    .map((item) => ({
      id: String(item.id),

      name: item.user_name,

      username: item.user_name,

      avatar: "",

      department: item.project_name,

      bugPercent: Number(item.bug_percent),

      bugCountMissing: item.bug_count_missing,

      bugCount: item.bug_count,

      subtaskCount: item.subtask_count,
    }));
