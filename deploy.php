<?php
/**
 * deploy.php — Aufruf: https://vegan7.de/deploy.php?secret=DEIN_SECRET
 * Lädt bei korrektem Secret den aktuellen main-Branch vom GitHub-Repo
 * und kopiert alle Dateien ins Webroot.
 */

header("Content-Type: text/plain; charset=utf-8");

require_once __DIR__ . "/config.php";

if (($_GET["secret"] ?? "") !== WEBHOOK_SECRET) {
    http_response_code(403);
    echo "403 — falsches oder fehlendes Secret.";
    exit;
}

require_once __DIR__ . "/deploy_logic.php";
echo run_deploy();
