var app = angular.module('app');



app.service('$mobile', function ($http, $filter, $util, $q, $user, $log, parserService, dbService) {
    var self = this;

    this.kassakonton = [{ 'konto': '1941', 'text': 'Plusgiro' },
                    { 'konto': '1940', 'text': 'Bankgiro' },
                    { 'konto': '1960', 'text': 'Kassa' },
                    { 'konto': '2160', 'text': 'Eget utlägg' }];

    this.intyp = [{ "kontotext": "Försäljning", "konto": "3010" },
                 // { "kontotext": "Ränteinkomst", "konto": "8311" },
                  { "kontotext": "Övriga inkomster", "konto": "3900" }
    ];

    this.uttyp = [{ "kategori": "normal", "kontotext": "Varuinköp", "konto": "4000", "isMoms": true, "tooltip" : "Varor för försäljning." },
                        { "kategori": "normal", "kontotext": "Hyra", "konto": "5010", "isMoms": true, "tooltip": "" },
                        { "kategori": "normal", "kontotext": "Förbrukningsinventarier", "konto": "5410", "isMoms": true, "tooltip": "Datorer, möbler, skrivare mm." },
                        { "kategori": "normal", "kontotext": "Förbrukningsmaterial", "konto": "5460", "isMoms": true, "tooltip": "Kontorsmaterial, rengöring mm" },
                        { "kategori": "normal", "kontotext": "Biljetter", "konto": "5810", "isMoms": true, "tooltip": "T ex taxi, tåg, flyg, buss, parkering mm. " },
                        { "kategori": "normal", "kontotext": "Kost och logi", "konto": "5830", "isMoms": true, "tooltip": "Hotell och liknande." },
                        { "kategori": "normal", "kontotext": "Reklam och PR", "konto": "5900", "isMoms": true, "tooltip": "Annonsering, tryckt reklam, reklamgåvora. " },
                        { "kategori": "Representation", "kontotext": "Representation", "konto": "6071", "tooltip": "Måste fördelas på olika konton. " },
                        { "kategori": "normal", "kontotext": "Tele och post", "konto": "6200", "isMoms": true, "tooltip": "Fast telefon, mobiltelefon, internet, post. " },
                        { "kategori": "normal", "kontotext": "Försäkringar", "konto": "6310", "isMoms": true, "tooltip": "Företagsförsäkringar. " },
                        { "kategori": "normal", "kontotext": "Redovisningstjänster", "konto": "6540", "isMoms": true, "tooltip": "Annonsering, tryckt reklam, reklamgåvora. " },
                        { "kategori": "normal", "kontotext": "IT-tjänster", "konto": "6550", "isMoms": true, "tooltip": "Webb-hotell, IT-konsulter mm. " },
                        { "kategori": "normal", "kontotext": "Konsultarvoden", "konto": "6570", "isMoms": true, "tooltip": "Inhyrd personal. " },
                        { "kategori": "normal", "kontotext": "Bankkostnader", "konto": "7600", "isMoms": false, "tooltip": "Kostnader för bank och plusgiro." },
                        { "kategori": "normal", "kontotext": "Övriga personalkostnader", "konto": "7600", "isMoms": true, "tooltip": "Fika, träningskort (ej lön)." },
                        { "kategori": "normal", "kontotext": "Ränteintäkter", "konto": "8300", "isMoms": false, "tooltip": " " },
                        { "kategori": "normal", "kontotext": "Räntekostnader", "konto": "8400", "isMoms": false, "tooltip": " " }
    ];

    this.undo = function () {
         $user.undo();
 
    }

    this.inbet = function (p) {
        if (p.typ.kontotext == "Försäljning") {
            this.forsalj(p);
        } else if (p.typ.kontotext == "Övriga inkomster") {
            this.ovrigInkomst(p);
        } else if (p.typ.kontotext == "Ränteinkomst") {
            this.ranteinkomst(p);
        }
    }

    this.utbet = function (p) {
        if (p.typ.kategori == "normal") {
            this.utbetNormal(p);
        } else if (p.typ.kategori == "Representation") {
            this.representation(p);
        }  
    }

    this.getNewPayment = function () {
        var payment = {};
        payment.moms = $user.getInfo().moms;
        payment.date = new Date();
        return payment;
    }

    this.overforing = function (p) {
        var ver = {};
        ver.etikett = "ver";
        ver.verdatum = $util.dateToSie(new XDate(p.date));
        ver.vernr = $user.getNextNr();
        ver.vertext = p.text;
        ver.poster = [];
        ver.poster.push({ 'etikett': 'trans', 'kontonr': p.till.konto, 'belopp': parseFloat(p.belopp) });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': p.fran.konto, 'belopp': -parseFloat(p.belopp) });

        $user.addVer(ver);
    }
   
    this.oversikt = function ( ) {  
        var res = [];
        _.each($user.getVer(), function(v) {
            var extra = {};
            extra.typ = self.getTypNamn(v);
            extra.date = new XDate($filter('siedate')(v.verdatum)).getTime();
            extra.dateString = $util.sieToDate(v.verdatum);
            extra.vernr = parseInt(v.vernr);
            extra.files = $util.getVerNameFiles(v.vertext);
            extra.text = $util.getVerNameText(v.vertext);
            extra.sum = $util.sumBelopp(v);
            extra.sumFixed = $util.toFixed(extra.sum);
            extra.ver = v;
            res.push(extra);
        });

        return res;
    }


    this.getTypNamn = function (v, types) {
        var types = this.uttyp.concat(this.intyp);
        var namn = "Okänd";
        var count = 0;
        var k1, k2;
        _.each(v.poster, function (p) {
            var typ = _.findWhere(types, { "konto": p.kontonr });
            if (typ) {
                namn =  typ.kontotext;
            }
            var kassakonto = _.findWhere(self.kassakonton, { konto: p.kontonr })
            if (kassakonto) {
                count++;
                if(p.belopp < 0){
                    k1 = kassakonto.text;
                } else {
                    k2 = kassakonto.text;
                }
            } 
        });
        if (count == 2) {  
            return "(" + k1 + " till " + k2 +")";
        }

        return namn;
    }
 
    this.utbetNormal = function (p) {
        var ver = {};
        ver.etikett = "ver";
        ver.verdatum = $util.dateToSie(new XDate(p.date));
        ver.vernr = $user.getNextNr();
        ver.vertext =  p.typ.text +$util.getArryToPipe(p.files);
        ver.poster = [];
        var sum = 0;
  
        if (p.typ.isMoms) {
            sum = p.typ.belopp - p.typ.moms;
            ver.poster.push({ 'etikett': 'trans', 'kontonr': '2641', 'belopp': p.typ.moms });
        } else {
            sum = p.typ.belopp;
        }
        ver.poster.push({ 'etikett': 'trans', 'kontonr': p.typ.konto, 'belopp': sum });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': p.konto, 'belopp': -p.typ.belopp });

        $user.addVer(ver);
    }

    this.repAvdrag = function (p) {
        if(p.reptyp){
            var repAntal = $util.stringToNr(p.repAntal);
            var repBelopp = $util.stringToNr(p.repBelopp);
            var repMoms = $util.stringToNr(p.repMoms);
            var reptyp = $util.stringToNr(p.reptyp)
            p.repAvdrag = Math.min(repBelopp, repAntal * 90);
            p.repAvdragMoms = $util.stringToNr(Math.min(p.repAvdrag * reptyp, repMoms)) ;
             
            p.repNoAvdrag = $util.stringToNr(Math.max(0, p.repBelopp - (p.repAvdrag + p.repAvdragMoms)))
        }
    }

  

    this.representation = function (p) {
        var ver = {};
        ver.etikett = "ver";
        ver.verdatum = $util.dateToSie(new XDate(p.date));
        ver.vernr = $user.getNextNr();
        ver.vertext = p.typ.text +$util.getArryToPipe(p.files);
        ver.poster = [];
        var sum = 0;
 
        ver.poster.push({ 'etikett': 'trans', 'kontonr': '2641', 'belopp': p.repAvdragMoms });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': '6071', 'belopp': p.repAvdrag});
        if(p.repNoAvdrag){
            ver.poster.push({ 'etikett': 'trans', 'kontonr': '6072', 'belopp': p.repNoAvdrag});
        }
        ver.poster.push({ 'etikett': 'trans', 'kontonr': p.konto, 'belopp': -p.typ.belopp });

        $user.addVer(ver);
    }

    this.forsalj = function (p) {
        var ver = {};
        ver.etikett = "ver";
        ver.verdatum = $util.dateToSie(new XDate(p.date));
        ver.vernr = $user.getNextNr();
        ver.vertext = p.text +$util.getArryToPipe(p.files);
        ver.poster = [];
        var sum = 0;
        var sum_moms = 0;
        _.each(p.moms, function (m) {
            if(m.moms) {
                ver.poster.push({ 'etikett': 'trans', 'kontonr': m.konto, 'belopp': -m.moms });
                sum += parseFloat(m.belopp);
                sum_moms += parseFloat(m.moms);
            }
        });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': '3010', 'belopp': -(sum) });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': p.konto, 'belopp': sum + sum_moms });

        $user.addVer(ver);
    }

    this.ovrigInkomst = function (p) {
        var ver = {};
        ver.etikett = "ver";
        ver.verdatum = $util.dateToSie(new XDate(p.date));
        ver.vernr = $user.getNextNr();
        ver.vertext = p.text +$util.getArryToPipe(p.files);
        ver.poster = [];
 
        ver.poster.push({ 'etikett': 'trans', 'kontonr': '2611', 'belopp': parseFloat(p.moms) });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': '3900', 'belopp': parseFloat(p.belopp) });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': p.konto, 'belopp': parseFloat(p.moms) + parseFloat(p.belopp) });

        $user.addVer(ver);
    }

    this.ranteinkomst = function (p) {
        var ver = {};
        ver.etikett = "ver";
        ver.verdatum = $util.dateToSie(new XDate(p.date));
        ver.vernr = $user.getNextNr();
        ver.vertext = p.text;
        ver.poster = [];

        ver.poster.push({ 'etikett': 'trans', 'kontonr': '1940', 'belopp': p.belopp + p.skatt });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': '3010', 'belopp': p.belopp });
        ver.poster.push({ 'etikett': 'trans', 'kontonr': '', 'belopp': p.skatt });

        $user.addVer(ver);
    }


     
});

