const webSocketConn = document.currentScript.getAttribute('webSocketConn');

const appendMsg = (toParrent = '', data = []) => {
  if (toParrent && data && data.length) {
    data.forEach(({username = '', message = '', className = '', createdAt = ''}) => {
      $(chatroom).append(
        `<div class='alert alert-${className}'>
          <b>${username}</b>: ${message}
          <span class='right'><b>   time</b>: ${createdAt.replace(/T/g, ' ').replace(/\..*/, '')}</span>
          </div>
        `
      );
    });

    $(toParrent).animate({ scrollTop: $(toParrent).prop('scrollHeight')}, 1000);
  }
};

$(() => {
  const message = $('#message');
  const username = $('#username');
  const send_message = $('#send_message');
  const send_username = $('#send_username');
  const chatroom = $('#chatroom');
  const feedback = $('#feedback');
  const nickName = $('#nickname');

  $.get(
    `${webSocketConn}/getChatHistory`,
    (data) => {
      appendMsg(chatroom, data);
    })
    .fail(function (err) {
      console.log(err);
    });
  
  const socket = io.connect(webSocketConn);

  socket.on('username', (username) => nickName.text(username));
  
  const sentMsg = () => {
    socket.emit(
      'new_message',
      {
        message: message.val(),
        className: alertClass
      }
    );
    message.focus();
  };

  message.keypress((e) => {
    if (message.val() && e.key === 'Enter') sentMsg();
  });

  send_message.click(() => {
    if (message.val()) sentMsg();
  });

  const min = 1;
  const max = 6;
  const random = Math.floor(Math.random() * (max - min)) + min;

  const alertClass = ['secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'][random];

  socket.on('add_mess', data => {
    feedback.html('');
    message.val('');
    appendMsg(chatroom, [data]);
  });

  send_username.click(() => {
    if (username.val()) {
      socket.emit('change_username', { username: username.val() });
      nickName.text(username.val());
      username.val('');
    }
  });

  message.bind('keypress', () => socket.emit('typing'));

  socket.on('typing', data => {
    feedback.html(
      `<p><i> ${data.username} is writing a message... </i></p>`
    );
  });
});
