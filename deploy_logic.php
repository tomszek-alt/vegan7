<?php
/**
 * deploy_logic.php — lädt den aktuellen main-Branch als Zip von GitHub
 * und kopiert alle Dateien ins Webroot (dieses Verzeichnis).
 *
 * Achtung: Diese Datei kann sich nicht selbst aktualisieren. Ändert sich
 * ihre eigene Logik im Repo, muss sie einmalig manuell per FTP hochgeladen
 * werden — alles, was sie danach kopiert, läuft wieder automatisch.
 */

// Namen/Muster, die NIE aus dem Zip überschrieben werden dürfen
const DEPLOY_EXCLUDE = [
    "README.md",
    ".gitignore",
    "LICENSE",
    ".git",
    ".github",
    "secrets.php",
    "secrets.php.example",
    "config.php",
];

function deploy_should_skip(string $relativePath): bool
{
    $firstSegment = explode("/", ltrim($relativePath, "/"))[0];
    return in_array($firstSegment, DEPLOY_EXCLUDE, true);
}

function deploy_copy_recursive(string $source, string $target): void
{
    $items = scandir($source);
    foreach ($items as $item) {
        if ($item === "." || $item === "..") {
            continue;
        }
        $srcPath = $source . "/" . $item;
        $dstPath = $target . "/" . $item;

        if (is_dir($srcPath)) {
            if (!is_dir($dstPath)) {
                mkdir($dstPath, 0755, true);
            }
            deploy_copy_recursive($srcPath, $dstPath);
        } else {
            copy($srcPath, $dstPath);
        }
    }
}

function run_deploy(): string
{
    if (!extension_loaded("curl") || !class_exists("ZipArchive")) {
        return "Fehler: curl- oder ZipArchive-Erweiterung fehlt auf diesem Server.";
    }

    $webroot = __DIR__;
    $tmpDir = sys_get_temp_dir() . "/deploy_" . uniqid();
    $zipPath = $tmpDir . "/repo.zip";
    mkdir($tmpDir, 0755, true);

    // 1. Zip vom aktuellen main-Branch laden
    $zipUrl = "https://codeload.github.com/" . GITHUB_REPO . "/zip/refs/heads/main";
    $ch = curl_init($zipUrl);
    $fp = fopen($zipPath, "w");
    curl_setopt_array($ch, [
        CURLOPT_FILE => $fp,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_USERAGENT => "vegan7-deploy-script",
    ]);
    $success = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    fclose($fp);

    if (!$success || $httpCode !== 200) {
        deploy_cleanup($tmpDir);
        return "Fehler beim Download: HTTP $httpCode $curlError";
    }

    // 2. Entpacken
    $zip = new ZipArchive();
    if ($zip->open($zipPath) !== true) {
        deploy_cleanup($tmpDir);
        return "Fehler: Zip konnte nicht geöffnet werden.";
    }
    $extractDir = $tmpDir . "/extracted";
    mkdir($extractDir, 0755, true);
    $zip->extractTo($extractDir);
    $zip->close();

    // GitHub packt alles in einen Unterordner "repo-main" o.ä.
    $entries = array_values(array_diff(scandir($extractDir), [".", ".."]));
    if (count($entries) !== 1 || !is_dir($extractDir . "/" . $entries[0])) {
        deploy_cleanup($tmpDir);
        return "Fehler: Unerwartete Zip-Struktur.";
    }
    $sourceRoot = $extractDir . "/" . $entries[0];

    // 3. Alles außer den Ausschlüssen kopieren
    $rootItems = array_values(array_diff(scandir($sourceRoot), [".", ".."]));
    foreach ($rootItems as $item) {
        if (deploy_should_skip($item)) {
            continue;
        }
        $srcPath = $sourceRoot . "/" . $item;
        $dstPath = $webroot . "/" . $item;
        if (is_dir($srcPath)) {
            if (!is_dir($dstPath)) {
                mkdir($dstPath, 0755, true);
            }
            deploy_copy_recursive($srcPath, $dstPath);
        } else {
            copy($srcPath, $dstPath);
        }
    }

    // 4. Aufräumen
    deploy_cleanup($tmpDir);

    return "Deploy erfolgreich: " . date("Y-m-d H:i:s");
}

function deploy_cleanup(string $dir): void
{
    if (!is_dir($dir)) {
        return;
    }
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($items as $item) {
        $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname());
    }
    rmdir($dir);
}
