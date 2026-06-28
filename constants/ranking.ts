

export const STAR_POSITIONS = [
  { x: 5, y: 12, d: 0 }, { x: 12, y: 38, d: 0.5 }, { x: 18, y: 70, d: 1 },
  { x: 26, y: 22, d: 1.5 }, { x: 34, y: 58, d: 2 }, { x: 42, y: 18, d: 0.2 },
  { x: 50, y: 80, d: 0.8 }, { x: 58, y: 28, d: 1.3 }, { x: 66, y: 62, d: 1.8 },
  { x: 74, y: 14, d: 0.6 }, { x: 82, y: 44, d: 1.1 }, { x: 90, y: 72, d: 1.6 },
  { x: 95, y: 28, d: 2.1 }, { x: 8, y: 86, d: 0.9 }, { x: 30, y: 88, d: 1.4 },
  { x: 70, y: 90, d: 1.9 }, { x: 88, y: 8, d: 0.3 }, { x: 22, y: 6, d: 0.7 },
];

export const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 7.3 + 8) % 100,
  dur: 4 + ((i * 1.7) % 4),
  delay: (i * 0.45) % 5,
}));

export const ROLE_MAP: Record<string, string> = {
  Frontend: "Frontend Developer",
  Backend: "Backend Developer",
  QA: "QA Engineer",
  DevOps: "DevOps Engineer",
  Design: "Product Designer",
  Mobile: "Mobile Developer",
  Data: "Data Engineer",
  PM: "Project Manager",
};