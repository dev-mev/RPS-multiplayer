$(document).ready(function () {
  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyCjmkYqBECfnJhUZPu7Bb9FGcBc0LL9XkE",
    authDomain: "rps-multiplayer-d06f8.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-d06f8.firebaseio.com",
    projectId: "rps-multiplayer-d06f8",
    storageBucket: "rps-multiplayer-d06f8.appspot.com",
    messagingSenderId: "846116867288"
  };
  firebase.initializeApp(config);

  let database = firebase.database();
  let playerOne;
  let playerTwo;
  let playerOneChoice;
  let playerTwoChoice;
  let playerOneImage;
  let playerTwoImage;
  let playerOneWins;
  let playerTwoWins;
  let ties;
  let initialized = false;

  $(".player-one-ready").hide();
  $(".player-two-ready").hide();

  database.ref().set({
    playerOne: "",
    playerTwo: "",
    playerOneChoice: "",
    playerOneImage: "",
    playerTwoChoice: "",
    playerTwoImage: ""
  });

  database.ref().once("value", function (snapshot) {
    if (snapshot.val().playerOne === "") {
      playerOne = true;
      database.ref().update({
        playerOne
      });
    } else if (snapshot.val().playerOne !== "") {
      playerOne = true;
      playerTwo = true;
      database.ref().update({
        playerTwo
      });
    }
  });

  function checkTwoPlayers() {
    console.log("checkTwoPlayers function");
    if (playerOne === true && playerTwo === true) {
      $(".player-two-wait").hide();
      $(".player-two-ready").show();
      $(".player-one-wait").hide();
      $(".player-one-ready").show();
      playerOneWins = 0;
      playerTwoWins = 0;
      ties = 0;
      playGame();
    } else if (playerOne === true) {
      $(".player-two-ready").hide();
      $(".player-one-wait").hide();
      $(".player-one-ready").show();
      $(".player-two-wait").show();
    }
  }

  function playGame() {
    console.log("playGame()");
    playerOneChoice = "";
    playerTwoChoice = "";
    playerOneImage = "";
    playerTwoImage = "";

    database.ref().update({
      playerOneChoice,
      playerOneImage,
      playerTwoChoice,
      playerTwoImage
    });

    $(".winner").text("");
    $(".player-one-choice").empty();
    $(".player-two-choice").empty();
    $(".question-mark").show();

    if (!initialized) {
      $(".player-one-img").on("click", function () {
        playerOneChoice = $(this).data("choice");
        playerOneImage = $(this).attr("src");
        database.ref().update({
          playerOneChoice,
          playerOneImage
        }, function (error) {
          if (error) {
            console.log("error updating database");
          } else {
            checkBothPlayersChose();
          }
        });
      });

      $(".player-two-img").on("click", function () {
        playerTwoChoice = $(this).data("choice");
        playerTwoImage = $(this).attr("src");
        database.ref().update({
          playerTwoChoice,
          playerTwoImage
        }, function (error) {
          if (error) {
            console.log("error updating database");
          } else {
            checkBothPlayersChose();
          }
        });
      });

      initialized = true;
    }
}

  function checkBothPlayersChose() {
    console.log("checkBothPlayersChose function");
    if (playerOneChoice !== "" && playerTwoChoice !== "") {
      console.log("Both players have chosen");
      $(".question-mark").hide();
      $(".player-one-choice").html($("<img>").attr("src", playerOneImage));
      $(".player-two-choice").html($("<img>").attr("src", playerTwoImage));
      checkWinner();
    }
  }

  function checkWinner() {
    console.log("checkWinner function");
    if ((playerOneChoice === "rock" && playerTwoChoice === "scissors")
      || (playerOneChoice === "scissors" && playerTwoChoice === "paper")
      || (playerOneChoice === "paper" && playerTwoChoice === "rock")) {
      playerOneWins++;
      $(".player-one-wins").text("Wins: " + playerOneWins);
      $(".winner").text(playerOneChoice + " beats " + playerTwoChoice);
    } else if (playerOneChoice === playerTwoChoice) {
      ties++;
      $(".ties").text("Ties: " + ties);
      $(".winner").text("Tie");
    } else {
      playerTwoWins++;
      $(".player-two-wins").text("Wins: " + playerTwoWins);
      $(".winner").text(playerTwoChoice + " beats " + playerOneChoice);
    }
    setTimeout(playGame, 3000);
  }

  setTimeout(checkTwoPlayers, 1000);
});
