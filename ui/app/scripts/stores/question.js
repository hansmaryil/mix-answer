// Lib imports
import $ from 'jquery';
import { observable } from 'mobx';
import URL from './_url';


class QuestionStore {
    @observable questions = [];
    @observable currentQuestion = undefined;
    @observable isLoaded = false;

    loadAll() {
        this.isLoaded = false;
        var promise = this._loadAll();
        promise.then(result => {
            this.questions = result.data;
            this.isLoaded = true;
        });
        return promise;
    }
    setCurrent(id) {
        var promise = this._load(id);
        promise.then(result => {
            this.currentQuestion = result;
        });
        return promise;
    }
    get(id) {
        var question = null;
        this.questions.forEach(q => {
            if (q.id === id) {
                question = q;
            }
        });
        return question;
    }
    create(title, body, tags=[]) {
        var data = {
            title: title,
            body: body,
            tags: tags
        };
        var promise = this._create(data);
        promise.then(result => {
            this.questions.push(result.data);
        });
        return promise;
    }
    delete(id) {
        var promise = this._delete(id);
        promise.then(() => {
            var question = this.get(id);
            var indexQuestion = this.questions.indexOf(question);
            this.questions.splice(indexQuestion, 1);
        });
        return promise;
    }

    // Ajax requests
    _loadAll() {
        return $.get(URL.questions);
    }
    _load(id) {
        return $.get(URL.question.replace(':questionId', id));
    }
    _create(data) {
        return $.ajax({
            method: 'POST',
            url: URL.questions,
            dataType: 'json',
            data: JSON.stringify(data)
        });
    }
    _delete(id) {
        return $.ajax({
            method: 'DELETE',
            url: URL.question.replace(':questionId', id)
        });
    }
}

export default new QuestionStore();
