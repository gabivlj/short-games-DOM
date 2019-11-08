const generateMessage = p => `
<div class="menu">
  Score: ${p}
  <button class="modalButton">Go back</button>
</div>
`;

const message = document.createElement('div');
message.className = 'modal-message';
message.innerHTML = generateMessage(0);

function destroyModal() {
  message.parentElement.removeChild(message);
}

function showModal(puntuation, onDestroy) {
  message.innerHTML = generateMessage(puntuation);
  document.body.appendChild(message);
  message
    .getElementsByClassName('modalButton')[0]
    .addEventListener('click', _ => {
      onDestroy();
      destroyModal();
    });
}
