const webSocketConn = document.currentScript.getAttribute('webSocketConn');

$(() => {
  const socket = io.connect(webSocketConn);

  const message = $('#message');
  const username = $('#username');
  const send_message = $('#send_message');
  const send_username = $('#send_username');
  const chatroom = $('#chatroom');
  const feedback = $('#feedback');

  send_message.click(() => {
    if (message.val()) {
      socket.emit('new_message', {
        message: message.val(),
        className: alertClass
      });
    }
  });
  const min = 1;
  const max = 6;
  const random = Math.floor(Math.random() * (max - min)) + min;

  const alertClass = ['secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'][random];

  socket.on("add_mess", data => {
    feedback.html("");
    message.val("");
    chatroom.append(
      "<div class='alert alert-" +
        data.className +
        "'<b>" +
        data.username +
        "</b>: " +
        data.message +
        "</div>"
    );
  });

  send_username.click(() => socket.emit("change_username", { username: username.val() }));

  message.bind("keypress", () => socket.emit("typing"));

  socket.on("typing", data => {
    feedback.html(
      "<p><i>" + data.username + " is writing a message..." + "</i></p>"
    );
  });
});
