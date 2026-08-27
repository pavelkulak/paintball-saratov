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

function publicAssetUrl(string $path): string
{
    if (preg_match('#^https?://#i', $path) === 1) {
        return $path;
    }

    $host = (string) ($_SERVER['HTTP_HOST'] ?? '');
    if ($host === '') {
        throw new RuntimeException('The public host is unavailable.');
    }

    $isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    return ($isHttps ? 'https://' : 'http://') . $host . '/' . ltrim($path, '/');
}

function plainReviewText(string $text, string $type): string
{
    if ($type === 'html') {
        $text = preg_replace('#<br\s*/?>#i', "\n", $text) ?? $text;
        $text = strip_tags($text);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    return trim(str_replace(["\r\n", "\r"], "\n", $text));
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
);
while ($property = $propertyRows->Fetch()) {
    $code = (string) $property['CODE'];
    if (in_array($code, ['PHONE', 'ADDRESS'], true)) {
        $properties[$code] = (string) $property['VALUE'];
    }
}

$quiz = [];
$quizIblock = CIBlock::GetList([], ['CODE' => 'landing_quiz', 'ACTIVE' => 'Y'])->Fetch();

if ($quizIblock) {
    $quizRows = CIBlockElement::GetList(
        ['SORT' => 'ASC', 'ID' => 'ASC'],
        [
            'IBLOCK_ID' => (int) $quizIblock['ID'],
            'ACTIVE' => 'Y',
        ],
        false,
        false,
        ['ID', 'CODE', 'PREVIEW_TEXT'],
    );

    while ($quizRow = $quizRows->Fetch()) {
        $quizProperties = [];
        $quizPropertyRows = CIBlockElement::GetProperty(
            (int) $quizIblock['ID'],
            (int) $quizRow['ID'],
            ['sort' => 'asc'],
        );

        while ($quizProperty = $quizPropertyRows->Fetch()) {
            $code = (string) $quizProperty['CODE'];
            if (in_array($code, ['STEP', 'ANSWERS_JSON'], true)) {
                $quizProperties[$code] = (string) $quizProperty['VALUE'];
            }
        }

        try {
            $answers = Json::decode($quizProperties['ANSWERS_JSON'] ?? '');
        } catch (Throwable) {
            respond(['error' => 'Quiz content contains invalid answers.'], 503);
        }

        if (!is_array($answers) || !$answers) {
            respond(['error' => 'Quiz content is invalid.'], 503);
        }

        $quiz[] = [
            'step' => (int) ($quizProperties['STEP'] ?? 0),
            'id' => (string) ($quizRow['CODE'] ?: $quizRow['ID']),
            'question' => (string) $quizRow['PREVIEW_TEXT'],
            'answers' => $answers,
        ];
    }
}

usort(
    $quiz,
    static fn (array $left, array $right): int => $left['step'] <=> $right['step'],
);

$quiz = array_map(
    static fn (array $question): array => [
        'id' => $question['id'],
        'question' => $question['question'],
        'answers' => $question['answers'],
    ],
    $quiz,
);

if (!$quiz) {
    respond(['error' => 'Quiz content is empty.'], 503);
}

$reviews = [];
$reviewsIblock = CIBlock::GetList([], ['CODE' => 'landing_reviews', 'ACTIVE' => 'Y'])->Fetch();

if ($reviewsIblock) {
    $reviewRows = CIBlockElement::GetList(
        ['SORT' => 'ASC', 'ACTIVE_FROM' => 'DESC', 'ID' => 'DESC'],
        [
            'IBLOCK_ID' => (int) $reviewsIblock['ID'],
            'ACTIVE' => 'Y',
            'ACTIVE_DATE' => 'Y',
        ],
        false,
        false,
        [
            'ID',
            'CODE',
            'NAME',
            'PREVIEW_PICTURE',
            'DETAIL_TEXT',
            'DETAIL_TEXT_TYPE',
            'ACTIVE_FROM',
            'DATE_CREATE',
        ],
    );

    while ($reviewRow = $reviewRows->Fetch()) {
        $rating = null;
        $reviewPropertyRows = CIBlockElement::GetProperty(
            (int) $reviewsIblock['ID'],
            (int) $reviewRow['ID'],
            ['sort' => 'asc'],
            ['CODE' => 'RATING'],
        );

        if ($ratingProperty = $reviewPropertyRows->Fetch()) {
            $rating = filter_var(
                $ratingProperty['VALUE'],
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1, 'max_range' => 5]],
            );
        }

        $name = trim((string) $reviewRow['NAME']);
        $text = plainReviewText(
            (string) $reviewRow['DETAIL_TEXT'],
            (string) $reviewRow['DETAIL_TEXT_TYPE'],
        );
        $dateSource = (string) ($reviewRow['ACTIVE_FROM'] ?: $reviewRow['DATE_CREATE']);
        $dateTimestamp = MakeTimeStamp($dateSource);

        if ($name === '' || $text === '' || $rating === false || $rating === null || !$dateTimestamp) {
            respond(['error' => 'Review content is invalid.'], 503);
        }

        $avatarUrl = null;
        if ((int) $reviewRow['PREVIEW_PICTURE'] > 0) {
            $avatar = CFile::GetFileArray((int) $reviewRow['PREVIEW_PICTURE']);
            if (is_array($avatar) && !empty($avatar['SRC'])) {
                $avatarUrl = publicAssetUrl((string) $avatar['SRC']);
            }
        }

        $reviews[] = [
            'id' => (string) ($reviewRow['CODE'] ?: $reviewRow['ID']),
            'name' => $name,
            'avatarUrl' => $avatarUrl,
            'rating' => $rating,
            'publishedAt' => date('Y-m-d', $dateTimestamp),
            'text' => $text,
        ];
    }
}

respond([
    'title' => (string) $element['NAME'],
    'description' => (string) $element['PREVIEW_TEXT'],
    'phone' => $properties['PHONE'] ?? '',
    'address' => $properties['ADDRESS'] ?? '',
    'quiz' => [
        'total' => count($quiz),
        'questions' => $quiz,
    ],
    'reviews' => $reviews,
]);
