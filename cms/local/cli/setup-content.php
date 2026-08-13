<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    throw new RuntimeException('This setup script is CLI-only.');
}

$_SERVER['DOCUMENT_ROOT'] = dirname(__DIR__, 2);

define('NO_KEEP_STATISTIC', true);
define('NO_AGENT_STATISTIC', true);
define('NOT_CHECK_PERMISSIONS', true);

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

use Bitrix\Main\Loader;

if (!Loader::includeModule('iblock')) {
    throw new RuntimeException('The iblock module is unavailable.');
}

function fail(string $message): never
{
    throw new RuntimeException($message);
}

function findIblockByCode(string $code): ?array
{
    $row = CIBlock::GetList([], ['CODE' => $code])->Fetch();
    return $row ?: null;
}

function ensureProperty(int $iblockId, string $code, string $name, int $sort): void
{
    $existing = CIBlockProperty::GetList(
        [],
        ['IBLOCK_ID' => $iblockId, 'CODE' => $code],
    )->Fetch();

    if ($existing) {
        return;
    }

    $property = new CIBlockProperty();
    $id = $property->Add([
        'IBLOCK_ID' => $iblockId,
        'ACTIVE' => 'Y',
        'SORT' => $sort,
        'NAME' => $name,
        'CODE' => $code,
        'PROPERTY_TYPE' => 'S',
        'MULTIPLE' => 'N',
    ]);

    if (!$id) {
        fail("Could not create property {$code}: {$property->LAST_ERROR}");
    }
}

$type = CIBlockType::GetByID('landing')->Fetch();
if (!$type) {
    $typeApi = new CIBlockType();
    if (!$typeApi->Add([
        'ID' => 'landing',
        'SECTIONS' => 'N',
        'IN_RSS' => 'N',
        'SORT' => 100,
        'LANG' => [
            'ru' => [
                'NAME' => 'Лендинг',
                'SECTION_NAME' => 'Разделы',
                'ELEMENT_NAME' => 'Контент',
            ],
        ],
    ])) {
        fail("Could not create iblock type: {$typeApi->LAST_ERROR}");
    }
}

$iblock = findIblockByCode('landing_home');
$iblockApi = new CIBlock();
$iblockFields = [
    'ACTIVE' => 'Y',
    'NAME' => 'Контент главной страницы',
    'CODE' => 'landing_home',
    'IBLOCK_TYPE_ID' => 'landing',
    'LID' => ['s1'],
    'SORT' => 100,
    'VERSION' => 1,
    'WORKFLOW' => 'N',
    'BIZPROC' => 'N',
    'GROUP_ID' => ['2' => 'R'],
];

$iblockId = $iblock
    ? (int) $iblock['ID']
    : (int) $iblockApi->Add($iblockFields);

if ($iblockId <= 0) {
    fail("Could not create landing iblock: {$iblockApi->LAST_ERROR}");
}

ensureProperty($iblockId, 'PHONE', 'Телефон', 100);
ensureProperty($iblockId, 'ADDRESS', 'Адрес', 200);

$element = CIBlockElement::GetList(
    [],
    ['IBLOCK_ID' => $iblockId, 'CODE' => 'home'],
    false,
    ['nTopCount' => 1],
    ['ID'],
)->Fetch();

$elementApi = new CIBlockElement();
$elementFields = [
    'IBLOCK_ID' => $iblockId,
    'ACTIVE' => 'Y',
    'NAME' => 'Пейнтбол в Саратове',
    'CODE' => 'home',
    'PREVIEW_TEXT' => 'Тестовый текст из Bitrix',
    'PREVIEW_TEXT_TYPE' => 'text',
];

$elementId = $element
    ? (int) $element['ID']
    : (int) $elementApi->Add($elementFields);

if ($elementId <= 0) {
    fail("Could not create home content: {$elementApi->LAST_ERROR}");
}

if ($element) {
    if (!$elementApi->Update($elementId, $elementFields)) {
        fail("Could not update home content: {$elementApi->LAST_ERROR}");
    }
}

CIBlockElement::SetPropertyValuesEx(
    $elementId,
    $iblockId,
    [
        'PHONE' => '+7 000 000-00-00',
        'ADDRESS' => 'Саратов',
    ],
);

echo json_encode(
    ['status' => 'ok', 'elementId' => $elementId],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR,
), PHP_EOL;
