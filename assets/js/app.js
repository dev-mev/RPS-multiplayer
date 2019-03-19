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
  let playersRef = database.ref("players");
  let playerOne = false;
  let playerTwo = false;
  let player;
  let playerOneChoice;
  let playerTwoChoice;
  let playerOneImage;
  let playerTwoImage;
  let playerOneWins;
  let playerTwoWins;
  let ties;
  let initialized = false;

  let playersListener = playersRef.on("value", function (snapshot) {
    if (snapshot.val().playerOne === false) {
      playerOne = true;
      player = "playerOne";
      $(".player-one-text").text("Player one ready");
      console.log(player);
      playersRef.update({
        playerOne
      });
    } else if (snapshot.val().playerOne === true && snapshot.val().playerTwo === true) {
      playerOne = true;
      playerTwo = true;
      checkTwoPlayers();
    } else if (snapshot.val().playerOne === true && player !== "playerOne") {
      playerOne = true;
      playerTwo = true;
      player = "playerTwo";
      console.log(player);
      playersRef.update({
        playerTwo
      });
    }
  });

  function newGame() {
    playerOneChoice = "";
    playerTwoChoice = "";
    playerOneImage = "";
    playerTwoImage = "";

    $(".player-one-text").text("Player one ready");
    $(".player-two-text").text("Player two ready");

    database.ref().update({
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
    console.log("check two players function")
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
          $(this).css("border", "solid 2px #FF1D8E");
          $(".player-one-text").text("Player one has made their selection");
          database.ref().update({
            playerOneChoice,
            playerOneImage
          });
        }
      });

      $(".player-two-img").on("click", function () {
        if (player === "playerTwo") {
          playerTwoChoice = $(this).data("choice");
          playerTwoImage = $(this).attr("src");
          $(this).css("border", "solid 2px #FF1D8E");
          $(".player-two-text").text("Player two has made their selection");
          database.ref().update({
            playerTwoChoice,
            playerTwoImage
          });
        }
      });

      initialized = true;
    }
  }

  database.ref().on("value", function (snapshot) {
    if (snapshot.val().playerOneChoice !== "" && snapshot.val().playerTwoChoice !== "") {
      $(".question-mark").hide();
      $(".player-one-choice").html($("<img>").attr("src", snapshot.val().playerOneImage));
      $(".player-two-choice").html($("<img>").attr("src", snapshot.val().playerTwoImage));

      if ((snapshot.val().playerOneChoice === "rock" && snapshot.val().playerTwoChoice === "scissors")
      || (snapshot.val().playerOneChoice === "scissors" && snapshot.val().playerTwoChoice === "paper")
      || (snapshot.val().playerOneChoice === "paper" && snapshot.val().playerTwoChoice === "rock")) {
        playerOneWins++;
        $(".player-one-wins").text("Wins: " + playerOneWins);
        $(".winner").text(snapshot.val().playerOneChoice + " beats " + snapshot.val().playerTwoChoice);
      } else if (snapshot.val().playerOneChoice === snapshot.val().playerTwoChoice) {
        ties++;
        $(".ties").text("Ties: " + ties);
        $(".winner").text("Tie");
      } else {
        playerTwoWins++;
        $(".player-two-wins").text("Wins: " + playerTwoWins);
        $(".winner").text(snapshot.val().playerTwoChoice + " beats " + snapshot.val().playerOneChoice);
      }
      setTimeout(function () { $(".player-one-img").removeAttr("style"); }, 2000);
      setTimeout(function () { $(".player-two-img").removeAttr("style"); }, 2000);
      setTimeout(newGame, 3000);
    }
  });

  $(window).on("unload", function () {
    playersRef.off("value", playersListener);
    playerOne = false;
    playerTwo = false;
    playersRef.update({
      playerOne,
      playerTwo
    });
  });
});
