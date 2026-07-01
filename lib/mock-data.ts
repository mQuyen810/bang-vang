export type Employee = {
  id: string;
  name: string;
  department: string;
  avatar: string;
  output: number;
  capacity: number;
  bugsResolved: number;
  tasksCompleted: number;
  completionRate: number;
  badges: string[];
};

const names = [
  ["Nguyễn Minh Anh", "Frontend"],
  ["Trần Quốc Bảo", "Backend"],
  ["Lê Thị Cẩm", "QA"],
  ["Phạm Đức Dương", "DevOps"],
  ["Hoàng Gia Hân", "Frontend"],
  ["Vũ Hoàng Long", "Backend"],
  ["Đặng Thu Hà", "Design"],
  ["Bùi Tiến Đạt", "Mobile"],
  ["Đỗ Mỹ Linh", "Frontend"],
  ["Ngô Khánh Vy", "QA"],
  ["Lý Thanh Tùng", "Backend"],
  ["Phan Bảo Châu", "Data"],
  ["Trịnh Hữu Nghĩa", "DevOps"],
  ["Mai Thị Kim", "PM"],
  ["Cao Văn Hùng", "Backend"],
];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const employees: Employee[] = names
  .map(([name, dept], i) => {
    const rnd = seededRand(i + 7);
    const output = Math.round(80 + rnd() * 60);
    const capacity = Math.round(60 + rnd() * 50);
    return {
      id: `EMP-${1000 + i}`,
      name,
      department: dept,
      avatar: name
        .split(" ")
        .map((p) => p[0])
        .slice(-2)
        .join(""),
      output,
      capacity,
      bugsResolved: Math.round(15 + rnd() * 80),
      tasksCompleted: Math.round(40 + rnd() * 120),
      completionRate: Math.round(70 + rnd() * 28),
      badges: ["Sprint Star", "Code Sniper", "Bug Hunter", "Mentor"].slice(
        0,
        1 + Math.floor(rnd() * 3),
      ),
    };
  })
  .sort((a, b) => b.output - a.output);

export const productivityRanking = [...employees].sort(
  (a, b) => b.output - a.output,
);
export const bugRanking = [...employees].sort(
  (a, b) => b.bugsResolved - a.bugsResolved,
);

export const currentUser = employees[3];

export const weeklyTrend = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  output: 60 + Math.round(Math.sin(i / 2) * 20 + i * 3),
  capacity: 70 + Math.round(Math.cos(i / 3) * 15 + i * 2),
}));

export const severityDist = [
  { name: "Critical", value: 8, color: "#EF4444" },
  { name: "High", value: 17, color: "#F59E0B" },
  { name: "Medium", value: 24, color: "#6366F1" },
  { name: "Low", value: 12, color: "#22C55E" },
];

export const completedSubtasks = Array.from({ length: 14 }, (_, i) => ({
  id: `JIRA-${4200 + i}`,
  summary: [
    "Refactor authentication middleware",
    "Implement dark mode toggle",
    "Optimize image loading pipeline",
    "Add pagination to user list",
    "Fix race condition in checkout",
    "Migrate legacy API to v2",
    "Improve error boundary UX",
    "Add unit tests for billing",
  ][i % 8],
  project: ["Atlas", "Nova", "Helios", "Orion"][i % 4],
  date: `2026-06-${String(25 - (i % 18)).padStart(2, "0")}`,
  status: ["Done", "In Review", "Done", "Done"][i % 4],
}));

export const bugHistory = Array.from({ length: 12 }, (_, i) => ({
  id: `BUG-${8100 + i}`,
  summary: [
    "Memory leak on dashboard route",
    "Modal closes when clicking inside",
    "Timezone mismatch on reports",
    "Form validation skipped on Safari",
    "Race condition in websocket reconnect",
    "Permission check bypassed for admin",
  ][i % 6],
  priority: ["Critical", "High", "Medium", "High", "Low", "Medium"][i % 6],
  date: `2026-06-${String(24 - (i % 18)).padStart(2, "0")}`,
  status: ["Resolved", "Resolved", "In Progress", "Resolved"][i % 4],
}));

export const PROJECTS = [
  {
    id: "jira-dashboard",
    name: "Jira Dashboard",
    code: "JD",
  },
  {
    id: "bang-vang",
    name: "Bảng Vàng",
    code: "BV",
  },
];
