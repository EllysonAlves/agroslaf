<?php
require_once __DIR__ . '/helpers.php';
cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Metodo nao permitido.', 405);
}

$data = body();
$username = trim($data['username'] ?? '');
$password = (string) ($data['password'] ?? '');

if ($username === '' || $password === '') {
    fail('Informe usuario e senha.');
}

$stmt = db()->prepare('SELECT username, password_hash FROM admin_users WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    fail('Usuario ou senha invalidos.', 401);
}

send([
    'token' => make_token($user['username']),
    'user' => ['username' => $user['username']],
]);
