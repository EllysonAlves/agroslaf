<?php
require_once __DIR__ . '/helpers.php';
cors();
send([
    'name' => 'AGROSLAF API',
    'status' => 'ok',
    'endpoints' => ['auth.php', 'projects.php', 'gallery.php', 'news.php', 'upload.php'],
]);
