document.getElementById('experienceForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const company = form.company.value.trim();
  const role = form.role.value.trim();
  const experience = form.experience.value.trim();
  const outputDiv = document.getElementById('output');
  const submitButton = form.querySelector('button');

  if (!company || !role || !experience) {
    outputDiv.textContent = 'Please fill in all fields.';
    return;
  }

  outputDiv.innerHTML = '<em>Generating interview experience...</em>';
  submitButton.disabled = true;

  try {
    const res = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, role, experience })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    outputDiv.textContent = data.result || 'No output received.';
  } catch (err) {
    console.error('Fetch error:', err);
    outputDiv.textContent = 'Something went wrong. Please try again later.';
  } finally {
    submitButton.disabled = false;
  }
});
