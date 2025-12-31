const createForm = document.querySelector('[data-recipe-create]');
const updateForm = document.querySelector('[data-recipe-update]');
const deleteForm = document.querySelector('[data-recipe-delete]');
const feedback = document.querySelector('[data-feedback]');

const sendRecipeRequest = async ({ endpoint, payload, successMessage }) => {
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

createForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  const ok = await sendRecipeRequest({
    endpoint: '/CreateRecip',
    payload,
    successMessage: 'Recette ajoutée avec succès.',
  });
  if (ok) event.target.reset();
});

updateForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  const ok = await sendRecipeRequest({
    endpoint: '/UpdateRecip',
    payload,
    successMessage: 'Recette mise à jour.',
  });
  if (ok) event.target.reset();
});

deleteForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  const ok = await sendRecipeRequest({
    endpoint: '/DeleteRecip',
    payload,
    successMessage: 'Recette supprimée.',
  });
  if (ok) event.target.reset();
});
