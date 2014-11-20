var app = angular.module('app', ['localytics.directives', 'ngRoute', 'route-segment', 'view-segment']);

app.config(function($routeSegmentProvider, $routeProvider) {
    
    $routeSegmentProvider
    
    .when('/intro', 'intro')
    .when('/main', 'main')
    
    .when('/desktop', 'desktop')
    .when('/desktop/overview', 'main.desktop.overview')
    .when('/desktop/bookkeeping/:mode/:id?', 'main.desktop.bookkeeping')
    .when('/desktop/invoices', 'main.desktop.invoiceOverview')
    .when('/desktop/invoices/new', 'main.desktop.invoiceDetails')
    .when('/desktop/invoices/:mode/:id', 'main.desktop.invoiceDetails')
    .when('/desktop/book', 'main.desktop.book')
    .when('/desktop/raw', 'main.desktop.raw')
    .when('/desktop/moms', 'main.desktop.reportMoms')
    .when('/desktop/test', 'main.desktop.test')
    .when('/desktop/resultat', 'main.desktop.reportResultat')
    .when('/desktop/balans', 'main.desktop.reportBalans')
    .when('/desktop/ne', 'main.desktop.reportNe')
    .when('/desktop/autokontera', 'main.desktop.reportAutoKontera')
    .when('/desktop/settings', 'main.desktop.moreSettings')
    .when('/desktop/sie', 'main.desktop.moreSie')
    .when('/mobile', 'main.mobile')
    
    
    .segment('intro', {
        templateUrl: '/html/page/intro.html',
        controller: 'introCtrl'
    })
    .segment('main', {
        templateUrl: '/html/page/main.html',
        controller: 'mainCtrl',
        resolve: {
            login: function($user) {
                return $user.whenLoginFinished();
            }
        },
        untilResolved: {
            templateUrl: '/html/page/loader.html'  
        },
        resolveFailed: {
            templateUrl: '',
            controller: function ($location) {
                //console.log('login promise failed!! redirecting to /intro')
                $location.path('/intro');
            }
        }
    }).within()
        .segment('desktop', {
            default: !isMobile(),
            templateUrl: '/html/page/nav.html'
        }).within()
            .segment('overview', {
                default: true,
                templateUrl: '/html/page/overview.html',
                controller: 'overviewCtrl'
            })
            .segment('bookkeeping', {
                templateUrl: '/html/page/bookkeeping.html',
                controller: 'bookkeepingCtrl',
                dependencies: ['id', 'mode']
            })
            .segment('test', {
                templateUrl: '/html/page/test.html',
                controller: 'testCtrl'
            })
            .segment('invoiceOverview', {
                templateUrl: '/html/page/invOverview.html',
                controller: 'invOverviewCtrl'
            })
            .segment('invoiceDetails', {
                templateUrl: '/html/page/invoice.html',
                controller: 'invoiceCtrl'
            })
            .segment('reportMoms', {
                templateUrl: '/html/page/moms.html',
                controller: 'momsCtrl'
            })
            .segment('raw', {
                templateUrl: '/html/page/raw.html',
                controller: 'rawCtrl'
            })
            .segment('book', {
                templateUrl: '/html/page/book.html',
                controller: 'bookCtrl'
            })
            .segment('reportResultat', {
                templateUrl: '/html/page/resultat.html',
                controller: 'resultatCtrl'
            })
            .segment('reportBalans', {
                templateUrl: '/html/page/balans.html',
                controller: 'balansCtrl'
            })
            .segment('reportNe', {
                templateUrl: '/html/page/ne.html',
                controller: 'neCtrl'
            })
            .segment('reportAutoKontera', {
                templateUrl: '/html/page/autokontera.html',
                controller: 'autokonteraCtrl'
            })
            .segment('moreSettings', {
                templateUrl: '/html/page/settings.html',
                controller: 'settingCtrl'
            })
            .segment('moreSie', {
                templateUrl: '/html/page/sie.html',
                controller: 'sieCtrl'
            })
            .up()
        .segment('mobile', {
            default: isMobile(),
            templateUrl: '/html/page/mobile.html',
            controller: 'mobileCtrl'
        });
    
    $routeProvider.otherwise({redirectTo: '/main'}); 
    
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    }
    
})

.run(function ($http, $templateCache, $rootScope, $location, $user) {
    
    // we have t call this ASAP, when the dropbox server authenticate the user it'll
    // redirect back to our app url plus a param 'auth_token' if we wait later the router will take command
    // and will strip that param so the dbService.localAuth won't be able to retreive the auth token
    $user.login();
    
    var page = [
        '/html/page/main.html',
        '/html/page/balans.html',
        '/html/page/book.html',
        '/html/page/bookkeeping.html',
        '/html/page/test.html',
        '/html/page/dropbox.html',
        '/html/page/intro.html',
        '/html/page/invoice.html',
        '/html/page/invOverview.html',
        '/html/page/mobile.html',
        '/html/page/moms.html',
        '/html/page/nav.html',
        '/html/page/ne.html',
        '/html/page/autokontera.html',
        '/html/page/overview.html',
        '/html/page/raw.html',
        '/html/page/reports.html',
        '/html/page/resultat.html',
        '/html/page/settings.html',
        '/html/page/sie.html',
        
        '/html/mpage/avslut.html',
        '/html/mpage/hem.html',
        '/html/mpage/inbet.html',
        '/html/mpage/nav.html',
        '/html/mpage/navOversikt.html',
        '/html/mpage/overforing.html',
        '/html/mpage/oversikt.html',
        '/html/mpage/rapporter.html',
        '/html/mpage/utbet.html',
        
        '/html/partials/datepicker.html',
        '/html/partials/dropboxImage.html',
        '/html/partials/error.html',
        '/html/partials/paginator.html',
        '/html/partials/panel.html',
        '/html/partials/sortable.html'
    ];

    page.forEach(function(p){
        $http.get(p).then(function(res){
            $templateCache.put(p, res.data);
        })
    });
    
})
