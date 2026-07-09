<?php
require_once __DIR__ . '/helpers.php';
cors();

$method = $_SERVER['REQUEST_METHOD'];
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

/** Converte uma linha do banco para o formato consumido pelo site. */
function map_project(array $row): array
{
    return [
        'slug' => $row['slug'],
        'title' => $row['title'],
        'category' => $row['category'],
        'iconName' => $row['icon_name'],
        'summary' => $row['summary'],
        'image' => $row['image'],
        'objetivo' => $row['objetivo'],
        'beneficios' => json_field($row['beneficios']),
        'resultados' => json_field($row['resultados']),
        'gallery' => json_field($row['gallery']),
        'parceiros' => json_field($row['parceiros']),
    ];
}

if ($method === 'GET') {
    if ($slug !== '') {
        $stmt = db()->prepare('SELECT * FROM projects WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) fail('Projeto nao encontrado.', 404);
        send(map_project($row));
    }
    $rows = db()->query('SELECT * FROM projects ORDER BY sort_order ASC, id ASC')->fetchAll();
    send(array_map('map_project', $rows));
}

// ---- A partir daqui exige autenticacao ----
require_auth();
$data = body();

function project_params(array $data, string $slug): array
{
    return [
        'slug' => $slug,
        'title' => trim($data['title'] ?? ''),
        'category' => trim($data['category'] ?? 'Agricultura'),
        'icon_name' => trim($data['iconName'] ?? 'leaf'),
        'summary' => trim($data['summary'] ?? ''),
        'image' => trim($data['image'] ?? ''),
        'objetivo' => trim($data['objetivo'] ?? ''),
        'beneficios' => json_encode(array_values($data['beneficios'] ?? []), JSON_UNESCAPED_UNICODE),
        'resultados' => json_encode(array_values($data['resultados'] ?? []), JSON_UNESCAPED_UNICODE),
        'gallery' => json_encode(array_values($data['gallery'] ?? []), JSON_UNESCAPED_UNICODE),
        'parceiros' => json_encode(array_values($data['parceiros'] ?? []), JSON_UNESCAPED_UNICODE),
    ];
}

if ($method === 'POST') {
    if (trim($data['title'] ?? '') === '') fail('O titulo e obrigatorio.');
    $newSlug = trim($data['slug'] ?? '') ?: slugify($data['title']);
    $p = project_params($data, $newSlug);
    $p['sort_order'] = (int) db()->query('SELECT COALESCE(MAX(sort_order),0)+1 FROM projects')->fetchColumn();
    $sql = 'INSERT INTO projects (slug, title, category, icon_name, summary, image, objetivo, beneficios, resultados, gallery, parceiros, sort_order)
            VALUES (:slug,:title,:category,:icon_name,:summary,:image,:objetivo,:beneficios,:resultados,:gallery,:parceiros,:sort_order)';
    try {
        db()->prepare($sql)->execute($p);
    } catch (PDOException $e) {
        fail('Ja existe um projeto com esse identificador (slug).', 409);
    }
    $stmt = db()->prepare('SELECT * FROM projects WHERE slug = ?');
    $stmt->execute([$newSlug]);
    send(map_project($stmt->fetch()), 201);
}

if ($method === 'PUT') {
    if ($slug === '') fail('Slug do projeto nao informado.');
    $p = project_params($data, $slug);
    unset($p['slug']);
    $sql = 'UPDATE projects SET title=:title, category=:category, icon_name=:icon_name, summary=:summary,
            image=:image, objetivo=:objetivo, beneficios=:beneficios, resultados=:resultados,
            gallery=:gallery, parceiros=:parceiros WHERE slug=:slug';
    $p['slug'] = $slug;
    db()->prepare($sql)->execute($p);
    $stmt = db()->prepare('SELECT * FROM projects WHERE slug = ?');
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if (!$row) fail('Projeto nao encontrado.', 404);
    send(map_project($row));
}

if ($method === 'DELETE') {
    if ($slug === '') fail('Slug do projeto nao informado.');
    db()->prepare('DELETE FROM projects WHERE slug = ?')->execute([$slug]);
    send(['ok' => true]);
}

fail('Metodo nao permitido.', 405);
