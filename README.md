# ArbiHunter 

ArbiHunter on Reactilla ja PHP:lla rakennettu työkalu, joka etsii automaattisesti urheiluvedonlyönnin arbitraasitilanteita (Surebets) The Odds API -rajapintaa hyödyntäen.

Tämä dokumentti selittää, mihin sovelluksen tunnistama "Tuotto %" ja panoslaskurin (Calculator Modal) matematiikka perustuvat.

---

## 1. Mitä on arbitraasivedonlyönti?

Vedonvälittäjät asettavat kertoimiinsa aina marginaalin (ns. talon edun). Joskus eri vedonvälittäjien näkemykset ottelun lopputuloksesta kuitenkin eroavat toisistaan niin paljon, että vedonlyöjä voi lyödä vetoa **kaikista mahdollisista lopputuloksista eri sivustoilla ja jäädä varmasti voitolle** ottelun tuloksesta riippumatta. 

Tätä kutsutaan arbitraasiksi.

---

## 2. Milloin arbitraasi syntyy? (Tunnistaminen)

Arbitraasi on olemassa, kun kaikkien mahdollisten lopputulosten todennäköisyyksien summa (kertoimista laskettuna) on **alle 1** (eli alle 100%).

Käytämme kertoimia $K_A$ (Joukkue A) ja $K_B$ (Joukkue B). Marginaali ($M$) lasketaan kaavalla:

$$M = \frac{1}{K_A} + \frac{1}{K_B}$$

* Jos $M > 1$: Vedonvälittäjällä on etu (Normaali tilanne).
* Jos $M = 1$: Markkina on 100% tehokas (Ei etua kummallakaan).
* **Jos $M < 1$: Arbitraasi on olemassa!**

### Esimerkki:
* Pinnacle tarjoaa kertoimen **2.15** Pelaajalle A.
* Unibet tarjoaa kertoimen **2.10** Pelaajalle B.

$$M = \frac{1}{2.15} + \frac{1}{2.10} = 0.4651 + 0.4761 = 0.9412$$

Koska $0.9412 < 1$, olemme löytäneet arbitraasin! Odotettu tuottoprosentti on noin **5.88%**.

---

## 3. Panosten jakaminen (Laskurin matematiikka)

Jotta arbitraasista saa riskittömän voiton, kokonaispanos (esim. **100€**) täytyy jakaa kertoimien suhteessa niin, että molemmat lopputulokset palauttavat tismalleen saman summan.

Käytämme seuraavaa kaavaa yksittäisen panoksen ($S_A$) laskemiseen, kun kokonaispanos on $S_{total}$:

$$S_A = \frac{1/K_A}{1/K_A + 1/K_B} \times S_{total}$$

### Lasketaan panokset esimerkin kertoimille (Kokonaispanos 100€):

**Veto A (Kerroin 2.15):**
$$S_A = \frac{1/2.15}{0.9412} \times 100 = 49.41 €$$

**Veto B (Kerroin 2.10):**
$$S_B = \frac{1/2.10}{0.9412} \times 100 = 50.59 €$$

### Tarkistus (Palautus):
Riippumatta siitä kumpi voittaa, saat saman palautuksen:
* Jos A voittaa: **49.41€** $\times$ **2.15** = **106.23€**
* Jos B voittaa: **50.59€** $\times$ **2.10** = **106.23€**

Sijoitit 100€ ja saat varmasti takaisin 106.23€. Nettovoittosi on riskittömästi **6.23€**. ArbiHunterin laskuri tekee tämän matematiikan automaattisesti sekunnin murto-osassa.