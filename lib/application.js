$(document).ready(function() {
    Quiz([
        new Question("First question", ["a", "b", "c", "d"], 0),
        new Question("Second question", ["a", "b", "c", "d"], 0),
        new Question("Third question", ["a", "b", "c", "d"], 0),
        new Question("Fourth question", ["a", "b", "c", "d"], 0),
        new Question("Fifth question", ["a", "b", "c", "d"], 0)
    ]).onReady();
});

var Quiz = function(questions) {
    var currentQuestionIndex = 0;
    var currentQuestion = questions[currentQuestionIndex];
    var $question = $("#question");
    var $questionIndex = $question.find("#question_index");
    var $questionCount = $question.find("#question_count");
    var $summary = $("#summary");
    var $newGame = $("#new_game");

    var displayCurrentQuestion = function() {
        currentQuestion = questions[currentQuestionIndex];

        $questionIndex.text(currentQuestionIndex + 1);

        console.log("Displaying question...");
        console.log(currentQuestion);
        currentQuestion.display();
    };

    var displaySummary = function() {
        console.log("Displaying summary...");
        $question.toggle();
        $summary.toggle();
    };

    var onAnswerClick = function() {
        var selectedIndex = $(this).val();
        console.log("Selected index: " + selectedIndex);
        currentQuestion.selectedIndex = selectedIndex;
    };

    var onQuestionSubmit = function(event) {
        // Form is never submitted to the server
        event.preventDefault();

        if (currentQuestion.isCorrect()) {
            console.log("Right answer!");
        } else {
            console.log("Wrong answer!");
        }

        currentQuestionIndex += 1;
        if (currentQuestionIndex < questions.length) {
            displayCurrentQuestion();
        } else {
            displaySummary();
        }
    };

    var onNewGameClick = function() {
        $question.toggle();
        $summary.toggle();

        // Display first question again
        currentQuestionIndex = 0;
        displayCurrentQuestion();
    };

    return {
        onReady: function() {
            $questionCount.text(questions.length);
            $question.on("click", "input[type=radio]", onAnswerClick);
            $question.submit(onQuestionSubmit);
            $newGame.click(onNewGameClick);

            displayCurrentQuestion();
        }
    };
};

function Question(question, choices, correctIndex, selectedIndex) {
    this.question = question;
    this.choices = choices;
    this.correctIndex = correctIndex;
    this.selectedIndex = selectedIndex || 0;
}

// Display question and available choices
Question.prototype.display = function() {
    this.clear();

    $("#question_text").text(this.question);

    var ul = $("#question_choices");
    for (var index in this.choices) {
        var choice = this.choices[index];
        var li = $(
           "<li>" +
           "<input type=\"radio\" " +
                  "name=\"choice\" " +
                  "value=\"" + index + "\"" +
                  ((index == this.selectedIndex) ? "checked" : "") +
                  ">" +
           choice +
           "</li>");
        li.appendTo(ul);
    }
};

// Clear areas with question related values
Question.prototype.clear = function() {
    $("#question_text").text("");
    $("#question_choices").empty();
};

Question.prototype.isCorrect = function() {
    return this.correctIndex == this.selectedIndex;
};
