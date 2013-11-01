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
        var question = self.questions()[self.currentQuestionIndex()];

        // Code display is not handled by knockout directly
        // to take care of the syntax highlighting,
        // which needs element to be recreated each time (not just updated)
        question.displayCode($("#question_code"));

        return question;
    });
    this.score = ko.observable(0);
    this.errorFound = ko.observable(false);

    this.onFormSubmit = function() {
        // Form is never submitted
        console.log("Form submission ignored");
    };

    this.onSubmitClick = function() {
        if (self.currentQuestion().isCorrect()) {
            console.log("Answer is correct");
            var star_selector = ".star:nth-child(" + (self.currentQuestionIndex() + 1) + ")";
            $(star_selector).fadeOut(function() {
                $(this).addClass("highlight").fadeIn(function() {
                });
            });
            self.score(self.score() + 1);
            self.currentQuestionIndex(self.currentQuestionIndex() + 1);
        } else {
            self.errorFound(true);
            console.log("Answer is *not* correct");
        }
    };

    this.onContinueClick = function() {
        self.errorFound(false);
        self.currentQuestionIndex(self.currentQuestionIndex() + 1);
    };

    this.onItemClick = function(item) {
        self.currentQuestion().selectedChoice(item);
    };
}

function QuestionModel(json) {
    var self = this;

    this.code = json.code;
    this.choices = ko.observableArray(json.choices);
    this.correctChoice = json.correctChoice;
    this.selectedChoice = ko.observable(json.choices[0]);
    this.isCorrect = function() {
        return self.selectedChoice() == self.correctChoice;
    };

    this.displayCode =  function(element) {
        element.empty();
        $("<pre class=\"prettyprint\"><code>" +
                self.code +
                "</code></pre>").appendTo(element);

        // Enable syntax highlighting
        prettyPrint();
    };
}
