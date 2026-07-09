// =============================================================================
// DADOS ESTATICOS (FALLBACK)
// -----------------------------------------------------------------------------
// Estes dados sao usados na geracao estatica e como fallback quando a API
// PHP/MySQL nao estiver disponivel. Quando a API responde, o conteudo dinamico
// (projetos, galeria, noticias) substitui estes valores no cliente.
// =============================================================================

import type { IconName } from "@/lib/icons";

export const siteInfo = {
  name: "AGROSLAF",
  fullName: "Associacao dos Agricultores e Agricultoras do Sitio Lagoa Funda",
  tagline: "Sitio Lagoa Funda",
  phone: "(81) 98165-4321",
  phoneRaw: "5581981654321",
  email: "contato@agroslaf.org.br",
  address: "Sitio Lagoa Funda - Joao Alfredo/PE",
  foundedYear: "1995",
};

export const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nossa Historia", href: "/sobre" },
  { label: "Projetos", href: "/projetos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Transparencia", href: "/transparencia" },
  { label: "Contato", href: "/contato" },
];

export const images = {
  hero: "/images/hero.jpg",
  logo: "/images/logo.png",
};

// ---- Tipos ----
export type Metric = { value: string; label: string; iconName: IconName };

export type Project = {
  slug: string;
  title: string;
  category: string;
  iconName: IconName;
  summary: string;
  image: string;
  objetivo: string;
  beneficios: string[];
  resultados: { value: string; label: string }[];
  gallery: string[];
  editions?: { title: string; photos: string[] }[];
  parceiros: string[];
};

export type Story = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

export type GalleryPhoto = {
  id: number;
  title: string;
  category: string;
  image: string;
};

export type NewsItem = {
  slug: string;
  date: string;
  category: string;
  author?: string;
  title: string;
  excerpt: string;
  image: string;
  content?: string;
  published?: boolean;
  featured?: boolean;
  gallery?: string[];
  tags?: string[];
};

// ---- Metricas ----
export const metrics: Metric[] = [
  { value: "30", label: "anos de atuacao", iconName: "calendar" },
  { value: "300+", label: "beneficiarios diretos e indiretos", iconName: "users" },
  { value: "25+", label: "projetos realizados", iconName: "leaf" },
  { value: "15+", label: "comunidades atendidas", iconName: "home" },
  { value: "300+", label: "familias impactadas", iconName: "handheart" },
];

// ---- Linha do tempo ----
export const timeline = [
  { year: "1995", title: "O Inicio", text: "25 agricultores e agricultoras fundadores se uniram para criar a associacao." },
  { year: "2000", title: "Primeiros Passos", text: "Projetos e capacitacoes comecaram a fortalecer a agricultura familiar." },
  { year: "2010", title: "Crescimento", text: "Novas parcerias ampliaram o impacto social em toda a comunidade." },
  { year: "2025", title: "30 Anos", text: "Mais de 300 familias impactadas por um legado coletivo de transformacao." },
];

// ---- Categorias de projeto ----
export const projectCategories = [
  "Todos",
  "Agricultura",
  "Educacao",
  "Sustentabilidade",
  "Comunidade",
  "Infraestrutura",
];

// ---- Projetos ----
export const projects: Project[] = [
  {
    slug: "quintais-vivos",
    title: "Quintais Vivos",
    category: "Agricultura",
    iconName: "sprout",
    summary: "Promovendo seguranca alimentar e geracao de renda para familias do campo por meio de quintais produtivos.",
    image: "/images/projeto-quintais-vivos.jpg",
    objetivo: "Fortalecer a seguranca alimentar e gerar renda extra para as familias por meio do cultivo de hortas e quintais produtivos, valorizando o conhecimento local e a producao agroecologica.",
    beneficios: [
      "Alimentos saudaveis na mesa das familias",
      "Renda extra com a venda do excedente",
      "Resgate de praticas agroecologicas",
      "Maior autonomia das mulheres do campo",
    ],
    resultados: [
      { value: "120+", label: "quintais implantados" },
      { value: "300+", label: "familias beneficiadas" },
      { value: "15", label: "comunidades atendidas" },
    ],
    gallery: ["/images/galeria-2.jpg", "/images/galeria-5.jpg", "/images/projeto-quintais-vivos.jpg"],
    parceiros: ["Prefeitura Municipal", "SENAR", "Sindicato Rural"],
  },
  {
    slug: "capacitacoes",
    title: "Capacitacoes",
    category: "Educacao",
    iconName: "graduation",
    summary: "Formacao e conhecimento para fortalecer agricultores e agricultoras, ampliando habilidades e oportunidades.",
    image: "/images/projeto-capacitacoes.jpg",
    objetivo: "Oferecer formacao tecnica e profissional para agricultores e agricultoras, ampliando habilidades, gerando oportunidades e fortalecendo a producao familiar.",
    beneficios: [
      "Capacitacao tecnica continua",
      "Acesso a novas tecnologias do campo",
      "Geracao de oportunidades de trabalho",
      "Troca de experiencias entre associados",
    ],
    resultados: [
      { value: "40+", label: "turmas realizadas" },
      { value: "500+", label: "participantes" },
      { value: "12", label: "areas de formacao" },
    ],
    gallery: ["/images/galeria-3.jpg", "/images/projeto-capacitacoes.jpg", "/images/galeria-1.jpg"],
    parceiros: ["SENAR", "SEBRAE", "IPA"],
  },
  {
    slug: "minha-casa-rural",
    title: "Minha Casa Minha Vida Rural",
    category: "Infraestrutura",
    iconName: "home",
    summary: "Apoiando familias do campo na conquista da casa propria com dignidade e melhores condicoes de vida.",
    image: "/images/projeto-minha-casa-rural.jpg",
    objetivo: "Apoiar familias da comunidade na conquista da casa propria no campo, garantindo dignidade, seguranca e melhores condicoes de moradia rural.",
    beneficios: [
      "Moradia digna no campo",
      "Apoio na documentacao e processos",
      "Melhoria das condicoes de vida",
      "Permanencia das familias na zona rural",
    ],
    resultados: [
      { value: "60+", label: "casas viabilizadas" },
      { value: "240+", label: "pessoas beneficiadas" },
      { value: "8", label: "comunidades" },
    ],
    gallery: ["/images/projeto-minha-casa-rural.jpg", "/images/galeria-6.jpg", "/images/galeria-4.jpg"],
    parceiros: ["Governo Federal", "Prefeitura Municipal", "Caixa Economica"],
  },
  {
    slug: "producao-sustentavel",
    title: "Producao Sustentavel",
    category: "Sustentabilidade",
    iconName: "leaf",
    summary: "Incentivo a praticas sustentaveis e respeito ao meio ambiente para garantir o futuro das proximas geracoes.",
    image: "/images/projeto-producao-sustentavel.jpg",
    objetivo: "Incentivar praticas agricolas sustentaveis que respeitem o meio ambiente, preservem o solo e a agua e garantam o futuro produtivo das proximas geracoes.",
    beneficios: [
      "Uso consciente dos recursos naturais",
      "Reducao do uso de agrotoxicos",
      "Preservacao do solo e da agua",
      "Producao mais saudavel e rentavel",
    ],
    resultados: [
      { value: "80+", label: "produtores engajados" },
      { value: "10", label: "comunidades" },
      { value: "30%", label: "menos desperdicio" },
    ],
    gallery: ["/images/projeto-producao-sustentavel.jpg", "/images/galeria-5.jpg", "/images/galeria-2.jpg"],
    parceiros: ["IPA", "Embrapa", "SENAR"],
  },
  {
    slug: "fortalecimento-comunitario",
    title: "Fortalecimento Comunitario",
    category: "Comunidade",
    iconName: "users",
    summary: "Acoes que fortalecem vinculos, promovem a participacao social e constroem comunidades mais unidas.",
    image: "/images/projeto-fortalecimento-comunitario.jpg",
    objetivo: "Fortalecer os vinculos comunitarios por meio de acoes coletivas, promovendo participacao social, uniao e o protagonismo das familias do campo.",
    beneficios: [
      "Comunidades mais unidas e participativas",
      "Espacos de dialogo e decisao coletiva",
      "Valorizacao da cultura local",
      "Fortalecimento da associacao",
    ],
    resultados: [
      { value: "25+", label: "encontros por ano" },
      { value: "300+", label: "associados ativos" },
      { value: "15", label: "comunidades" },
    ],
    gallery: ["/images/projeto-fortalecimento-comunitario.jpg", "/images/galeria-1.jpg", "/images/galeria-4.jpg"],
    parceiros: ["Sindicato Rural", "Igrejas locais", "Prefeitura Municipal"],
  },
  {
    slug: "meio-ambiente",
    title: "Meio Ambiente",
    category: "Sustentabilidade",
    iconName: "leaf",
    summary: "Preservacao, recuperacao e educacao ambiental para cuidar da terra que nos sustenta.",
    image: "/images/projeto-meio-ambiente.jpg",
    objetivo: "Promover a preservacao e a recuperacao ambiental, alem da educacao ambiental nas comunidades, cuidando da terra que sustenta a agricultura familiar.",
    beneficios: [
      "Recuperacao de areas degradadas",
      "Educacao ambiental nas escolas",
      "Protecao de nascentes e matas",
      "Consciencia ecologica nas familias",
    ],
    resultados: [
      { value: "5 mil+", label: "mudas plantadas" },
      { value: "20", label: "nascentes protegidas" },
      { value: "12", label: "comunidades" },
    ],
    gallery: ["/images/projeto-meio-ambiente.jpg", "/images/galeria-5.jpg", "/images/galeria-2.jpg"],
    parceiros: ["IPA", "Secretaria de Meio Ambiente", "Escolas municipais"],
  },
  {
    slug: "educacao-no-campo",
    title: "Educacao no Campo",
    category: "Educacao",
    iconName: "book",
    summary: "Iniciativas que valorizam a educacao como ferramenta de transformacao e inclusao social.",
    image: "/images/projeto-educacao-no-campo.jpg",
    objetivo: "Valorizar a educacao no campo como instrumento de transformacao e inclusao social, ampliando o acesso ao conhecimento para criancas, jovens e adultos.",
    beneficios: [
      "Reforco escolar e alfabetizacao",
      "Inclusao digital no campo",
      "Valorizacao da identidade rural",
      "Oportunidades para jovens",
    ],
    resultados: [
      { value: "200+", label: "alunos atendidos" },
      { value: "10", label: "turmas" },
      { value: "8", label: "comunidades" },
    ],
    gallery: ["/images/projeto-educacao-no-campo.jpg", "/images/galeria-3.jpg", "/images/galeria-1.jpg"],
    parceiros: ["Secretaria de Educacao", "Escolas municipais", "Voluntarios"],
  },
  {
    slug: "infraestrutura-rural",
    title: "Infraestrutura Rural",
    category: "Infraestrutura",
    iconName: "droplets",
    summary: "Melhorias que garantem acesso a agua, estradas e estruturas que impulsionam o desenvolvimento local.",
    image: "/images/projeto-infraestrutura-rural.jpg",
    objetivo: "Buscar melhorias de infraestrutura para as comunidades rurais, como acesso a agua, estradas e estruturas que impulsionam o desenvolvimento local.",
    beneficios: [
      "Acesso a agua de qualidade",
      "Melhoria das estradas vicinais",
      "Estruturas coletivas de producao",
      "Mais qualidade de vida no campo",
    ],
    resultados: [
      { value: "30+", label: "obras viabilizadas" },
      { value: "15", label: "comunidades" },
      { value: "300+", label: "familias atendidas" },
    ],
    gallery: ["/images/projeto-infraestrutura-rural.jpg", "/images/galeria-6.jpg", "/images/galeria-4.jpg"],
    parceiros: ["Prefeitura Municipal", "Governo do Estado", "Compesa"],
  },
];

// ---- Depoimentos ----
export const stories: Story[] = [
  {
    name: "Maria Jose",
    role: "Agricultora - Sitio Lagoa Funda",
    image: "/images/depoimento-mj.jpg",
    quote: "O projeto Quintais Vivos mudou nossa alimentacao e hoje temos renda extra com o que produzimos.",
  },
  {
    name: "Seu Joao",
    role: "Agricultor",
    image: "/images/depoimento-sj.jpg",
    quote: "A capacitacao nos deu novos conhecimentos e abriu portas para melhorar nossa producao.",
  },
  {
    name: "Dona Antonia",
    role: "Agricultora",
    image: "/images/depoimento-da.jpg",
    quote: "Aqui encontramos apoio, uniao e a certeza de que nao estamos sozinhos nessa caminhada.",
  },
];

// ---- Galeria ----
export const galleryCategories = [
  "Todos",
  "Eventos",
  "Capacitacoes",
  "Reunioes",
  "Agricultura",
  "Comunidade",
];

export const gallery: GalleryPhoto[] = [
  { id: 1, title: "Reuniao da comunidade", category: "Reunioes", image: "/images/galeria-1.jpg" },
  { id: 2, title: "Dia de campo", category: "Agricultura", image: "/images/galeria-2.jpg" },
  { id: 3, title: "Capacitacao tecnica", category: "Capacitacoes", image: "/images/galeria-3.jpg" },
  { id: 4, title: "Encontro de associados", category: "Eventos", image: "/images/galeria-4.jpg" },
  { id: 5, title: "Colheita coletiva", category: "Agricultura", image: "/images/galeria-5.jpg" },
  { id: 6, title: "Mutirao comunitario", category: "Comunidade", image: "/images/galeria-6.jpg" },
];

// ---- Noticias ----
export const news: NewsItem[] = [
  {
    slug: "capacitacao-agricultores-regiao",
    date: "18 de novembro, 2025",
    category: "Capacitacoes",
    title: "AGROSLAF realiza mais uma capacitacao com agricultores da regiao",
    excerpt: "Mais uma turma concluiu a formacao tecnica voltada para o fortalecimento da agricultura familiar.",
    image: "/images/noticia-1.jpg",
    content: "A AGROSLAF realizou mais uma capacitacao voltada aos agricultores e agricultoras da regiao, reforcando o compromisso com a formacao continua e o desenvolvimento do campo.",
  },
  {
    slug: "quintais-vivos-resultados",
    date: "10 de novembro, 2025",
    category: "Projetos",
    title: "Projeto Quintais Vivos: colhendo resultados e transformando familias",
    excerpt: "O projeto segue ampliando a seguranca alimentar e a geracao de renda nas comunidades atendidas.",
    image: "/images/noticia-2.jpg",
    content: "O projeto Quintais Vivos continua transformando a realidade de centenas de familias, promovendo seguranca alimentar e renda extra com a producao dos quintais.",
  },
  {
    slug: "reuniao-diretoria-2025",
    date: "05 de novembro, 2025",
    category: "Institucional",
    title: "Reuniao da diretoria fortalece planejamento para 2026",
    excerpt: "A diretoria se reuniu para definir as prioridades e os novos projetos do proximo ano.",
    image: "/images/noticia-3.jpg",
    content: "A diretoria da AGROSLAF se reuniu para alinhar o planejamento estrategico e definir as prioridades dos proximos projetos da associacao.",
  },
];

// ---- Transparencia ----
export const transparency = [
  { label: "Estatuto", iconName: "file" as IconName },
  { label: "Prestacao de Contas", iconName: "file" as IconName },
  { label: "Relatorios", iconName: "file" as IconName },
  { label: "Atas", iconName: "file" as IconName },
  { label: "Documentos", iconName: "file" as IconName },
  { label: "Downloads", iconName: "file" as IconName },
];

// ---- Conteudo "Nossa Historia" ----
export const about = {
  intro:
    "Em janeiro de 1995, nasceu a AGROSLAF no Sitio Lagoa Funda, com o sonho de 25 agricultores e agricultoras que acreditaram que juntos poderiam mudar a realidade do campo.",
  founders: { total: 25, homens: 16, mulheres: 9 },
  paragraphs: [
    "A origem da AGROSLAF remonta a uniao de 25 agricultores - 16 homens e 9 mulheres - do Sitio Lagoa Funda, que se organizaram para buscar melhorias para suas comunidades.",
    "Ao longo de 30 anos, a associacao desenvolveu projetos voltados para a agricultura familiar, a capacitacao profissional, a inclusao social, a sustentabilidade, a habitacao rural e o fortalecimento comunitario.",
    "Hoje, somos mais fortes, mais unidos e seguimos plantando dignidade, colhendo conquistas e semeando futuro.",
  ],
  valores: [
    { title: "Uniao comunitaria", text: "A forca do coletivo move cada conquista da associacao." },
    { title: "Agricultura familiar", text: "Valorizamos quem produz alimento e cuida da terra." },
    { title: "Sustentabilidade", text: "Cuidamos do meio ambiente para as proximas geracoes." },
    { title: "Transparencia", text: "Prestamos contas com clareza e responsabilidade." },
  ],
};
