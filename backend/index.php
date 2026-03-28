<?php
// Sallitaan CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'src/Calculator.php';
require_once 'src/DataService.php';

use App\Calculator;
use App\DataService;

$rawMatches = DataService::fetchOdds();
$results = [];

foreach ($rawMatches as $match) {
    if (!isset($match['bookmakers'])) continue;
    
    $team1Name = null;
    $team2Name = null;
    $oddsA = [];
    $oddsB = [];

    // 1. Kerätään kaikki maailman kertoimet talteen bookkereittain tästä matsista
    foreach ($match['bookmakers'] as $bookie) {
        $bookieName = $bookie['title'];
        
        // Varmistetaan että on 2-suuntainen veto
        if (!isset($bookie['markets'][0]['outcomes']) || count($bookie['markets'][0]['outcomes']) !== 2) continue;
        
        $outcomes = $bookie['markets'][0]['outcomes'];
        
        // Asetetaan joukkueiden nimet ensimmäisestä vastaantulevasta bookkerista
        if (!$team1Name) {
            $team1Name = $outcomes[0]['name'];
            $team2Name = $outcomes[1]['name'];
        }

        // Jaotellaan kertoimet omille listoilleen joukkueen mukaan
        if ($outcomes[0]['name'] === $team1Name) {
            $oddsA[] = ['price' => $outcomes[0]['price'], 'bookie' => $bookieName];
            $oddsB[] = ['price' => $outcomes[1]['price'], 'bookie' => $bookieName];
        } else {
            $oddsA[] = ['price' => $outcomes[1]['price'], 'bookie' => $bookieName];
            $oddsB[] = ['price' => $outcomes[0]['price'], 'bookie' => $bookieName];
        }
    }

    // 2. MATEMATIIKKA: Etsitään PARAS ristiinpelattava pari (Vain ERI bookkerit)
    $bestMargin = 999;
    $bestPair = null;

    // Käydään kaikki Joukkue A:n kertoimet läpi ristiin Joukkue B:n kertoimien kanssa
    foreach ($oddsA as $a) {
        foreach ($oddsB as $b) {
            
            // TÄMÄ ON SE TAIKA: Jos kyseessä on sama lafka, unohdetaan koko homma!
            if ($a['bookie'] === $b['bookie']) continue;

            $margin = Calculator::calculateMargin([$a['price'], $b['price']]);
            
            // Jos tämä ristiinpelattu pari on parempi kuin aiemmat, otetaan se talteen
            if ($margin < $bestMargin) {
                $bestMargin = $margin;
                $bestPair = [
                    'bookieA' => $a['bookie'] . " (" . $team1Name . "@" . $a['price'] . ")",
                    'bookieB' => $b['bookie'] . " (" . $team2Name . "@" . $b['price'] . ")"
                ];
            }
        }
    }

    // 3. Jos löydettiin pätevä ristiinpari ja marginaali on edes lähellä nollaa (testimielessä < 1.03)
    if ($bestPair && $bestMargin < 1.03) {
        $profit = Calculator::calculateProfit($bestMargin);
        
        $results[] = [
            "id" => $match['id'],
            "event" => $match['sport_title'] . ": " . $team1Name . " - " . $team2Name,
            "profit" => $profit,
            "bookieA" => $bestPair['bookieA'],
            "bookieB" => $bestPair['bookieB'],
            "time" => date("H:i", strtotime($match['commence_time']))
        ];
    }
}

// Järjestetään tulokset niin, että paras tuotto on ylimpänä
usort($results, function($a, $b) {
    return $b['profit'] <=> $a['profit'];
});

echo json_encode($results);