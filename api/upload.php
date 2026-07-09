<?php
require_once __DIR__ . '/helpers.php';
cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Metodo nao permitido.', 405);
}

require_auth();

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    fail('Nenhum arquivo enviado ou erro no upload.');
}

$c = config();
$file = $_FILES['file'];

if ($file['size'] > ($c['max_upload_bytes'] ?? 5242880)) {
    fail('Arquivo muito grande. Maximo de 5 MB.', 413);
}

// Valida o tipo real da imagem
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];
$info = @getimagesize($file['tmp_name']);
$mime = $info['mime'] ?? '';
if (!isset($allowed[$mime])) {
    fail('Formato invalido. Envie JPG, PNG, WEBP ou GIF.', 415);
}

$ext = $allowed[$mime];
$dir = $c['upload_dir'];
if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
}
if (!is_writable($dir)) {
    fail('A pasta de uploads nao tem permissao de escrita. Ajuste para 755 no cPanel.', 500);
}

$name = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
$dest = rtrim($dir, '/') . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    fail('Falha ao salvar o arquivo.', 500);
}

$url = rtrim($c['upload_url'], '/') . '/' . $name;
send(['path' => $url, 'url' => $url], 201);
