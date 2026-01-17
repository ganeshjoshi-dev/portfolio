export type SkillCategory = "frontend" | "backend" | "design" | "tools";

export interface Skill {
  name: string;
  icon: string;
  category: SkillCategory;
}

export const skills: Record<SkillCategory, Skill[]> = {
  frontend: [
    { name: "React", icon: "react", category: "frontend" },
    { name: "Next.js", icon: "nextjs", category: "frontend" },
    { name: "TypeScript", icon: "typescript", category: "frontend" },
    { name: "JavaScript", icon: "javascript", category: "frontend" },
    { name: "Tailwind CSS", icon: "tailwind", category: "frontend" },
  ],
  backend: [
    { name: "Node.js", icon: "nodejs", category: "backend" },
    { name: "NestJS", icon: "nestjs", category: "backend" },
    { name: "Express", icon: "express", category: "backend" },
    { name: "Python", icon: "python", category: "backend" },
    { name: "MongoDB", icon: "mongodb", category: "backend" },
    { name: "MySQL", icon: "mysql", category: "backend" },
  ],
  design: [
    { name: "Figma", icon: "figma", category: "design" },
    { name: "Adobe XD", icon: "adobe-xd", category: "design" },
    { name: "Photoshop", icon: "photoshop", category: "design" },
  ],
  tools: [
    { name: "Git", icon: "git", category: "tools" },
    { name: "Vercel", icon: "vercel", category: "tools" },
    { name: "Postman", icon: "postman", category: "tools" },
    { name: "Adobe Commerce", icon: "adobe-commerce", category: "tools" },
  ],
};
