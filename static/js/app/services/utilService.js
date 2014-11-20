var app = angular.module('app');


app.service('$util', function () {
    var self = this;

    this.events = [];

    this.errors = [];

    this.stringToNr = function (s) {
        if (s) {
            return parseFloat(parseFloat(s).toFixed(2));
        } else {
            return parseFloat("0");
        }
    }

    this.error = function (titel, msg) {
        self.errors.push({ "titel": titel, "msg": msg, "status" : "alert-warning"});
    }
    this.info = function (titel, msg) {
        self.errors.pop();
        self.errors.push({ "titel": titel, "msg": msg, "status" : "alert-info" });
    }

    this.getServerApi = function () {
        return "/api/dropbox/";
    }

    this.getSieYearStart = function () {
        var d = new Date();
        return d.getFullYear().toString() + "0101"
    }

    this.getSieYearEnd = function () {
        var d = new Date();
        return d.getFullYear().toString() + "1231"
    }


    this.getKonton = function (konton) {
        return _.where(konton, { etikett: 'konto', aktiv: true })
    }

    this.sumBelopp = function (v) {
        var sum = 0;
        _.each(v.poster, function (p) {

            if (p.belopp > 0) {
                sum += p.belopp;
            }
        });
        return sum;
    }

    this.toFixed = function(sum){
        return sum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').replace('.', ',')
    }

    this.getStringDate = function (d) {
        var yyyy = d.getFullYear().toString();
        var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = d.getDate().toString();
        return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding

    }

    this.dateToSie = function (date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = date.getDate().toString();
        return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
    };


    this.sieToDate = function (sie) {
        var stringDate = sie.substring(0, 4) + "-" + sie.substring(4, 6) + "-" + sie.substring(6, 8);

        return stringDate;
    };


    this.addSeries = function (ver, info) {
        var series = _.pluck(ver, 'serie');
        _.each(series, function (s) {
            if (!_.findWhere(info.series, { namn: s })) {
                if (s) {
                    info.series.push({ 'namn': s, "info": '' });
                }
            }
        })
    }

    this.addKonto = function (ver, info) {
        var series = _.pluck(ver, 'konto');
        _.each(konto, function (s) {
            if (!_.findWhere(info.series, { namn: s })) {
                if (s) {
                    info.series.push({ 'namn': s, "info": '' });
                }
            }
        })
    }


    this.move = function (list, old_index, new_index) {
        if (new_index >= list.length) {
            var k = new_index - list.length;
            while ((k--) + 1) {
                list.push(undefined);
            }
        }
        list.splice(new_index, 0, list.splice(old_index, 1)[0]);
    };

    this.isMobile = function () {
        if (window.innerWidth <= 800 && window.innerHeight <= 600) {
            return true;
        } else {
            return false;
        }
    }
    var mapUTF8 = 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■';
    this.sieToString = function (aB) {
        var result = "";
        var sieBuffer = new Uint8Array(aB)
        _.each(sieBuffer, function (c) {
            if (c < 128) {
                result += String.fromCharCode(c);
            } else {
                result += mapUTF8[c - 128];
            }
        })
        return result;
    }

    this.downloadSIE = function(b) {
        // atob to base64_decode the data-URI
        var view = $util.stringToSie($manager.getSieFile(b.book));

        try {
            // This is the recommended method:
            var blob = new Blob([view], { type: 'application/octet-stream' });
        } catch (e) {
            var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
            bb.append(view);
            var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
        }

        // Use the URL object to create a temporary URL
        var url = (window.webkitURL || window.URL).createObjectURL(blob);
        location.href = url; // <-- Download!
    }

    this.stringToSie = function (string) {
        var result = new Uint8Array(string.length)
        _.each(string, function (s, i) {
            var charIndex = mapUTF8.indexOf(s);
            if (charIndex > -1) {
                result[i] = 128 + charIndex;
            } else {
                var c = string.charCodeAt(i)
                result[i] = c;
            }
        })
        return result;
    }

    this.str2ab = function(str) {
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }


    this.getArryToPipe = function(files){
        var ret = "";
        if(files){
            ret = "|";
            for(i in files){

                ret += files[i] +"|";
            }
            ret = ret.substring(0, ret.length - 1);
        }
        return ret;
    }

    this.getVerNameText = function(text){
        if(text && text.indexOf('|') != -1) {
            return text.split('|')[0];
        }
        return text;
    }

    this.getVerNameFiles = function(text){
        if(text && text.indexOf('|') != -1) {
            var arr = text.split('|');
            arr.shift()
            return arr;
        }
        return [];
    }
    //span[{start: 1910, end :1930}]
    this.sumKontoSpan = function(vers, start, end, span){
        var belopp = 0;
        _.each(vers, function(v){
            _each(v.posts, function(a){
                _.each(span, function(s){
                    if(s.start <= a.kontonr  && s.end <= a.kontonr ){
                        belopp += Math.abs(a.belopp);
                    }
                })
            });
        });
        return belopp;
    }

    this.isOldBrowser = function(){
        var myNav = navigator.userAgent.toLowerCase();
        var version = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
        //if not ie
        if(!version) {
            return version
        }
        if(version < 10){
            return true;
        }
        return false;
    }

});

