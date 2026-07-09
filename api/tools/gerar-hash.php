<?php
/**
 * Utilitario TEMPORARIO para gerar o hash de uma nova senha de admin.
 *
 * COMO USAR:
 *   1. Faca upload deste arquivo para public_html/api/tools/
 *   2. Acesse no navegador:  https://SEU-DOMINIO/api/tools/gerar-hash.php?senha=MinhaNovaSenha
 *   3. Copie o hash exibido.
 *   4. No phpMyAdmin rode:
 *        UPDATE admin_users SET password_hash='COLE_O_HASH_AQUI' WHERE username='admin';
 *   5. APAGUE este arquivo do servidor (por seguranca).
 */
header('Content-Type: text/plain; charset=utf-8');
$senha = $_GET['senha'] ?? '';
if ($senha === '') {
    echo "Informe ?senha=SUA_SENHA na URL.";
    exit;
}
echo password_hash($senha, PASSWORD_BCRYPT);
