<?php
require_once __DIR__ . '/helpers.php';
cors();

$method = $_SERVER['REQUEST_METHOD'];
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

function map_news(array $row): array
{
    return [
        'slug' => $row['slug'],
        'date' => $row['date_label'],
        'category' => $row['category'],
        'title' => $row['title'],
        'excerpt' => $row['excerpt'],
        'image' => $row['image'],
        'content' => $row['content'],
    ];
}

if ($method === 'GET') {
    if ($slug !== '') {
        $stmt = db()->prepare('SELECT * FROM news WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) fail('Noticia nao encontrada.', 404);
        send(map_news($row));
    }
    $rows = db()->query('SELECT * FROM news ORDER BY sort_order ASC, id DESC')->fetchAll();
    send(array_map('map_news', $rows));
}

require_auth();
$data = body();

function news_params(array $data, string $slug): array
{
    return [
        'slug' => $slug,
        'date_label' => trim($data['date'] ?? ''),
        'category' => trim($data['category'] ?? 'Institucional'),
        'title' => trim($data['title'] ?? ''),
        'excerpt' => trim($data['excerpt'] ?? ''),
        'image' => trim($data['image'] ?? ''),
        'content' => trim($data['content'] ?? ''),
    ];
}

if ($method === 'POST') {
    if (trim($data['title'] ?? '') === '') fail('O titulo e obrigatorio.');
    $newSlug = trim($data['slug'] ?? '') ?: slugify($data['title']);
    $p = news_params($data, $newSlug);
    $p['sort_order'] = (int) db()->query('SELECT COALESCE(MAX(sort_order),0)+1 FROM news')->fetchColumn();
    $sql = 'INSERT INTO news (slug, date_label, category, title, excerpt, image, content, sort_order)
            VALUES (:slug,:date_label,:category,:title,:excerpt,:image,:content,:sort_order)';
    try {
        db()->prepare($sql)->execute($p);
    } catch (PDOException $e) {
        fail('Ja existe uma noticia com esse identificador (slug).', 409);
    }
    $stmt = db()->prepare('SELECT * FROM news WHERE slug = ?');
    $stmt->execute([$newSlug]);
    send(map_news($stmt->fetch()), 201);
}

if ($method === 'PUT') {
    if ($slug === '') fail('Slug da noticia nao informado.');
    $p = news_params($data, $slug);
    $sql = 'UPDATE news SET date_label=:date_label, category=:category, title=:title,
            excerpt=:excerpt, image=:image, content=:content WHERE slug=:slug';
    db()->prepare($sql)->execute($p);
    $stmt = db()->prepare('SELECT * FROM news WHERE slug = ?');
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if (!$row) fail('Noticia nao encontrada.', 404);
    send(map_news($row));
}

if ($method === 'DELETE') {
    if ($slug === '') fail('Slug da noticia nao informado.');
    db()->prepare('DELETE FROM news WHERE slug = ?')->execute([$slug]);
    send(['ok' => true]);
}

fail('Metodo nao permitido.', 405);
