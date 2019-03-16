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

  var database = firebase.database();

  let playerOneChoice;
  let playerTwoChoice;
  let playerOneImage;
  let playerTwoImage;
  let playerOneWins;
  let playerTwoWins;
  let playerOneLosses;
  let playerTwoLosses;

  $(".player-one-img").on("click", function () {
    playerOneChoice = $(this).data("choice");
    playerOneImage = $(this).attr("src");
    console.log(playerOneChoice);
    database.ref().set({
      playerOneChoice,
      playerOneImage
    });
    checkBothPlayersChose();
  });

  $(".player-two-img").on("click", function () {
    playerTwoChoice = $(this).data("choice");
    playerTwoImage = $(this).attr("src");
    console.log(playerTwoChoice);
    database.ref().set({
      playerTwoChoice,
      playerTwoImage
    });
    checkBothPlayersChose();
  });

  function checkBothPlayersChose() {
    if (playerOneChoice !== undefined && playerTwoChoice !== undefined) {
      console.log("Both players have chosen");
      $(".question-mark").hide();
      $(".player-one-choice").append($("<img>").attr("src", playerOneImage));
      $(".player-two-choice").append($("<img>").attr("src", playerTwoImage));
    }
  }
})