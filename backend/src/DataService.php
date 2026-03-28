<?php
namespace App;

class DataService {
    public static function fetchOdds(): array {
        // Haetaan avain
        $apiKey = $_ENV['APIKEY'] ?? $_SERVER['APIKEY'] ?? getenv('APIKEY');

        if (!$apiKey) {
            die(json_encode(["DEBUG_ERROR" => "API-avainta (APIKEY) ei löydy Dockerista!"]));
        }

        $url = "https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=" . $apiKey . "&regions=eu&markets=h2h";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            die(json_encode([
                "DEBUG_ERROR" => "API vastasi virheellä", 
                "http_code" => $httpCode, 
                "response" => json_decode($response)
            ]));
        }

        return json_decode($response, true) ?: [];
    }
}