var app = angular.module('app');

 

app.service('$user', function ($http, $util, sieService, $defaultData, dbService, dbMock, $q) {
    var self = this;

    this.update = function (post) {
        dbService.update(post);
    }

    this.getDBmail = function(){
        return dbService.getEmail();
    }

    this.getVer = function(){
        var list = _.where(self.poster, { etikett: 'ver', book: self.getInfo().aktiv });
        return list;
    }

    this.getInvoice = function(){
        var list = _.where(self.poster, { etikett: 'invoice', book: self.getInfo().aktiv });
        return list;
    }

    this.getLogo = function(){
        var list = _.findWhere(self.poster, { etikett: 'logo' });
        return list;
    }

    this.getIB = function(){
        var list = _.where(self.poster, { etikett: 'ib', "årsnr" : "0", book: self.getInfo().aktiv });
        return list;
    }

    this.getPost  = function(id){
        var list = _.findWhere(self.poster, { id : id });
        return list;
    }

    this.getBook = function () {
        var list = _.findWhere(self.poster, { etikett: 'rar', id: self.getInfo().aktiv });
        return list;
    };

    this.getVerByBook = function (book) {
        var list = _.where(self.poster, { etikett: 'ver', book: book.id });
        return list;
    }

    this.undo = function () {
        var list = _.where(self.poster, { etikett: 'ver', book: self.getInfo().aktiv });
        self.poster.pop();
        dbService.delete(list.pop());
    }

    this.deletePost = function (post) {
        _.each(self.poster, function(p, i){
            if (p.id == post.id){
                self.poster.splice(i, 1);
            }
        });
        dbService.delete(post);
    }

    this.getNextNr = function (serie) {
        if (serie) {
            return _.where(self.poster, { etikett: 'ver', serie: serie, book: self.getInfo().aktiv }).length + 1;
        } else {
            return _.where(self.poster, { etikett: 'ver', book: self.getInfo().aktiv }).length + 1;
        }
    }

    this.getIbKonto = function (nr) {
        var konto = _.findWhere(self.poster, {"årsnr" : 0, "book" : self.getInfo().aktiv,  etikett: 'ib', "konto" : nr });
        return konto;
    }

    this.getKonton = function () {
        var list = _.where(self.poster, { etikett: 'konto'});
        return list;
    }

    this.getKontoNamn = function (k) {
        var k = _.findWhere(self.poster, { etikett: 'konto', "kontonr": k});
        if (k) {
            return k.kontonamn
        } else {
            return "Konto namn saknas";
        }
    }


    this.getInfo = function () {
        return _.findWhere(self.poster, { etikett: "info" });
    }

    this.getCompanyData = function () {
        var data = {};
        data.fname = _.findWhere(self.poster, { etikett: "fname" }.företagsnamn);
        data.orgnr = _.findWhere(self.poster, { etikett: "orgnr" }).orgnr;
        data.kontakt = _.findWhere(self.poster, { etikett: "adress" }).kontakt;
        data.utdelningsadr = _.findWhere(self.poster, { etikett: "adress" }).utdelningsadr;
        data.postadr = _.findWhere(self.poster, { etikett: "adress" }).postadr;
        data.tel = _.findWhere(self.poster, { etikett: "adress" }).tel;
        return data;
    }

    this.activeBook = function (book) {
        var info = self.getInfo();
        info.aktiv = book.id;
        dbService.update(info);
    };

    this.removeBook = function (bookId) {
        self.poster = _.filter(self.poster, function(p,i){

            if(p.hasOwnProperty('id') && p.id == bookId){
                dbService.delete(p);
                return false;
            }
            if( p.hasOwnProperty('book') && p.book == bookId){
                dbService.delete(p);
                return false;
            }
            return true;
        });
    }

    this.getBooks = function () {
        var list = _.where(self.poster, { etikett: 'rar' });
        return list;
    };

    this.getHeader = function (book) {
        var list = [];
        list.push(_.findWhere(self.poster, { etikett: "flagga" }));
        list.push(_.findWhere(self.poster, { etikett: "format" }));
        list.push(_.findWhere(self.poster, { etikett: "sietyp" }));
        list.push(_.findWhere(self.poster, { etikett: "program" }));
        list.push(_.findWhere(self.poster, { etikett: "gen" }));
        list.push(_.findWhere(self.poster, { etikett: "fnamn" }));
        list.push(_.findWhere(self.poster, { etikett: "orgnr" }));
        list.push(_.findWhere(self.poster, { etikett: "adress" }));
        list.push(book);
        list.push(_.findWhere(self.poster, { etikett: "kptyp" }));
        return list;
    }

    this.getSumKonton = function (kontonr) {
        var sum = 0;
        _.each(self.active, function (p) {
            if (p.etikett == 'ver') {
                _.each(p.poster, function (ap) {
                    if (ap.kontonr == kontonr) {
                        sum += parseInt(ap.belopp);
                    }
                });
            }
        });
        return sum;
    }


    this.addVer = function (ver) {
        ver.book = self.getInfo().aktiv;
        ver.etikett = "ver";
        self.poster.push(ver);
        dbService.add(ver);
    }

    this.addInvoice = function (inv) {
        inv.book = self.getInfo().aktiv;
        inv.etikett = "invoice";
        self.poster.push(inv);
        dbService.add(inv);
    }

    this.updateInvoice = function (inv) {
        inv.book = self.getInfo().aktiv;
        for (var i = 0; i < self.poster.length; i++) {
            if(self.poster[i].id === inv.id) {
                self.poster[i] = inv;
                dbService.update(inv);
                return;
            }
        }
    }

    this.removeInvoice = function (inv) {
        self.deletePost(inv);
    }

    this.addKonto = function (k) {
        self.poster.push(k);
        dbService.add(k);
    }

    this.createUser = function () {
        self.poster = $defaultData.info;
        self.poster = self.poster.concat($defaultData.allKonton);

        // save
        _.each(self.poster, function (p) {
            dbService.add(p) ;
        })
        this.activeBook(this.getBooks()[0])
        return dbService.get();
    }


    this.createBook = function (start, end, balanser, ver) {
        var info = self.getInfo();
        var rar = {
            "etikett": "rar",
            "årsnr": "0",
            "start": start,
            "slut": end
        }
        dbService.add(rar);
        self.poster.push(rar);
        _.each(balanser, function (b) {
            b.book = rar.id;
            dbService.add(b)
            self.poster.push(b);
        })
        _.each(ver, function (v) {
            v.book = rar.id;
            dbService.add(v);
            self.poster.push(v);
        })
        info.aktiv = rar.id;
        dbService.update(info)
        return rar;
    }

    this.logout = function() {
        dbService.logout();
    }

    var isDemo = false;
    this.mockDB = function() {
        isDemo = true;
        dbService = dbMock;
    }

    // login always call localAuth, if localAuth is rejected then the app
    // will have to redirect the user to the dropbox server
    this.login = function () {
        this.loginPromise = dbService.localAuth().then(init);

        return this.loginPromise;

        function init(status) {
            if(status){
                var poster = dbService.get();
                if (poster.length == 0) {
                    poster = self.createUser()
                    self.poster = poster;
                } else {
                    self.poster = poster;
                }
            }
            return status;
        }
    }

    this.whenLoginFinished = function () {
        return  isDemo ? $q.when(true) : this.loginPromise;
    }


});

