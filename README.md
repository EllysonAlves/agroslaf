# AGROSLAF — Site institucional

Reformulação completa do site da **Associação dos Agricultores e Agricultoras do Sítio Lagoa Funda (AGROSLAF)**, uma associação de agricultura familiar. O site apresenta a instituição, seus projetos sociais, uma galeria de fotos, notícias/blog, transparência institucional e um painel administrativo para gestão de conteúdo.

- **Front-end:** Next.js (App Router) + TypeScript + TailwindCSS + Framer Motion, exportado como **site estático** (`out/`).
- **Back-end:** **API em PHP + MySQL** (roda nativamente no HostGator/cPanel).
- **Fotos:** upload pelo painel admin → salvas em `/uploads` (caminho gravado no banco).

O site funciona **sozinho** mesmo sem a API (usa dados de exemplo em [lib/site-data.ts](lib/site-data.ts)). Quando a API está publicada, os projetos, a galeria e as notícias passam a vir do banco e podem ser editados pelo painel `/admin`.

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Home institucional |
| `/sobre` | Sobre a associação |
| `/projetos`, `/projeto` | Listagem e detalhe dos projetos sociais |
| `/noticias`, `/noticia` | Blog / notícias |
| `/transparencia` | Transparência institucional |
| `/contato` | Contato |
| `/admin` | Painel de gestão de conteúdo (protegido por login) |

---

## Estrutura do projeto

```
agroslaf/
├─ app/                 # Páginas (Next.js): home, sobre, projetos, projeto, noticias, transparencia, contato, admin
├─ components/          # Componentes da interface (header, footer, galeria, admin/, etc.)
├─ lib/                 # Dados de exemplo (site-data), cliente da API (api.ts), ícones
├─ public/images/       # Imagens de referência (substituir pelas fotos reais)
├─ scripts/             # gen-images.py — gera as imagens de referência
├─ api/                 # **Back-end PHP** (endpoints, schema.sql, config)
├─ uploads/             # Pasta onde as fotos enviadas pelo admin são salvas
└─ design-reference/    # Mockups originais (não vão para o site)
```

---

## 1) Rodar localmente (desenvolvimento)

```bash
npm install
npm run dev          # abre http://localhost:3000
```

Sem a API local, o site usa os dados de exemplo automaticamente.

---

## 2) Gerar o site estático (build)

```bash
npm run build
```

Isso gera a pasta **`out/`** com todo o site em HTML/CSS/JS estático. É essa pasta que vai para o HostGator.

> A base da API é configurada pela variável `NEXT_PUBLIC_API_BASE` (padrão `/api`).
> Como o site e a API ficam no mesmo domínio, o padrão `/api` já funciona. Se precisar mudar, copie `.env.example` para `.env.local`, ajuste e rode o build de novo.

---

## 3) Deploy no HostGator (cPanel)

### 3.1 Criar o banco de dados
1. cPanel → **Bancos de Dados MySQL**.
2. Crie um banco (ex.: `usuario_agroslaf`).
3. Crie um usuário MySQL e uma senha.
4. **Adicione o usuário ao banco** com **todos os privilégios**.

### 3.2 Gerar a senha do admin (antes de importar)
Por segurança, o repositório **não** contém nenhuma senha de admin pronta — `api/schema.sql` traz o usuário `admin` com o campo `password_hash` marcado como `SUBSTITUA_PELO_HASH_GERADO`. Antes de importar o banco:

1. Rode `api/tools/gerar-hash.php` localmente (`php -S localhost:8080` na pasta `api/tools` e acesse `http://localhost:8080/gerar-hash.php?senha=SuaSenhaForte`) **ou** suba o arquivo temporariamente no servidor e apague-o logo depois (passo 4).
2. Copie o hash gerado.
3. Abra `api/schema.sql` num editor de texto e substitua `SUBSTITUA_PELO_HASH_GERADO` pelo hash copiado, **antes** de importar no phpMyAdmin.

### 3.3 Importar a estrutura
1. cPanel → **phpMyAdmin** → selecione o banco criado.
2. Aba **Importar** → escolha `api/schema.sql` (já com o hash da sua senha) → **Executar**.
   - Isso cria as tabelas e já insere os projetos, a galeria e as notícias de exemplo, além do usuário `admin` com a senha que você definiu.

### 3.4 Configurar a API
1. Renomeie/copy `api/config.example.php` para **`api/config.php`**.
2. Preencha `db_name`, `db_user`, `db_pass` (dados do passo 3.1).
3. Troque `token_secret` por uma frase longa e secreta (nunca reaproveite a de outro ambiente).

### 3.5 Enviar os arquivos
Pelo **Gerenciador de Arquivos** ou FTP, dentro de `public_html`:

| Enviar | Para |
|---|---|
| **conteúdo** da pasta `out/` | `public_html/` |
| pasta `api/` | `public_html/api/` |
| pasta `uploads/` | `public_html/uploads/` |

Depois, no Gerenciador de Arquivos:
- Garanta que a pasta **`uploads/` tenha permissão `755`** (clique direito → Permissões) para o upload de fotos funcionar.

### 3.6 Pronto
- Site: `https://seu-dominio`
- Painel: `https://seu-dominio/admin` → entre com `admin` e a senha que você definiu no passo 3.2.

> Se você subiu `api/tools/gerar-hash.php` no servidor para gerar o hash, **apague esse arquivo de `public_html/api/tools/` agora** — ele fica fora do controle de acesso do painel e qualquer pessoa com o link pode gerar hashes.

---

## 4) Trocar a senha do admin (a qualquer momento)

1. Envie `api/tools/gerar-hash.php` para `public_html/api/tools/`.
2. Acesse `https://seu-dominio/api/tools/gerar-hash.php?senha=SuaNovaSenha`.
3. Copie o hash exibido.
4. No phpMyAdmin (aba SQL):
   ```sql
   UPDATE admin_users SET password_hash='COLE_O_HASH_AQUI' WHERE username='admin';
   ```
5. **Apague** o arquivo `gerar-hash.php` do servidor.

---

## 5) Substituir as imagens de referência

As imagens em `public/images/` são placeholders com a identidade visual da AGROSLAF.

- **Fotos fixas do site** (hero, projetos exibidos por padrão): substitua os arquivos em `public/images/` mantendo os mesmos nomes e rode o build de novo.
- **Conteúdo gerenciável** (projetos, galeria, notícias): envie as fotos direto pelo painel `/admin` — elas vão para `/uploads` e aparecem no site na hora.

---

## 6) O que dá para gerenciar no painel `/admin`

- **Projetos:** criar, editar e excluir (título, categoria, ícone, imagem, objetivo, benefícios, resultados, galeria e parceiros).
- **Galeria:** enviar e excluir fotos com título e categoria.
- **Notícias:** criar, editar e excluir posts do blog.

Toda alteração feita no painel reflete automaticamente no site.

---

## Variáveis de ambiente

| Arquivo | Uso | Versionado? |
|---|---|---|
| `.env.example` | Modelo de referência | Sim |
| `.env.development` | Usado em `npm run dev` | Sim (não tem segredo, só a URL da API local) |
| `.env.production` | Usado em `npm run build` | Sim (URL pública da API — não tem segredo) |
| `.env.local` | Override local, se precisar | **Não** (ignorado no git) |

Nenhum desses arquivos deve conter segredos: `NEXT_PUBLIC_*` é sempre exposto no bundle do navegador. Segredos reais (senha do banco, `token_secret`) ficam só em `api/config.php`, que nunca é versionado.

---

## Segurança

- `api/config.php` (credenciais do banco e `token_secret`) **nunca** é versionado — veja `.gitignore`. Só existe `api/config.example.php` no repositório.
- O repositório não contém nenhuma senha de admin real: `api/schema.sql` traz o hash como placeholder (`SUBSTITUA_PELO_HASH_GERADO`), que deve ser preenchido antes do primeiro import (passo 3.2).
- `api/tools/gerar-hash.php` é só código-fonte (não tem segredo nenhum), mas **não deve ficar acessível no servidor de produção** fora do momento em que é usado — suba, use, apague (passos 3.6 e 4).
- O painel `/admin` é protegido por login (token assinado por HMAC, validade de 8h) e está marcado como `noindex`.
- A API protege os endpoints de escrita (criar/editar/excluir/upload) exigindo o token de login.
- SEO incluído: metadados, Open Graph, `sitemap.xml`, `robots.txt` e dados estruturados (Schema.org).
