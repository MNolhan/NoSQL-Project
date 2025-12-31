const updateForm = document.querySelector('[data-user-update]');
const deleteForm = document.querySelector('[data-user-delete]');
const feedback = document.querySelector('[data-feedback]');

const sendUserRequest = async ({ endpoint, payload, successMessage }) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));
    feedback.textContent = response.ok ? successMessage : result.message || 'Action échouée.';
    feedback.style.color = response.ok ? '#1d4ed8' : '#ef4444';
    return response.ok;
  } catch (error) {
    feedback.textContent = 'Impossible de contacter le serveur.';
    feedback.style.color = '#ef4444';
    return false;
  }
};

updateForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  const ok = await sendUserRequest({
    endpoint: '/UpdateUser',
    payload,
    successMessage: 'Profil mis à jour.',
  });
  if (ok) event.target.reset();
});

deleteForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  const ok = await sendUserRequest({
    endpoint: '/DeleteUser',
    payload,
    successMessage: 'Compte supprimé.',
  });
  if (ok) event.target.reset();
});
