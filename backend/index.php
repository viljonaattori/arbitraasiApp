<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once 'src/Calculator.php';
use App\Calculator;

// Simuloitu raakadata (tämä voisi tulla tietokannasta tai APIsta)
$games = [
    ["id" => 1, "event" => "ManU - Liverpool", "k1" => 2.15, "k2" => 1.95, "b1" => "Unibet", "b2" => "Pinnacle"],
    ["id" => 2, "event" => "Lakers - Celtics", "k1" => 2.20, "k2" => 1.90, "b1" => "GGBet", "b2" => "Pinnacle"],
        ["id" => 1, "event" => "ManU - Liverpool", "k1" => 2.15, "k2" => 1.95, "b1" => "Unibet", "b2" => "Pinnacle"],
    ["id" => 2, "event" => "Lakers - Celtics", "k1" => 2.20, "k2" => 1.90, "b1" => "GGBet", "b2" => "Pinnacle"],
        ["id" => 1, "event" => "ManU - Liverpool", "k1" => 2.15, "k2" => 1.95, "b1" => "Unibet", "b2" => "Pinnacle"],
    ["id" => 2, "event" => "Lakers - Celtics", "k1" => 2.20, "k2" => 1.90, "b1" => "GGBet", "b2" => "Pinnacle"],
        ["id" => 1, "event" => "ManU - Liverpool", "k1" => 2.15, "k2" => 1.95, "b1" => "Unibet", "b2" => "Pinnacle"],
    ["id" => 2, "event" => "Lakers - Celtics", "k1" => 2.20, "k2" => 1.90, "b1" => "GGBet", "b2" => "Pinnacle"],
];

$results = [];

foreach ($games as $game) {
    $margin = Calculator::calculateMargin([$game['k1'], $game['k2']]);

    if ($margin < 1) {
        $results[] = [
            "id" => $game['id'],
            "event" => $game['event'],
            "profit" => Calculator::calculateProfit($margin),
            "bookieA" => $game['b1'] . " (" . $game['k1'] . ")",
            "bookieB" => $game['b2'] . " (" . $game['k2'] . ")",
            "time" => date("H:i")
        ];
    }
}

echo json_encode($results);