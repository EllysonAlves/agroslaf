import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getIcon } from "@/lib/icons";

type ProjectCardProps = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  iconName: string;
};

export function ProjectCard({ slug, title, summary, image, iconName }: ProjectCardProps) {
  const Icon = getIcon(iconName);
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white soft-shadow transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/2.55] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="relative flex flex-1 flex-col px-5 pb-6 pt-8">
        <div className="absolute -top-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-secondary text-white shadow-lg">
          <Icon size={25} />
        </div>
        <h3 className="text-lg font-black text-primary">{title}</h3>
        <p className="mt-3 flex-1 text-sm font-medium leading-6 text-slate-600">{summary}</p>
        <Link
          href={`/projeto/?slug=${slug}`}
          className="focus-ring mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-black uppercase text-secondary-deep"
        >
          Saiba mais <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
