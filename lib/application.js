$(document).ready(function() {
    // Get question data from json file in server
    $.getJSON("data/questions.json", function(json) {
        var questions = $.map(json, function(element, index) {
            return $.extend(new QuestionModel(), element);
        });

        // Create quiz with a set of questions
        quiz = new QuizModel(questions);

        ko.applyBindings(quiz);
    });
});

function QuizModel(questions) {
    this.questions = ko.observableArray(questions);
}

function QuestionModel() {
    this.selectedChoice = ko.observable();
}
