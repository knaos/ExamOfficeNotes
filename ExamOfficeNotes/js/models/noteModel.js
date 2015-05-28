var app = app || {};

app.noteModel = (function() {

    var POSTS_PER_PAGE = 10;

    function NoteModel(baseUrl, requester, headers) {
        this.serviceUrl = baseUrl + 'classes/Note/';
        this.requester = requester;
        this.headers = headers;
    }

    NoteModel.prototype.getById = function (objectId) {
        return this.requester.get(this.serviceUrl + objectId, this.headers.getHeaders(false));
    };

    NoteModel.prototype.listUserNotes = function (author, page) {

        var url = this.serviceUrl + '?where={"author" : "' + author + '"}' +
        '&count=1000' +
        '&limit=' + POSTS_PER_PAGE +
        '&skip=' + (POSTS_PER_PAGE * (page - 1));

        return this.requester.get(url, this.headers.getHeaders(true));
    };

    NoteModel.prototype.listOfficeNotes = function (page) {
        var date = getDateNow();
        var url = this.serviceUrl + '?where={"deadline": "' + date+ '"}' +
        '&count=1000' +
        '&limit=' + POSTS_PER_PAGE +
        '&skip=' + (POSTS_PER_PAGE * (page - 1));

        return this.requester.get(url, this.headers.getHeaders());
    };

    NoteModel.prototype.listAllNotes = function() {
        return this.requester.get(this.serviceUrl, this.headers.getHeaders(true));
    };

    NoteModel.prototype.addNote = function(title, text, author, deadline) {
        var userId = sessionStorage['userId'];
        var data = {
            title: title,
            text: text,
            author: author,
            deadline: deadline,
            "ACL":{
               userId :{"write":true,"read":true}, "*":{"read":true }}
        };

        data.ACL[userId] = {"write":true,"read":true};

        return this.requester.post(this.serviceUrl, this.headers.getHeaders(true), data);
    };

    NoteModel.prototype.editNote = function(noteId, title, text, author, deadline) {
        var data = {
            title: title,
            text: text,
            author: author,
            deadline: deadline
        };

        return this.requester.put(this.serviceUrl + noteId, this.headers.getHeaders(true), data);
    };

    NoteModel.prototype.deleteNote = function(noteId) {
        return this.requester.remove(this.serviceUrl + noteId, this.headers.getHeaders(true));
    };

    function getDateNow(){
        var now = new Date();
        var strDateTime = [now.getFullYear(), AddZero(now.getMonth() + 1) , AddZero(now.getDate())].join("-");

        return strDateTime;

        function AddZero(num) {
            return (num >= 0 && num < 10) ? "0" + num : num + "";
        }
    }

    return {
        load: function(baseUrl, requester, headers) {
            return new NoteModel(baseUrl, requester, headers);
        }
    }
}());