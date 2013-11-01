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
    this.wrongAnswerSubmitted = ko.observable(false);
    this.quizFinished = ko.observable(false);
    this.feedback = ko.computed(function() {
        var feedback = null;

        switch (self.score()) {
            case 0:
            case 1:
            case 2:
                feedback = "You need to improve";
                break;
            case 3:
                feedback = "Fair enough";
                break;
            case 4:
                feedback = "You're almost there!";
                break;
            case 5:
                feedback = "Perfect game!";
        }

        return feedback;
    });

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
            self.next();
        } else {
            self.wrongAnswerSubmitted(true);
            $("#error").slideDown();
            console.log("Answer is *not* correct");
        }
    };

    this.onContinueClick = function() {
        self.wrongAnswerSubmitted(false);
        $("#error").slideUp();
        self.next();
    };

    this.onNewGameClick = function() {
        self.currentQuestionIndex(0);
        self.score(0);
        self.quizFinished(false);
    };

    this.onItemClick = function(item) {
        self.currentQuestion().selectedChoice(item);
    };

    this.next = function(item) {
        var newQuestionIndex = self.currentQuestionIndex() + 1;

        if (newQuestionIndex < self.questions().length) {
            self.currentQuestionIndex(newQuestionIndex);
        } else {
            self.quizFinished(true);
        }
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
