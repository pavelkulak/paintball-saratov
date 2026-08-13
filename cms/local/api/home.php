<?php

declare(strict_types=1);

define('NO_KEEP_STATISTIC', true);
define('NO_AGENT_STATISTIC', true);
define('NOT_CHECK_PERMISSIONS', true);

if (empty($_SERVER['DOCUMENT_ROOT'])) {
    $_SERVER['DOCUMENT_ROOT'] = dirname(__DIR__, 2);
}

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

use Bitrix\Main\Loader;
use Bitrix\Main\Web\Json;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo Json::encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (!Loader::includeModule('iblock')) {
    respond(['error' => 'Content storage is unavailable.'], 503);
}

$iblock = CIBlock::GetList([], ['CODE' => 'landing_home', 'ACTIVE' => 'Y'])->Fetch();
if (!$iblock) {
    respond(['error' => 'Home content is not configured.'], 503);
}

$element = CIBlockElement::GetList(
    [],
    [
        'IBLOCK_ID' => (int) $iblock['ID'],
        'CODE' => 'home',
        'ACTIVE' => 'Y',
    ],
    false,
    ['nTopCount' => 1],
    ['ID', 'NAME', 'PREVIEW_TEXT'],
)->Fetch();

if (!$element) {
    respond(['error' => 'Home content is empty.'], 503);
}

$properties = [];
$propertyRows = CIBlockElement::GetProperty(
    (int) $iblock['ID'],
    (int) $element['ID'],
    ['sort' => 'asc'],
    ['CODE' => ['PHONE', 'ADDRESS']],
);
while ($property = $propertyRows->Fetch()) {
    $properties[(string) $property['CODE']] = (string) $property['VALUE'];
}

respond([
    'title' => (string) $element['NAME'],
    'description' => (string) $element['PREVIEW_TEXT'],
    'phone' => $properties['PHONE'] ?? '',
    'address' => $properties['ADDRESS'] ?? '',
]);
