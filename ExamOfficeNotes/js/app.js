var app = app || {};

(function() {
    var appId= 'N68VlYa43kK1DNvqljK7CgRge6eac1WkeIf5Stz5';
    var restAPI = 'JfJzHMaAg2T5TtA14bHON2PggwPL5sEu0wihMHoU';
    var baseUrl = 'https://api.parse.com/1/';

    var headers = app.headers.load(appId, restAPI);
    var requester = app.requester.load();
    var userModel = app.userModel.load(baseUrl, requester, headers);
    var noteModel = app.noteModel.load(baseUrl, requester, headers);

    var homeViews = app.homeViews.load();
    var userViews = app.userViews.load();
    var noteViews = app.noteViews.load();

    var userController = app.userController.load(userModel, userViews);
    var noteController = app.noteController.load(noteModel, noteViews);
    var homeController = app.homeController.load(homeViews);

    app.router = Sammy(function () {
        var selector = '#container';

        this.before(function() {
            var userId = sessionStorage['userId'];
            if(userId) {
                $('#menu').show();
            } else {
                $('#menu').hide();
            }
        });

        this.before('#/home/', function() {
            var userId = sessionStorage['userId'];
            if(!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/myNotes/(.*)', function() {
            var userId = sessionStorage['userId'];

            if(!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/deleteNote/(.*)', function() {
            var userId = sessionStorage['userId'];
            if(!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/logout/', function() {
            var userId = sessionStorage['userId'];
            if(!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/addNote/', function() {
            var userId = sessionStorage['userId'];
            if(!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/editNote/(.*)', function() {
            var userId = sessionStorage['userId'];
            if(!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/office/', function() {
            var userId = sessionStorage['userId'];
            if(!userId) {
                this.redirect('#/');
                return false;
            }
        });



        this.get('#/', function () {
            homeController.welcomeScreen(selector);
        });

        this.get('#/login/', function() {
            userController.loadLoginPage(selector);
        });

        this.get('#/register/', function() {
            userController.loadRegisterPage(selector);
        });

        this.get('#/logout/', function() {
            userController.logout();
        });

        this.get('#/home/', function () {
            homeController.homeScreen(selector);
        });

        this.get('#/office/(.*)', function(data) {
            var params = data.path.split('/'),
                page = params[params.length - 1];

            if (!page) {
                page = 1;
            }

            noteController.loadOfficeNotesView(selector,page);
        });

        this.get('#/addNote/', function() {
            noteController.loadAddNoteView(selector);
        });

        this.get('#/editNote/:data', function() {
            noteController.loadEditNoteView(selector, this.params['data']);
        });

        this.get('#/deleteNote/:data', function() {
            noteController.loadDeleteNoteView(selector, this.params['data']);
        });

        this.get('#/myNotes/(.*)', function (data) {

            var params = data.path.split('/'),
                page = params[params.length - 1];

            if (!page) {
                page = 1;
            }
            
            noteController.loadUserNotesView(selector, page);
        });

        this.get('#/myNotes/:page', function () {
            var params = data.path.split('/'),
                page = params[params.length - 1];

            if (!page) {
                page = 1;
            }

            noteController.loadUserNotesView(selector, page);
        });



        this.bind('login', function(e, data) {
            userController.login(data.username, data.password);
        });

        this.bind('register', function(e, data) {
            userController.register(data.username, data.password, data.fullName);
        });

       


        this.bind('addNote', function(e, data) {
            noteController.addNote(data.title, data.text, data.deadline);
        });


        this.bind('editNote', function(e, data) {
            noteController.editNote(data.objectId, data.title, data.text, data.author, data.deadline);
        });


        this.bind('deleteNote', function(e, data) {
            noteController.deleteNote(data.id);
        });


    });

    app.router.run('#/');
}());