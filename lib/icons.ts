import {
  BookOpen,
  Building2,
  CalendarDays,
  Droplets,
  FileText,
  GraduationCap,
  HandHeart,
  Home,
  Leaf,
  Sprout,
  Tractor,
  Users,
  type LucideIcon,
} from "lucide-react";

// Mapa de icones por nome (string) -> componente.
// Usamos nomes em string para que os dados sejam serializaveis e venham do MySQL.
export const iconMap: Record<string, LucideIcon> = {
  sprout: Sprout,
  leaf: Leaf,
  graduation: GraduationCap,
  home: Home,
  users: Users,
  book: BookOpen,
  droplets: Droplets,
  handheart: HandHeart,
  calendar: CalendarDays,
  file: FileText,
  building: Building2,
  tractor: Tractor,
};

export type IconName = keyof typeof iconMap;

export function getIcon(name?: string): LucideIcon {
  if (name && iconMap[name]) return iconMap[name];
  return Leaf;
}

// Lista usada nos selects do admin
export const iconOptions: { value: IconName; label: string }[] = [
  { value: "sprout", label: "Broto / Agricultura" },
  { value: "leaf", label: "Folha / Sustentabilidade" },
  { value: "graduation", label: "Capacitacao" },
  { value: "home", label: "Casa / Habitacao" },
  { value: "users", label: "Comunidade" },
  { value: "book", label: "Educacao" },
  { value: "droplets", label: "Agua / Infraestrutura" },
  { value: "handheart", label: "Apoio social" },
  { value: "building", label: "Institucional" },
  { value: "tractor", label: "Producao rural" },
];
