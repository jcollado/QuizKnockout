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

    this.onFormSubmit = function() {
        // Form is never submitted
        console.log("Form submission ignored");
    };

    this.onSubmitClick = function() {
        if (self.currentQuestion().isCorrect()) {
            console.log("Answer is correct");
            self.currentQuestionIndex(self.currentQuestionIndex() + 1);
        } else {
            console.log("Answer is *not* correct");
        }
    };

    this.onItemClick = function(item) {
        self.currentQuestion().selectedChoice(item);
    };
}

function QuestionModel(json) {
    var self = this;

    this.code = ko.observable(json.code);
    this.choices = ko.observableArray(json.choices);
    this.correctChoice = json.correctChoice;
    this.selectedChoice = ko.observable(json.choices[0]);
    this.isCorrect = function() {
        return self.selectedChoice() == self.correctChoice;
    };
}
