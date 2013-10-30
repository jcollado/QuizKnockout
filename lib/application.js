$(document).ready(function() {
    // Create quiz with a set of questions
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
    // Keep track of question being displayed
    var currentQuestionIndex = null;
    var currentQuestion = null;
    var score = null;

    // Elements in the DOM that might be changed
    var $question = $("#question");
    var $questionIndex = $question.find("#question_index");
    var $questionCount = $question.find("#question_count");
    var $score = $("#score");
    var $scoreNumber = $("#score_number");
    var $scoreTotal = $("#score_total");
    var $scoreSummary = $("#score_summary");
    var $error = $("#error");
    var $answer = $("#answer");
    var $feedback = $("#feedback");
    var $submitAnswer = $("#submit_answer");
    var $continue = $("#continue");
    var $summary = $("#summary");
    var $newGame = $("#new_game");

    // Display question and update question progress
    var displayCurrentQuestion = function() {
        currentQuestion = questions[currentQuestionIndex];

        $questionIndex.text(currentQuestionIndex + 1);

        console.log("Displaying question...");
        console.log(currentQuestion);
        currentQuestion.display();
    };

    // Display summary when there are no more questions
    var displaySummary = function() {
        console.log("Displaying summary...");

        $question.hide();
        $summary.show();

        // Update score text and stars
        $scoreNumber.text(score);
        $scoreSummary.empty();
        $score.find("span").clone().appendTo($scoreSummary);

        // Display some textual feedback based on the score
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

    // Update question counter and display question if there's any left
    // Otherwise, display quiz summary
    var displayNextQuestion = function() {
        currentQuestionIndex += 1;
        if (currentQuestionIndex < questions.length) {
            displayCurrentQuestion();
        } else {
            displaySummary();
        }
    };

    // Update selected choice when radio button is clicked
    var onRadioButtonClick = function(event) {
        var $this = $(this);
        var selectedChoice = $(this).val();

        event.stopPropagation();

        console.log("Selected choice: " + selectedChoice);
        currentQuestion.selectedChoice = selectedChoice;
    };

    // Update selected choice when list item is clicked
    // (this isn't needed but makes selection with mouse easier)
    var onItemClick = function() {
        var input = $(this).find("input");

        // Ignore event if input is disabled
        // (this happens when an wrong response is submitted)
        if (!input.prop("disabled")) {
            input.click();
        }
    };

    var onSubmitClick = function() {
        if (currentQuestion.isCorrect()) {
            score += 1;

            // Update stars score
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

            // Display error message
            $answer.text(currentQuestion.correctChoice);
            $error.slideDown();

            // Highlight correct response
            var correctElement = "input[value=\"" + currentQuestion.correctChoice + "\"]";
            $(correctElement).parent().addClass("highlight");

            // Disable radio buttons when correct is response is being displayed
            $("input[type=radio]").prop("disabled", true);
            console.log("Answer is *not* correct");
            return;
        }
    };

    var onContinueClick = function() {
        $continue.hide();
        $submitAnswer.show();

        // Hide error message
        $error.slideUp();

        displayNextQuestion();
    };

    var onNewGameClick = function() {
        $question.show();
        $summary.hide();

        // Reset score
        score = 0;
        $(".star").removeClass("highlight");

        // Re-shuffle questions
        questions.shuffle();

        // Display first question again
        currentQuestionIndex = 0;
        currentQuestion = questions[0];
        displayCurrentQuestion();
    };

    var onKeypress = function(event) {
        var inputs = $("input[type=radio]");
        var index = null;

        // Key is [1 - 5]
        if (event.which >= 49 && event.which <= 53) {
            index = event.which - 49;
        }
        // Key is [a - e]
        else if (event.which >= 97 && event.which <= 101) {
            index = event.which - 97;
        }

        if (index !== null) {
            inputs[index].click();
        }
    };

    var onReady = function() {
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
        $(document).keypress(onKeypress);

        // Set some text
        $questionCount.text(questions.length);
        $scoreTotal.text(questions.length);

        // Display stars for scores
        for (var i = 0; i < questions.length; i++) {
            $("<span class=\"star\"></span>").appendTo($score);
        }

        // Don't display the continue button until an error happens
        $continue.hide();

        onNewGameClick();
    };

    return {
        onReady: onReady
    };
};

// Shuffle method to reorder responses
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

function Question(code, choices, correctChoice) {
    this.code = code;
    this.choices = choices;
    this.correctChoice = correctChoice;
    this.selectedChoice = null;
}

// Display question and available choices
Question.prototype.display = function() {
    this.clear();

    $("<pre class=\"prettyprint\"><code>" +
            this.code +
            "</code></pre>").appendTo("#question_code");
    prettyPrint();

    var ul = $("#question_choices");

    // Make sure choices are displayed in random order
    this.choices.shuffle();
    this.selectedChoice = this.choices[0];

    for (var i = 0;  i < this.choices.length; i++) {
        var choice = this.choices[i];
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
