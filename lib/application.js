$(document).ready(function() {
    Quiz([
        new Question("#include &lt;stdio.h&gt;\n#include &lt;stdlib.h&gt;\n\nint main(void)\n{\n    printf(\"Hello, world!\");\n    return EXIT_SUCCESS;\n}",
            ["c", "c++", "java", "d", "go"],
            "c"),
        new Question("#include &lt;iostream&gt;\nusing namespace std;\nint main()\n{\n    cout << \"Hello, world!\" << endl;\n    return 0;\n}",
            ["c", "c++", "java", "d", "go"],
            "c++"),
        new Question("public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, world!\");\n    }\n}",
            ["c", "c++", "java", "d", "go"],
            "java"),
        new Question("import std.stdio;\n\nvoid main()\n{\n    writeln(\"Hello, world!\");\n}",
            ["c", "c++", "java", "d", "go"],
            "d"),
        new Question("package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, world!\")\n}",
            ["c", "c++", "java", "d", "go"],
            "go"),
    ]).onReady();
});

var Quiz = function(questions) {
    var currentQuestionIndex = 0;
    var currentQuestion = questions[currentQuestionIndex];
    var $question = $("#question");
    var $questionIndex = $question.find("#question_index");
    var $questionCount = $question.find("#question_count");
    var score = 0;
    var $score = $("#score");
    var $scoreNumber = $("#score_number");
    var $scoreTotal = $("#score_total");
    var $scoreSummary = $("#score_summary");
    var $feedback = $("#feedback");
    var $submitAnswer = $("#submit_answer");
    var $continue = $("#continue");
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

        $scoreNumber.text(score);
        $scoreSummary.empty();
        $score.find("span").clone().appendTo($scoreSummary);

        var feedback = null;
        switch (score) {
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
        $feedback.text(feedback);
    };

    var displayNextQuestion = function() {
        currentQuestionIndex += 1;
        if (currentQuestionIndex < questions.length) {
            displayCurrentQuestion();
        } else {
            displaySummary();
        }
    };

    var onRadioButtonClick = function(event) {
        var $this = $(this);
        var selectedChoice = $(this).val();

        event.stopPropagation();

        console.log("Selected choice: " + selectedChoice);
        currentQuestion.selectedChoice = selectedChoice;
    };

    var onItemClick = function() {
        var input = $(this).find("input");

        // Ignore event if input is disabled
        if (!input.prop("disabled")) {
            input.click();
        }
    };

    var onSubmitClick = function() {
        if (currentQuestion.isCorrect()) {
            score += 1;
            var star_selector = ".star:nth-child(" + (currentQuestionIndex + 1) + ")";
            $(star_selector).fadeOut(function() {
                $(this).addClass("highlight").fadeIn(function() {
                    displayNextQuestion();
                });
            });
            console.log("Answer is correct");
        } else {
            $submitAnswer.hide();
            $continue.show();
            var correctElement = "input[value=\"" + currentQuestion.correctChoice + "\"]";
            $(correctElement).parent().addClass("highlight");
            // Disable radio buttons when correct is reponse is being displayed
            $("input[type=radio]").prop("disabled", true);
            console.log("Answer is *not* correct");
            return;
        }
    };

    var onContinueClick = function() {
        $continue.hide();
        $submitAnswer.show();
        displayNextQuestion();
    };

    var onNewGameClick = function() {
        $question.toggle();
        $summary.toggle();

        // Reset score
        score = 0;
        $(".star").removeClass("highlight");

        // Display first question again
        currentQuestionIndex = 0;
        displayCurrentQuestion();
    };

    return {
        onReady: function() {
            // Register callbacks
            $question.on("click", "input[type=radio]", onRadioButtonClick);
            $question.on("click", "li", onItemClick);
            $question.submit(function(event) {
                // Form is never submitted
                event.preventDefault();
            });
            $submitAnswer.click(onSubmitClick);
            $continue.click(onContinueClick);
            $newGame.click(onNewGameClick);

            // Set some text
            $questionCount.text(questions.length);
            $scoreTotal.text(questions.length);

            // Display stars for scores
            for (var i = 0; i < questions.length; i++) {
                $("<span class=\"star\"></span>").appendTo($score);
            }

            // Don't display the continue button until an error happens
            $continue.hide();

            displayCurrentQuestion();
        }
    };
};

function Question(code, choices, correctChoice, selectedChoice) {
    this.code = code;
    this.choices = choices;
    this.correctChoice = correctChoice;
    this.selectedChoice = selectedChoice || choices[0];
}

// Display question and available choices
Question.prototype.display = function() {
    this.clear();

    $("<pre class=\"prettyprint\"><code>" +
            this.code +
            "</code></pre>").appendTo("#question_code");
    prettyPrint();

    var ul = $("#question_choices");
    for (var index in this.choices) {
        var choice = this.choices[index];
        var li = $(
           "<li>" +
           "<input type=\"radio\" " +
                  "name=\"choice\" " +
                  "value=\"" + choice + "\"" +
                  ((choice == this.selectedChoice) ? "checked" : "") +
                  ">" +
           choice +
           "</li>");
        li.appendTo(ul);
    }
};

// Clear areas with question related values
Question.prototype.clear = function() {
    $("#question_code").empty();
    $("#question_choices").empty();
};

Question.prototype.isCorrect = function() {
    return this.correctChoice == this.selectedChoice;
};
