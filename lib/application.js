$(document).ready(function() {
    // Get question data from json file in server
    $.getJSON("data/questions.json", function(json) {
        var questions = $.map(json, function(element, index) {
            return new QuestionModel(element);
        });

        // Create quiz with a set of questions
        quiz = new QuizModel(questions);
        ko.applyBindings(quiz);
    });
});

function QuizModel(questions) {
    var self = this;

    this.questions = ko.observableArray(questions);
    this.currentQuestionIndex = ko.observable(0);
    this.currentQuestion = ko.computed(function() {
        return self.questions()[self.currentQuestionIndex()];
    });
}

function QuestionModel(json) {
    this.code = ko.observable(json.code);
    this.choices = ko.observableArray(json.choices);
    this.correctChoice = json.correctChoice;
    this.selectedChoice = ko.observable(json.choices[0]);
}
