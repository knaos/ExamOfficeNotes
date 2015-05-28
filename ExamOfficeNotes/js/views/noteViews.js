var app = app || {};

app.noteViews = (function() {
    function NoteViews() {
        this.listUserNotes = {
            loadUserNotesView: userNotesView
        };

        this.listOfficeNotes = {
            loadOfficeNotesView: officeNotesView
        };

        this.addNote = {
            addNoteView: addNoteView
        };

        this.editNote = {
            editNoteView: editNoteView
        };

        this.deleteNote = {
            deleteNoteView: deleteNoteView
        };
    }

    function userNotesView (selector, data) {
        $.get('templates/myNoteTemplate.html', function (template) {
            var outHtml = Mustache.render(template, data);
            //console.log(data);
            $(selector).html(outHtml);
        }).then(function  () {

            $('#pagination').pagination({
                items: data.count,
                itemsOnPage: 10,
                cssStyle: 'light-theme',
                hrefTextPrefix: '#/myNotes/'
            }).pagination('selectPage', '#/myNotes/');

             $('.delete').click(function (ev ) {
                var objectId = ev.target.parentElement.getAttribute('data-id');

                window.location.replace('#/deleteNote/objectId=' + objectId   );
                // $.sammy(function() {
                //     this.trigger('showDeleteNoteView', {id: objectId});
                // });
            });

            $('.edit').click(function  (ev) {
                var objectId = ev.target.parentElement.getAttribute('data-id');
                window.location.replace('#/editNote/objectId=' + objectId);
            });

        });
    }

    function officeNotesView (selector, data) {
        $.get('templates/officeNoteTemplate.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function () {
             $('#pagination').pagination({
                items: data.count,
                itemsOnPage: 10,
                cssStyle: 'light-theme',
                hrefTextPrefix: '#/office/'
            }).pagination('selectPage', '#/office/');
        });

    }

    function addNoteView (selector) {
        $.get('templates/addNote.html', function (template) {
            var outHtml = Mustache.render(template);
            $(selector).html(outHtml);
        }).then(function() {
            $('#addNoteButton').click(function() {
                var title = $('#title').val();
                var text = $('#text').val();
                var deadline = $('#deadline').val();
                var author = $('#author').val();


                $.sammy(function() {
                    this.trigger('addNote', {title: title, author: author, text: text, deadline: deadline});
                });


                return false;
            });
        }).done();
    }

    function editNoteView (selector, data) {
        $.get('templates/editNote.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function() {
            $('#editNoteButton').click(function() {
                var title = $('#title').val();
                var text = $('#text').val();
                var deadline = $('#deadline').val();
                var author = $('#author').val();



                $.sammy(function() {
                    this.trigger('editNote', {objectId: data.objectId, title: title, author: author, text: text, deadline: deadline});
                });

                return false;
            });
        }).done();
    }

    function deleteNoteView (selector, data) {
        $.get('templates/deleteNote.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function() {
            $('#deleteNoteButton').click(function() {

                $.sammy(function() {
                    this.trigger('deleteNote', {id: data.objectId});
                });


                return false;
            });
        }).done();
    }

    return {
        load: function() {
            return new NoteViews();
        }
    };
}());