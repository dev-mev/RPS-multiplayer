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
  let player;
  let playerOneChoice;
  let playerTwoChoice;
  let playerOneImage;
  let playerTwoImage;
  let playerOneWins;
  let playerTwoWins;
  let ties;
  let initialized = false;

  database.ref().once("value", function (snapshot) {
    if (snapshot.val().playerOne === false) {
      playerOne = true;
      player = "playerOne";
      console.log(player);
      database.ref().update({
        playerOne
      });
    } else if (snapshot.val().playerOne === true) {
      playerOne = true;
      playerTwo = true;
      player = "playerTwo";
      console.log(player);
      database.ref().update({
        playerTwo
      });
    }
  });

  function newGame() {
    playerOneChoice = "";
    playerTwoChoice = "";
    playerOneImage = "";
    playerTwoImage = "";

    database.ref().set({
      playerOne: false,
      playerTwo: false,
      playerOneChoice,
      playerOneImage,
      playerTwoChoice,
      playerTwoImage
    }, function (error) {
      if (error) {
        console.log("error updating database");
      } else {
        playGame();
      }
    });
  }

  function checkTwoPlayers() {
    if (playerOne === true && playerTwo === true) {
      $(".player-one-text").text("Player one ready");
      $(".player-two-text").text("Player two ready");
      playerOneWins = 0;
      playerTwoWins = 0;
      ties = 0;
      playGame();
    } else if (playerOne === true) {
      $(".player-one-text").text("Player one ready");
    }
  }

  function playGame() {
    $(".winner").text("");
    $(".player-one-choice").empty();
    $(".player-two-choice").empty();
    $(".question-mark").show();

    if (!initialized) {
      $(".player-one-img").on("click", function () {
        if (player === "playerOne") {
          playerOneChoice = $(this).data("choice");
          playerOneImage = $(this).attr("src");
          $(".player-one-text").text("Player one has made their selection");
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
        }
      });

      $(".player-two-img").on("click", function () {
        if (player === "playerTwo") {
          playerTwoChoice = $(this).data("choice");
          playerTwoImage = $(this).attr("src");
          $(".player-two-text").text("Player two has made their selection");
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
        }
      });

      initialized = true;
    }
  }

  function checkBothPlayersChose() {
    if (playerOneChoice !== undefined && playerOneChoice !== ""
      && playerTwoChoice !== undefined && playerTwoChoice !== "") {
      $(".question-mark").hide();
      $(".player-one-choice").html($("<img>").attr("src", playerOneImage));
      $(".player-two-choice").html($("<img>").attr("src", playerTwoImage));
      checkWinner();
    }
  }

  function checkWinner() {
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
    setTimeout(newGame, 3000);
  }

  setTimeout(checkTwoPlayers, 1000);
});
