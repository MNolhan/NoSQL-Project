const loginForm = document.querySelector('[data-login-form]');
const signupForm = document.querySelector('[data-signup-form]');
const feedback = document.querySelector('[data-feedback]');

const handleSubmit = async (event, endpoint, successMessage) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    feedback.textContent = response.ok
      ? successMessage
      : result.message || 'Une erreur est survenue. Vérifiez vos informations.';
    feedback.style.color = response.ok ? '#1d4ed8' : '#ef4444';
    if (response.ok) {
      form.reset();
    }
  } catch (error) {
    feedback.textContent = 'Impossible de contacter le serveur.';
    feedback.style.color = '#ef4444';
  }
};

loginForm?.addEventListener('submit', (event) =>
  handleSubmit(event, '/Login', 'Connexion réussie. Vous pouvez gérer vos recettes.'),
);

signupForm?.addEventListener('submit', (event) =>
  handleSubmit(event, '/CreateUser', 'Compte créé ! Connectez-vous pour continuer.'),
);
