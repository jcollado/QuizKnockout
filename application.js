$(document).ready(function() {
    Quiz.initialize([
        new Question("First question", ["a", "b", "c", "d"], 0),
        new Question("Second question", ["a", "b", "c", "d"], 0),
        new Question("Third question", ["a", "b", "c", "d"], 0),
        new Question("Fourth question", ["a", "b", "c", "d"], 0),
        new Question("Fifth question", ["a", "b", "c", "d"], 0)
    ]);

    $("form").submit(Quiz.handleSubmit);
    Quiz.displayNextQuestion();
});

var Quiz = {
    // Set questions to be displayed to the user
    initialize: function(questions) {
        Quiz.questions = questions;
    },

    // Display next question (if available)
    displayNextQuestion: function() {
        if (Quiz.questions.length > 0) {
            var nextQuestion = Quiz.questions.shift();
            nextQuestion.display();
        }
    },

    handleSubmit: function(event) {
        event.preventDefault();

        console.log("Trying to submit...");
        Quiz.displayNextQuestion();
    }
}

function Question(question, choices, correctIndex) {
    this.question = question;
    this.choices = choices;
    this.correctIndex = correctIndex;
}

// Display question and available choices
Question.prototype.display = function() {
    this.clear();

    $("#question").text(this.question);

    var ul = $("#choices");
    for (index in this.choices) {
        var choice = this.choices[index];
        var li = $(
           "<li>" +
           "<input type=\"radio\" " +
                  "name=\"choice\" " +
                  "value=\"" + choice + "\"" +
                  ((index == 0) ? "checked" : "") +
                  ">" +
           choice +
           "</li>");
        li.appendTo(ul);
    }
}

// Clear areas with question related values
Question.prototype.clear = function() {
    $("#question").text("");
    $("#choices").empty();
}
