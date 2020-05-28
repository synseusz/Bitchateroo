var socket = io();


// Socket.Emit chat message upon pressing the Enter key.

$("#chat-input").keydown(function(event) {
      if (event.keyCode == 13) {
          event.preventDefault();
          if ($("#chat-input").val() !== "") {
              socket.emit("chat-message", $("#chat-input").val());
              $("#chat-input").val(""); //deleting input from chat-input once key is pressed
          }
      }
});

// Receive chat message from server.

socket.on("chat-message", function(message) {
    $("#chat-container").append("<li id='chatMsg'>" + message + "</li>" + "<br />");
    $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight - $('#chat-container')[0].clientHeight);
});
