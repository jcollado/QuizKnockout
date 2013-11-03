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

ko.bindingHandlers.slide = {
    init: function(element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        $(element).toggle(value);
    },

    update: function(element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        if (value) {
            $(element).slideDown();
        } else {
            $(element).slideUp();
        }
    }
};

function QuizModel(questions) {
    var self = this;

    this.questions = ko.observableArray(questions);
    this.questions().shuffle();
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

            // Display next question or summary if there are no questions left
            self.next();
        } else {
            self.wrongAnswerSubmitted(true);
            console.log("Answer is *not* correct");
        }
    };

    this.onContinueClick = function() {
        self.wrongAnswerSubmitted(false);

        // Display next question or summary if there are no questions left
        self.next();
    };

    this.onNewGameClick = function() {
        self.questions().shuffle();
        self.currentQuestionIndex(0);
        self.score(0);
        // Remove star decoration for right answers
        $(".star").removeClass("highlight");
        self.quizFinished(false);
    };

    this.onItemClick = function(item) {
        // Let user select an answer
        // only when the application is not showing the right one
        if (!self.wrongAnswerSubmitted()) {
            self.currentQuestion().selectedChoice(item);
        }
    };

    this.onKeypress = function(model, event) {
        var index = null;

        if (event.which == 13) {
            // There's only one visible button at a time
            // which is the one that is to be clicked by default
            $("input[type=submit]:visible").click();
            return;
        }

        // Key is [1 - 5]
        if (event.which >= 49 && event.which <= 53) {
            index = event.which - 49;
        }
        // Key is [a - e]
        else if (event.which >= 97 && event.which <= 101) {
            index = event.which - 97;
        }

        if (index !== null) {
            // Get radio button value based on the index
            var value = $("li:nth-child(" + (index + 1) + ") input").val();
            self.currentQuestion().selectedChoice(value);
        }
    };

    this.highlightCorrectAnswer = function(item) {
        // Highlight correct answer when a wrong one is submitted
        return self.wrongAnswerSubmitted() && item == self.currentQuestion().correctChoice;
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
        // Re-shuffle choices when a question is displayed
        self.choices().shuffle();
        self.selectedChoice(self.choices()[0]);

        // Remove old code elements and add new ones
        // (required for the syntax highlighting to work)
        element.empty();
        $("<pre class=\"prettyprint\"><code>" +
                self.code +
                "</code></pre>").appendTo(element);

        // Enable syntax highlighting
        prettyPrint();
    };
}

// Shuffle method to reorder both questions and answers
// http://www.kirupa.com/html5/shuffling_array_js.htm
Array.prototype.shuffle = function() {
    var input = this;

    for (var i = input.length-1; i >=0; i--) {

        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
};
