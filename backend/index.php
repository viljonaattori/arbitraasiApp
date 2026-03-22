<?php
// Sallitaan pyynnöt muista osoitteista (esim. meidän tulevasta frontendistä)
header('Access-Control-Allow-Origin: *');
// Kerrotaan selaimelle, että palautamme JSON-muotoista dataa
header('Content-Type: application/json');

// Testidata, joka simuloi arbitraasikohdetta
$testData = [
    "status" => "success",
    "message" => "Arbitraasi-backend hyrrää nätisti Dockerissa!",
    "timestamp" => time()
];

// Muutetaan PHP-taulukko JSON-muotoon ja tulostetaan se
echo json_encode($testData);