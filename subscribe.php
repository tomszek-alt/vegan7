<?php
/**
 * subscribe.php — Newsletter-Anmeldung über die Brevo API (v3)
 *
 * WICHTIG: Trage deinen Brevo API-Key unten bei BREVO_API_KEY ein.
 * Den Key findest du in Brevo unter: Einstellungen > SMTP & API > API-Keys.
 * Trage außerdem deine Brevo-Listen-ID bei BREVO_LIST_ID ein
 * (Kontakte > Listen > gewünschte Liste anklicken, ID steht in der URL).
 *
 * Der Key bleibt serverseitig und wird NIE an den Browser ausgeliefert.
 */

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");

// --- Konfiguration -----------------------------------------------------
// BREVO_API_KEY und BREVO_LIST_ID kommen aus secrets.php (nicht im Git-Repo,
// bleibt nur auf dem Server — siehe secrets.php.example für die Vorlage).
require_once __DIR__ . "/secrets.php";
define("BREVO_API_URL", "https://api.brevo.com/v3/contacts");
define("ALLOWED_ORIGIN", "https://vegan7.de");
// -------------------------------------------------------------------------

// Nur POST-Anfragen erlauben
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Methode nicht erlaubt."]);
    exit;
}

// Einfache CORS-Absicherung (nur eigene Domain)
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
if ($origin && $origin !== ALLOWED_ORIGIN && strpos($origin, "vegan7.de") === false) {
    http_response_code(403);
    echo json_encode(["error" => "Nicht erlaubt."]);
    exit;
}

$raw = file_get_contents("php://input");
$body = json_decode($raw, true);
$email = isset($body["email"]) ? trim($body["email"]) : "";

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(["error" => "Bitte eine gültige E-Mail-Adresse angeben."]);
    exit;
}

if (!defined("BREVO_API_KEY") || BREVO_API_KEY === "TRAGE_HIER_DEINEN_BREVO_API_KEY_EIN") {
    http_response_code(500);
    echo json_encode(["error" => "Newsletter-Anmeldung ist noch nicht konfiguriert."]);
    exit;
}

$payload = [
    "email" => $email,
    "listIds" => [(int) BREVO_LIST_ID],
    "updateEnabled" => true,
];

$ch = curl_init(BREVO_API_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Accept: application/json",
        "Content-Type: application/json",
        "api-key: " . BREVO_API_KEY,
    ],
    CURLOPT_TIMEOUT => 10,
]);

$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(["error" => "Verbindung zu Brevo fehlgeschlagen."]);
    exit;
}

// 201 = neu angelegt, 204 = bereits vorhanden/aktualisiert -> beides als Erfolg werten
if ($statusCode === 201 || $statusCode === 204) {
    echo json_encode(["success" => true]);
    exit;
}

// Kontakt existiert bereits (400 mit duplicate_parameter) -> ebenfalls als Erfolg werten
$decoded = json_decode($response, true);
if ($statusCode === 400 && isset($decoded["code"]) && $decoded["code"] === "duplicate_parameter") {
    echo json_encode(["success" => true]);
    exit;
}

http_response_code(500);
echo json_encode(["error" => "Anmeldung fehlgeschlagen. Bitte später erneut versuchen."]);
