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
  let playerOne = false;
  let playerTwo = false;
  let playerOneChoice;
  let playerTwoChoice;
  let playerOneImage;
  let playerTwoImage;
  let playerOneWins;
  let playerTwoWins;
  let ties;

  function checkTwoPlayers() {
    $(".player-one-ready").hide();
    $(".player-two-ready").hide();

    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    // This function allows you to update your page in real-time when the firebase database changes.
    database.ref().on("child_added", function (snapshot) {
      if (snapshot.child("playerOne").exists()) {
        playerOne = snapshot.val().playerOne;
        playerTwo = true;

        database.ref().update({
          playerTwo
        });

        $(".player-two-wait").hide();
        $(".player-two-ready").show();
        $(".player-one-wait").hide();
        $(".player-one-ready").show();
        playerOneWins = 0;
        playerTwoWins = 0;
        ties = 0;
        playGame();
      } else if (playerOne === false) {
        playerOne = true;
        $(".player-one-wait").hide();
        $(".player-one-ready").show();
        $(".player-two-wait").show();
        $(".player-two-ready").hide();
        database.ref().set({
          playerOne
        });
      }
    });
  }

  function playGame() {
    console.log("playGame()");
    database.ref().update({
      playerOneChoice: "",
      playerOneImage: "",
      playerTwoChoice: "",
      playerTwoImage: ""
    });

    $(".winner").text("");
    $(".player-one-choice").empty();
    $(".player-two-choice").empty();
    $(".question-mark").show();

    $(".player-one-img").on("click", function () {
      playerOneChoice = $(this).data("choice");
      playerOneImage = $(this).attr("src");
      console.log(playerOneChoice);
      database.ref().update({
        playerOneChoice,
        playerOneImage
      });
      checkBothPlayersChose();
    });

    $(".player-two-img").on("click", function () {
      playerTwoChoice = $(this).data("choice");
      playerTwoImage = $(this).attr("src");
      console.log(playerTwoChoice);
      database.ref().update({
        playerTwoChoice,
        playerTwoImage
      });
      checkBothPlayersChose();
    });
  }

  function checkBothPlayersChose() {
    console.log("checkBothPlayersChose")
    if (playerOneChoice !== undefined && playerTwoChoice !== undefined) {
      console.log("Both players have chosen");
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
      $(".winner").text("Tie");
    } else {
      playerTwoWins++;
      $(".player-two-wins").text("Wins: " + playerTwoWins);
      $(".winner").text(playerTwoChoice + " beats " + playerOneChoice);
    }
    setTimeout(playGame, 3000);
  }

  checkTwoPlayers();
});
