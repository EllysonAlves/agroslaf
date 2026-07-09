-- =============================================================================
-- AGROSLAF - Estrutura do banco de dados (MySQL / MariaDB)
-- -----------------------------------------------------------------------------
-- Como usar no HostGator:
--   1. cPanel > phpMyAdmin > selecione o banco criado.
--   2. Aba "Importar" > escolha este arquivo > Executar.
--      (ou cole o conteudo na aba "SQL" e execute)
--
-- Login admin padrao:  usuario: admin
-- A senha NAO vem definida neste arquivo por seguranca.
-- Antes de importar, gere um hash com api/tools/gerar-hash.php e troque o
-- valor de SUBSTITUA_PELO_HASH_GERADO abaixo (veja o README, secao "Deploy").
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---- Usuarios do admin ----
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Projetos ----
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  icon_name VARCHAR(40) NOT NULL DEFAULT 'leaf',
  summary TEXT NOT NULL,
  image VARCHAR(255) NOT NULL DEFAULT '',
  objetivo TEXT NOT NULL,
  beneficios LONGTEXT NOT NULL,    -- JSON: ["...", "..."]
  resultados LONGTEXT NOT NULL,    -- JSON: [{"value":"120+","label":"..."}]
  gallery LONGTEXT NOT NULL,       -- JSON: ["/uploads/...", ...]
  parceiros LONGTEXT NOT NULL,     -- JSON: ["...", "..."]
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Galeria de fotos ----
CREATE TABLE IF NOT EXISTS gallery_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Eventos',
  image VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Noticias ----
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  date_label VARCHAR(60) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Institucional',
  title VARCHAR(220) NOT NULL,
  excerpt TEXT NOT NULL,
  image VARCHAR(255) NOT NULL DEFAULT '',
  content LONGTEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- DADOS INICIAIS
-- =============================================================================

-- Admin padrao (senha definida na hora do deploy, veja instrucoes acima)
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', 'SUBSTITUA_PELO_HASH_GERADO')
ON DUPLICATE KEY UPDATE username = username;

-- Projetos
INSERT INTO projects (slug, title, category, icon_name, summary, image, objetivo, beneficios, resultados, gallery, parceiros, sort_order) VALUES
('quintais-vivos','Quintais Vivos','Agricultura','sprout','Promovendo seguranca alimentar e geracao de renda para familias do campo por meio de quintais produtivos.','/images/projeto-quintais-vivos.jpg','Fortalecer a seguranca alimentar e gerar renda extra para as familias por meio do cultivo de hortas e quintais produtivos, valorizando o conhecimento local e a producao agroecologica.','["Alimentos saudaveis na mesa das familias","Renda extra com a venda do excedente","Resgate de praticas agroecologicas","Maior autonomia das mulheres do campo"]','[{"value":"120+","label":"quintais implantados"},{"value":"300+","label":"familias beneficiadas"},{"value":"15","label":"comunidades atendidas"}]','["/images/galeria-2.jpg","/images/galeria-5.jpg","/images/projeto-quintais-vivos.jpg"]','["Prefeitura Municipal","SENAR","Sindicato Rural"]',1),
('capacitacoes','Capacitacoes','Educacao','graduation','Formacao e conhecimento para fortalecer agricultores e agricultoras, ampliando habilidades e oportunidades.','/images/projeto-capacitacoes.jpg','Oferecer formacao tecnica e profissional para agricultores e agricultoras, ampliando habilidades, gerando oportunidades e fortalecendo a producao familiar.','["Capacitacao tecnica continua","Acesso a novas tecnologias do campo","Geracao de oportunidades de trabalho","Troca de experiencias entre associados"]','[{"value":"40+","label":"turmas realizadas"},{"value":"500+","label":"participantes"},{"value":"12","label":"areas de formacao"}]','["/images/galeria-3.jpg","/images/projeto-capacitacoes.jpg","/images/galeria-1.jpg"]','["SENAR","SEBRAE","IPA"]',2),
('minha-casa-rural','Minha Casa Minha Vida Rural','Infraestrutura','home','Apoiando familias do campo na conquista da casa propria com dignidade e melhores condicoes de vida.','/images/projeto-minha-casa-rural.jpg','Apoiar familias da comunidade na conquista da casa propria no campo, garantindo dignidade, seguranca e melhores condicoes de moradia rural.','["Moradia digna no campo","Apoio na documentacao e processos","Melhoria das condicoes de vida","Permanencia das familias na zona rural"]','[{"value":"60+","label":"casas viabilizadas"},{"value":"240+","label":"pessoas beneficiadas"},{"value":"8","label":"comunidades"}]','["/images/projeto-minha-casa-rural.jpg","/images/galeria-6.jpg","/images/galeria-4.jpg"]','["Governo Federal","Prefeitura Municipal","Caixa Economica"]',3),
('producao-sustentavel','Producao Sustentavel','Sustentabilidade','leaf','Incentivo a praticas sustentaveis e respeito ao meio ambiente para garantir o futuro das proximas geracoes.','/images/projeto-producao-sustentavel.jpg','Incentivar praticas agricolas sustentaveis que respeitem o meio ambiente, preservem o solo e a agua e garantam o futuro produtivo das proximas geracoes.','["Uso consciente dos recursos naturais","Reducao do uso de agrotoxicos","Preservacao do solo e da agua","Producao mais saudavel e rentavel"]','[{"value":"80+","label":"produtores engajados"},{"value":"10","label":"comunidades"},{"value":"30%","label":"menos desperdicio"}]','["/images/projeto-producao-sustentavel.jpg","/images/galeria-5.jpg","/images/galeria-2.jpg"]','["IPA","Embrapa","SENAR"]',4),
('fortalecimento-comunitario','Fortalecimento Comunitario','Comunidade','users','Acoes que fortalecem vinculos, promovem a participacao social e constroem comunidades mais unidas.','/images/projeto-fortalecimento-comunitario.jpg','Fortalecer os vinculos comunitarios por meio de acoes coletivas, promovendo participacao social, uniao e o protagonismo das familias do campo.','["Comunidades mais unidas e participativas","Espacos de dialogo e decisao coletiva","Valorizacao da cultura local","Fortalecimento da associacao"]','[{"value":"25+","label":"encontros por ano"},{"value":"300+","label":"associados ativos"},{"value":"15","label":"comunidades"}]','["/images/projeto-fortalecimento-comunitario.jpg","/images/galeria-1.jpg","/images/galeria-4.jpg"]','["Sindicato Rural","Igrejas locais","Prefeitura Municipal"]',5),
('meio-ambiente','Meio Ambiente','Sustentabilidade','leaf','Preservacao, recuperacao e educacao ambiental para cuidar da terra que nos sustenta.','/images/projeto-meio-ambiente.jpg','Promover a preservacao e a recuperacao ambiental, alem da educacao ambiental nas comunidades, cuidando da terra que sustenta a agricultura familiar.','["Recuperacao de areas degradadas","Educacao ambiental nas escolas","Protecao de nascentes e matas","Consciencia ecologica nas familias"]','[{"value":"5 mil+","label":"mudas plantadas"},{"value":"20","label":"nascentes protegidas"},{"value":"12","label":"comunidades"}]','["/images/projeto-meio-ambiente.jpg","/images/galeria-5.jpg","/images/galeria-2.jpg"]','["IPA","Secretaria de Meio Ambiente","Escolas municipais"]',6),
('educacao-no-campo','Educacao no Campo','Educacao','book','Iniciativas que valorizam a educacao como ferramenta de transformacao e inclusao social.','/images/projeto-educacao-no-campo.jpg','Valorizar a educacao no campo como instrumento de transformacao e inclusao social, ampliando o acesso ao conhecimento para criancas, jovens e adultos.','["Reforco escolar e alfabetizacao","Inclusao digital no campo","Valorizacao da identidade rural","Oportunidades para jovens"]','[{"value":"200+","label":"alunos atendidos"},{"value":"10","label":"turmas"},{"value":"8","label":"comunidades"}]','["/images/projeto-educacao-no-campo.jpg","/images/galeria-3.jpg","/images/galeria-1.jpg"]','["Secretaria de Educacao","Escolas municipais","Voluntarios"]',7),
('infraestrutura-rural','Infraestrutura Rural','Infraestrutura','droplets','Melhorias que garantem acesso a agua, estradas e estruturas que impulsionam o desenvolvimento local.','/images/projeto-infraestrutura-rural.jpg','Buscar melhorias de infraestrutura para as comunidades rurais, como acesso a agua, estradas e estruturas que impulsionam o desenvolvimento local.','["Acesso a agua de qualidade","Melhoria das estradas vicinais","Estruturas coletivas de producao","Mais qualidade de vida no campo"]','[{"value":"30+","label":"obras viabilizadas"},{"value":"15","label":"comunidades"},{"value":"300+","label":"familias atendidas"}]','["/images/projeto-infraestrutura-rural.jpg","/images/galeria-6.jpg","/images/galeria-4.jpg"]','["Prefeitura Municipal","Governo do Estado","Compesa"]',8)
ON DUPLICATE KEY UPDATE slug = slug;

-- Galeria
INSERT INTO gallery_photos (title, category, image, sort_order) VALUES
('Reuniao da comunidade','Reunioes','/images/galeria-1.jpg',1),
('Dia de campo','Agricultura','/images/galeria-2.jpg',2),
('Capacitacao tecnica','Capacitacoes','/images/galeria-3.jpg',3),
('Encontro de associados','Eventos','/images/galeria-4.jpg',4),
('Colheita coletiva','Agricultura','/images/galeria-5.jpg',5),
('Mutirao comunitario','Comunidade','/images/galeria-6.jpg',6);

-- Noticias
INSERT INTO news (slug, date_label, category, title, excerpt, image, content, sort_order) VALUES
('capacitacao-agricultores-regiao','18 de novembro, 2025','Capacitacoes','AGROSLAF realiza mais uma capacitacao com agricultores da regiao','Mais uma turma concluiu a formacao tecnica voltada para o fortalecimento da agricultura familiar.','/images/noticia-1.jpg','A AGROSLAF realizou mais uma capacitacao voltada aos agricultores e agricultoras da regiao, reforcando o compromisso com a formacao continua e o desenvolvimento do campo.',1),
('quintais-vivos-resultados','10 de novembro, 2025','Projetos','Projeto Quintais Vivos: colhendo resultados e transformando familias','O projeto segue ampliando a seguranca alimentar e a geracao de renda nas comunidades atendidas.','/images/noticia-2.jpg','O projeto Quintais Vivos continua transformando a realidade de centenas de familias, promovendo seguranca alimentar e renda extra com a producao dos quintais.',2),
('reuniao-diretoria-2025','05 de novembro, 2025','Institucional','Reuniao da diretoria fortalece planejamento para 2026','A diretoria se reuniu para definir as prioridades e os novos projetos do proximo ano.','/images/noticia-3.jpg','A diretoria da AGROSLAF se reuniu para alinhar o planejamento estrategico e definir as prioridades dos proximos projetos da associacao.',3)
ON DUPLICATE KEY UPDATE slug = slug;

SET FOREIGN_KEY_CHECKS = 1;
