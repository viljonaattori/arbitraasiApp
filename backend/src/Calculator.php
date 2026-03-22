<?php
namespace App;

class Calculator {
    public static function calculateMargin(array $odds): float {
        $sum = 0;
        foreach ($odds as $odd) {
            $sum += (1 / $odd);
        }
        return $sum;
    }

    public static function calculateProfit(float $margin): float {
        return round((1 - $margin) * 100, 2);
    }
}