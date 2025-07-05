const form = document.getElementById("experienceForm");
const output = document.getElementById("output");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const company = document.getElementById("company").value.trim();
  const role = document.getElementById("role").value.trim();
  const experience = document.getElementById("experience").value.trim();

  output.innerHTML = "<p>Generating interview experience...</p>";

  try {
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, experience }),
    });

    const data = await res.json();
    const structured = data.text;

    if (!structured || typeof structured !== "object") {
      output.innerHTML = "<p class='error'>Invalid response format.</p>";
      return;
    }

    output.innerHTML = renderStructuredOutput(structured);
  } catch (err) {
    output.innerHTML = "<p class='error'>Error: Could not fetch interview experience.</p>";
    console.error(err);
  }
});

function renderStructuredOutput(obj) {
  return `
    <h2>Introduction</h2><p>${obj["Introduction"]}</p>
    <h2>Overview</h2><p>${obj["Overview and all round details"]}</p>
    <h2>Round 1</h2><p>${obj["Round 1 Name and Questions"]}</p>
    <h2>Round 2</h2><p>${obj["Round 2 Name and Questions"]}</p>
    <h2>Round 3</h2><p>${obj["Round 3 Name and Questions"]}</p>
    <h2>Round 4</h2><p>${obj["Round 4 Name and Questions if any"]}</p>
    <h2>Result</h2><p>${obj["Result"]}</p>
    <h2>Tips</h2><p>${obj["Tips"]}</p>
  `;
}
