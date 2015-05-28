var app = app || {};

app.noteController = (function () {

    function NoteController(model, views){
        this.model = model;
        this.viewBag = views;
    }

    NoteController.prototype.loadAddNoteView = function (selector){
        this.viewBag.addNote.addNoteView(selector);
    };

    NoteController.prototype.loadDeleteNoteView = function(selector, id) {
        var _this = this;
        var objectId = id.split('=')[1];
        this.model.getById(objectId)
            .then(function(data){
                _this.viewBag.deleteNote.deleteNoteView(selector, data);
            }, function(error) {
                Noty.error(error.responseJSON.error, 'top');
            }
            ).done();
    };

    NoteController.prototype.loadEditNoteView = function(selector, id) {
        var _this = this;
        var objectId = id.split('=')[1];
        this.model.getById(objectId)
            .then(function(data){
                _this.viewBag.editNote.editNoteView(selector, data);
            }, function(error){
                Noty.error(error.responseJSON.error, 'top');
            }).done();
    };

    NoteController.prototype.loadUserNotesView = function (selector, page) {
        var _this = this;
        var author = sessionStorage.fullName;
        
        return this.model.listUserNotes(author, page)
            .then(function (data) {
                _this.viewBag.listUserNotes.loadUserNotesView(selector, data);
            }, function (error) {
                Noty.error(error.responseJSON.error, 'top');
            }).done();
    };

    NoteController.prototype.loadOfficeNotesView = function (selector, page) {
        var _this = this;

        return this.model.listOfficeNotes(page)
            .then(function (data) {
                _this.viewBag.listOfficeNotes.loadOfficeNotesView(selector, data);
            }, function (error) {
                Noty.error(error.responseJSON.error, 'top');
            }).done();
    };

    NoteController.prototype.addNote = function (title, text, deadline) {
        var author = sessionStorage.fullName;
         return this.model.addNote(title, text, author, deadline)
            .then(function () {
                window.location.replace('#/myNotes/');
                Noty.success('Note added successfully!', 'top');
            }, function(error){
                Noty.error(error.responseJSON.error, 'top');
            });
    };

    NoteController.prototype.editNote = function (objectId, title, text, author, deadline) {
        return this.model.editNote(objectId, title, text, author, deadline)
            .then(function () {
                window.location.replace('#/myNotes/');
                 Noty.success('Note edited successfully!', 'top');
            }, function(error){
                Noty.error(error.responseJSON.error, 'top');
            });
    };

    NoteController.prototype.deleteNote = function (objectId) {

        return this.model.deleteNote(objectId)
            .then(function () {
                window.location.replace('#/myNotes/');
                Noty.success('Note deleted successfully!', 'top');
            }, function(error){
                Noty.error(error.responseJSON.error, 'top');
            });
    };


    return {
        load: function (model, views) {
            return new NoteController(model, views);
        }
    };
}());