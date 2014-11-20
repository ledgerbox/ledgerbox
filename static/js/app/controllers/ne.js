var app = angular.module('app');



app.controller('neCtrl', function ($scope, $manager, $log, $http, $location, $util, $user) {
    $log.info("init neCtrl");
      
   var bas = [{ "sru": "7200", "rad": "B1", "radText": "Immateriella anläggningstillgångar", "konto": "1000", "text": "Immateriella anläggningstillgångar", "typ": "Anläggningstillgångar" },
{ "sru": "7210", "rad": "B2", "radText": "Byggnader och markanläggningar", "konto": "1110", "text": "Byggnader", "typ": "Anläggningstillgångar" },
{ "sru": "7210", "rad": "B2", "radText": "Byggnader och markanläggningar", "konto": "1150", "text": "Markanläggningar", "typ": "Anläggningstillgångar" },
{ "sru": "7211", "rad": "B3", "radText": "Mark och andra tillgångar som inte får skrivas av", "konto": "1130", "text": "Mark", "typ": "Anläggningstillgångar" },
{ "sru": "7211", "rad": "B3", "radText": "Mark och andra tillgångar som inte får skrivas av", "konto": "1180", "text": "Pågående nyanläggningar och förskott för byggnader och mark", "typ": "Anläggningstillgångar" },
{ "sru": "7212", "rad": "B4", "radText": "Maskiner och inventarier", "konto": "1220", "text": "Maskiner och inventarier", "typ": "Anläggningstillgångar" },
{ "sru": "7212", "rad": "B4", "radText": "Maskiner och inventarier", "konto": "1230", "text": "Byggnads- och markinventarier", "typ": "Anläggningstillgångar" },
{ "sru": "7212", "rad": "B4", "radText": "Maskiner och inventarier", "konto": "1240", "text": "Bilar och andra transportmedel", "typ": "Anläggningstillgångar" },
{ "sru": "7213", "rad": "B5", "radText": "Övriga anläggningstillgångar", "konto": "1300", "text": "Andelar", "typ": "Anläggningstillgångar" },


{ "sru": "7240", "rad": "B6", "radText": "Varulager", "konto": "1400", "text": "Varulager", "typ": "Omsättningstillgångar" },
{ "sru": "7250", "rad": "B7", "radText": "Kundfordringar", "konto": "1500", "text": "Kundfordringar", "typ": "Omsättningstillgångar" },
{ "sru": "7260", "rad": "B8", "radText": "Övriga fordringar ", "konto": "1600", "text": "Övriga fordringar", "typ": "Omsättningstillgångar" },
{ "sru": "7260", "rad": "B8", "radText": "Övriga fordringar ", "konto": "1650", "text": "Momsfordran", "typ": "Omsättningstillgångar" },
{ "sru": "7260", "rad": "B8", "radText": "Övriga fordringar ", "konto": "1700", "text": "Förskott till leverantörer", "typ": "Omsättningstillgångar" },
{ "sru": "7280", "rad": "B9", "radText": "Kassa och bank", "konto": "1910", "text": "Kassa", "typ": "Omsättningstillgångar" },
{ "sru": "7280", "rad": "B9", "radText": "Kassa och bank", "konto": "1920", "text": "PlusGiro", "typ": "Omsättningstillgångar" },
{ "sru": "7280", "rad": "B9", "radText": "Kassa och bank", "konto": "1930", "text": "Företagskonto/checkkonto/affärskonto", "typ": "Omsättningstillgångar" },
{ "sru": "7280", "rad": "B9", "radText": "Kassa och bank", "konto": "1940", "text": "Övriga bankkonton", "typ": "Omsättningstillgångar" },
{ "sru": "7280", "rad": "B9", "radText": "Kassa och bank", "konto": "1970", "text": "Särskilda bankkonton", "typ": "Omsättningstillgångar" },
{ "sru": "7280", "rad": "B9", "radText": "Kassa och bank", "konto": "1970", "text": "Särskilda bankkonton", "typ": "Omsättningstillgångar" },

{ "sru": "7300", "rad": "B10", "radText": "Eget kapital", "konto": "2010", "text": "Eget kapital, delägare 1", "typ": "Eget kapital" },
{ "sru": "7300", "rad": "B10", "radText": "Eget kapital", "konto": "2020–2040", "text": "Eget kapital, delägare 2–4", "typ": "Eget kapital" },


{ "sru": "7380", "rad": "B13", "radText": "Låneskulder", "konto": "2330", "text": "Checkräkningskredit", "typ": "Skulder" },
{ "sru": "7380", "rad": "B13", "radText": "Låneskulder", "konto": "2350", "text": "Skulder till kreditinstitut", "typ": "Skulder" },
{ "sru": "7380", "rad": "B13", "radText": "Låneskulder", "konto": "2390", "text": "Övriga låneskulder", "typ": "Skulder" },
{ "sru": "7381", "rad": "B14", "radText": "Skatteskulder", "konto": "2610", "text": "Utgående moms, oreducerad", "typ": "Skulder" },
{ "sru": "7381", "rad": "B14", "radText": "Skatteskulder", "konto": "2620", "text": "Utgående moms, reducerad 1", "typ": "Skulder" },
{ "sru": "7381", "rad": "B14", "radText": "Skatteskulder", "konto": "2630", "text": "Utgående moms, reducerad 2", "typ": "Skulder" },
{ "sru": "7381", "rad": "B14", "radText": "Skatteskulder", "konto": "2640", "text": "Ingående moms", "typ": "Skulder" },
{ "sru": "7381", "rad": "B14", "radText": "Skatteskulder", "konto": "2650", "text": "Redovisningskonto för moms", "typ": "Skulder" },
{ "sru": "7381", "rad": "B14", "radText": "Skatteskulder", "konto": "2660", "text": "Särskilda punktskatter", "typ": "Skulder" },
{ "sru": "7381", "rad": "B14", "radText": "Skatteskulder", "konto": "2710", "text": "Personalskatt", "typ": "Skulder" },
{ "sru": "7381", "rad": "B14", "radText": "Skatteskulder", "konto": "2730", "text": "Lagstadgade/avtalade sociala avgifter och särskild löneskatt", "typ": "Skulder" },
{ "sru": "7382", "rad": "B15", "radText": "Leverantörsskulder", "konto": "2440", "text": "Leverantörsskulder", "typ": "Skulder" },
{ "sru": "7383", "rad": "B16", "radText": "Övriga skulder", "konto": "2900", "text": "Övriga skulder", "typ": "Skulder" },




{ "sru": "7400", "rad": "R1", "radText": "Försäljning och utfört arbete samt övriga momspliktiga intäkter", "konto": "3000", "text": "Försäljning och utfört arbete samt övriga momspliktiga inkomster", "typ": "Intäkter" },
{ "sru": "7400", "rad": "R1", "radText": "Försäljning och utfört arbete samt övriga momspliktiga intäkter", "konto": "3500", "text": "Fakturerade kostnader", "typ": "Intäkter" },
{ "sru": "7400", "rad": "R1", "radText": "Försäljning och utfört arbete samt övriga momspliktiga intäkter", "konto": "3700", "text": "Lämnade rabatter, bonusar etc. R1/R2", "typ": "Intäkter" },
{ 'sru': '7400', 'rad': 'R1', 'radText': 'Försäljning och utfört arbete samt övriga momspliktiga intäkter', 'konto': '3900', 'text': 'Övriga rörelseintäkter R1/R2', 'typ': 'Intäkter' },
{ "sru": "7401", "rad": "R2 ", "radText": "Momsfria intäkter", "konto": "3100", "text": "Momsfria intäkter", "typ": "Intäkter" },
{ "sru": "7401", "rad": "R2 ", "radText": "Momsfria intäkter", "konto": "3700", "text": "Lämnade rabatter, bonusar etc. R1/R2", "typ": "Intäkter" },
{ "sru": "7401", "rad": "R2 ", "radText": "Momsfria intäkter", "konto": "3900", "text": "Övriga rörelseintäkter R1/R2", "typ": "Intäkter" },
{ "sru": "7401", "rad": "R2 ", "radText": "Momsfria intäkter", "konto": "3970", "text": "Vinst vid avyttring av immateriella och materiella anläggningstillgångar", "typ": "Intäkter" },
{ "sru": "7401", "rad": "R2 ", "radText": "Momsfria intäkter", "konto": "3980", "text": "Erhållna bidrag", "typ": "Intäkter" },
{ "sru": "7402", "rad": "R3 ", "radText": "Bil- och bostadsförmån m.m.", "konto": "3200", "text": "Bil- och bostadsförmån m.m.", "typ": "Intäkter" },
{ "sru": "7403", "rad": "R4 ", "radText": "Ränteintäkter m.m.", "konto": "8310", "text": "Ränteintäkter och utdelningar", "typ": "Intäkter" },
{ "sru": "7403", "rad": "R4 ", "radText": "Ränteintäkter m.m.", "konto": "8330", "text": "Valutakursdifferenser på fordringar och placeringar", "typ": "Intäkter" },


{ "sru": "7500", "rad": "R5", "radText": "Varor, material och tjänster", "konto": "4000", "text": "Varor", "typ": "Kostnader" },
{ "sru": "7500", "rad": "R5", "radText": "Varor, material och tjänster", "konto": "4600", "text": "Legoarbeten och underentreprenader", "typ": "Kostnader" },
{ "sru": "7500", "rad": "R5", "radText": "Varor, material och tjänster", "konto": "4700", "text": "Erhållna rabatter, bonus etc.", "typ": "Kostnader" },
{ "sru": "7500", "rad": "R5", "radText": "Varor, material och tjänster", "konto": "4900", "text": "Förändring av lager", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5000", "text": "Lokalkostnader", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5100", "text": "Fastighetskostnader", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5200", "text": "Hyra av anläggningstillgångar", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5400", "text": "Förbrukningsinventarier och förbruk ningsmaterial", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5500", "text": "Reparation och underhåll", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5600", "text": "Kostnader för transportmedel", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5610", "text": "Personbilskostnader", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5620", "text": "Lastbilskostnader", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5700", "text": "Frakter och transporter", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5800", "text": "Resekostnader", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "5900", "text": "Reklam och PR", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6000", "text": "Övriga försäljningskostnader", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6070", "text": "Representation", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6100", "text": "Kontorsmateriel och trycksaker", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6200", "text": "Tele och post", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6300", "text": "Företagsförsäkringar", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6310", "text": "Företagsförsäkringar och övriga riskkostnader", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6500", "text": "Övriga externa tjänster", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6800", "text": "Inhyrd personal", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6900", "text": "Övriga kostnader", "typ": "Kostnader" },
{ "sru": "7501", "rad": "R6", "radText": "Övriga externa kostnader", "konto": "6980", "text": "Föreningsavgifter", "typ": "Kostnader" },
{ "sru": "7502", "rad": "R7", "radText": "Anställd personal", "konto": "7000", "text": "Löner till anställda", "typ": "Kostnader" },
{ "sru": "7502", "rad": "R7", "radText": "Anställd personal", "konto": "7300", "text": "Kostnadsersättningar och förmåner", "typ": "Kostnader" },
{ "sru": "7502", "rad": "R7", "radText": "Anställd personal", "konto": "7400", "text": "Pensionskostnader", "typ": "Kostnader" },
{ "sru": "7502", "rad": "R7", "radText": "Anställd personal", "konto": "7500", "text": "Sociala och andra avgifter enligt lag och avtal", "typ": "Kostnader" },
{ "sru": "7502", "rad": "R7", "radText": "Anställd personal", "konto": "7600", "text": "Övriga personalkostnader", "typ": "Kostnader" },
{ "sru": "7503", "rad": "R8", "radText": "Räntekostnader m.m.", "konto": "8410", "text": "Räntekostnader för skulder", "typ": "Kostnader" },
{ "sru": "7503", "rad": "R8", "radText": "Räntekostnader m.m.", "konto": "8430", "text": "Valutakursdifferenser på skulder", "typ": "Kostnader" },

{ "sru": "7504", "rad": "R9", "radText": "Avskrivningar och nedskrivningar byggnader och markanläggningar", "konto": "7700", "text": "Nedskrivningar R9/R10", "typ": "Avskrivningar" },
{ "sru": "7504", "rad": "R9", "radText": "", "konto": "7820", "text": "Avskrivningar på byggnader och markanläggningar", "typ": "Avskrivningar" },
{ "sru": "7504", "rad": "R9", "radText": "", "konto": "7980", "text": "Ersättningsfonder R9/R10", "typ": "Avskrivningar" },
{ "sru": "7505", "rad": "R10", "radText": "Avskrivningar och nedskrivningar maskiner och inventarier och immateriella tillgångar", "konto": "7810", "text": "Avskrivningar på immateriella anläggningstillgångar", "typ": "Avskrivningar" },
{ "sru": "7505", "rad": "R10", "radText": "Avskrivningar och nedskrivningar maskiner och inventarier och immateriella tillgångar", "konto": "7830", "text": "Avskrivningar på maskiner och inventarier", "typ": "Avskrivningar" },
{ "sru": "7505", "rad": "R10", "radText": "Avskrivningar och nedskrivningar maskiner och inventarier och immateriella tillgångar", "konto": "7980", "text": "Ersättningsfonder R9/R10", "typ": "Avskrivningar" },


{ "sru": "7440", "rad": "R11", "radText": "Bokfört resultat ", "konto": "8990", "text": "Resultat", "typ": "Årets resultat" }]


   var sruMap = {}
    _.each($user.getVer(), function(v){
        _.each(v.poster, function(a){
            var sru =  _.findWhere(bas, {  konto : a.kontonr });
            if(sru) {
                if(!sru.saldo){
                    sru.saldo = 0;
                }
                sru.saldo += Math.abs(a.belopp);
            }
        });
    });
    $scope.b1 = _.uniq(_.where(bas, { typ: "Anläggningstillgångar" }), function (item) {
        return item.rad;
    });
    $scope.b6 =  _.uniq(_.where(bas, { typ: "Omsättningstillgångar" }), function (item) {
        return item.rad;
    });
    $scope.b10 =  _.uniq(_.where(bas, { typ: "Eget kapital" }), function (item) {
        return item.rad;
    });;
    $scope.b13 =  _.uniq(_.where(bas, { typ: "Skulder" }), function (item) {
        return item.rad;
    });
    $scope.r1 =  _.uniq(_.where(bas, { typ: "Intäkter" }), function (item) {
        return item.rad;
    });
    $scope.r5 =  _.uniq(_.where(bas, { typ: "Kostnader" }), function (item) {
        return item.rad;
    });
    $scope.r9 =  _.uniq(_.where(bas, { typ: "Avskrivningar" }), function (item) {
        return item.rad;
    });
    $scope.r11 = _.uniq(_.where(bas, { typ: "Årets resultat" }), function (item) {
        return item.rad;
    });


    
     
});

