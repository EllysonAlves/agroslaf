<?php
/**
 * Configuracao da API AGROSLAF.
 *
 * PASSO A PASSO (HostGator / cPanel):
 * 1. Crie um banco MySQL e um usuario no cPanel (secao "Bancos de Dados MySQL").
 * 2. Associe o usuario ao banco com TODOS os privilegios.
 * 3. Copie este arquivo para "config.php" e preencha os dados abaixo.
 * 4. Troque ADMIN_TOKEN_SECRET por uma frase longa e secreta.
 *
 * IMPORTANTE: nunca versione o config.php real com as senhas.
 */

return [
    // ---- Banco de dados (dados do cPanel) ----
    'db_host' => 'localhost',
    'db_name' => 'usuario_agroslaf',   // ex: cpaneluser_agroslaf
    'db_user' => 'usuario_agroslaf',   // ex: cpaneluser_agro
    'db_pass' => 'SUA_SENHA_AQUI',
    'db_charset' => 'utf8mb4',

    // ---- Seguranca ----
    // Use uma frase longa e aleatoria. Ex: gere em https://passwordsgenerator.net
    'token_secret' => 'TROQUE-ESTA-FRASE-POR-ALGO-LONGO-E-SECRETO',
    'token_ttl' => 60 * 60 * 8, // validade do login em segundos (8h)

    // ---- Upload de imagens ----
    // Pasta (relativa a /api) onde as fotos enviadas serao salvas.
    'upload_dir' => __DIR__ . '/../uploads',
    // URL publica correspondente a pasta acima.
    'upload_url' => '/uploads',
    'max_upload_bytes' => 5 * 1024 * 1024, // 5 MB

    // ---- CORS ----
    // Em producao (site e API no mesmo dominio) pode deixar vazio.
    // Para dev local com Next em http://localhost:3000, informe a origem.
    'allowed_origin' => '*',
];
