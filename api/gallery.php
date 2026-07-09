<?php
require_once __DIR__ . '/helpers.php';
cors();

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

function map_photo(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'category' => $row['category'],
        'image' => $row['image'],
    ];
}

if ($method === 'GET') {
    $rows = db()->query('SELECT * FROM gallery_photos ORDER BY sort_order ASC, id DESC')->fetchAll();
    send(array_map('map_photo', $rows));
}

require_auth();
$data = body();

if ($method === 'POST') {
    $image = trim($data['image'] ?? '');
    if ($image === '') fail('Imagem obrigatoria.');
    $params = [
        'title' => trim($data['title'] ?? 'Sem titulo'),
        'category' => trim($data['category'] ?? 'Eventos'),
        'image' => $image,
        'sort_order' => (int) db()->query('SELECT COALESCE(MAX(sort_order),0)+1 FROM gallery_photos')->fetchColumn(),
    ];
    $sql = 'INSERT INTO gallery_photos (title, category, image, sort_order)
            VALUES (:title,:category,:image,:sort_order)';
    db()->prepare($sql)->execute($params);
    $newId = (int) db()->lastInsertId();
    $stmt = db()->prepare('SELECT * FROM gallery_photos WHERE id = ?');
    $stmt->execute([$newId]);
    send(map_photo($stmt->fetch()), 201);
}

if ($method === 'PUT') {
    if ($id <= 0) fail('ID nao informado.');
    $params = [
        'title' => trim($data['title'] ?? ''),
        'category' => trim($data['category'] ?? 'Eventos'),
        'id' => $id,
    ];
    db()->prepare('UPDATE gallery_photos SET title=:title, category=:category WHERE id=:id')->execute($params);
    $stmt = db()->prepare('SELECT * FROM gallery_photos WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) fail('Foto nao encontrada.', 404);
    send(map_photo($row));
}

if ($method === 'DELETE') {
    if ($id <= 0) fail('ID nao informado.');
    db()->prepare('DELETE FROM gallery_photos WHERE id = ?')->execute([$id]);
    send(['ok' => true]);
}

fail('Metodo nao permitido.', 405);
