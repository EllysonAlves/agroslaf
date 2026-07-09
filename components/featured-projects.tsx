"use client";

import { ProjectCard } from "@/components/project-card";
import { useProjects } from "@/lib/data";

export function FeaturedProjects({ limit = 4 }: { limit?: number }) {
  const projects = useProjects();
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {projects.slice(0, limit).map((project) => (
        <ProjectCard
          key={project.slug}
          slug={project.slug}
          title={project.title}
          summary={project.summary}
          image={project.image}
          iconName={project.iconName}
        />
      ))}
    </div>
  );
}
