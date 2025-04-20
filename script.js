const email = new URLSearchParams(window.location.search).get("email");
const scriptBase = "https://script.google.com/macros/s/AKfycbxnSvSD0pYV4eU2b9ZWpmbaZvZSY9KOa2xGAX0sN_7iKChxJ8NdxxmpSJDqr58mvGfBVg/exec";

if (!email) {
  document.getElementById("titre").innerText = "Email manquant ❌";
} else {
  fetch(`${scriptBase}?email=${encodeURIComponent(email)}`)
    .then(res => res.text())
    .then(response => {
      if (response.startsWith("Bonjour") || response.startsWith("Bonsoir")) {
        document.getElementById("titre").innerText = response;

        const buttons = document.getElementById("buttons");
        buttons.innerHTML = `
          <button id="btn-arrivee">Pointer Arrivée</button>
          <button id="btn-urgence">Pointer Urgence</button>
          <button onclick="window.open('${scriptBase}?email=${encodeURIComponent(email)}&action=retour')">Fin d'Urgence</button>
          <button onclick="window.open('${scriptBase}?email=${encodeURIComponent(email)}&action=descente')">Pointer Descente</button>
        `;

        document.getElementById('btn-arrivee').addEventListener('click', () => {
          document.getElementById('arrivee-container').style.display = 'block';
          document.getElementById('urgence-container').style.display = 'none';
        });

        document.getElementById('btn-urgence').addEventListener('click', () => {
          document.getElementById('urgence-container').style.display = 'block';
          document.getElementById('arrivee-container').style.display = 'none';
        });

        document.getElementById('lieu').addEventListener('change', function () {
          const autreLieuInput = document.getElementById('autre-lieu');
          autreLieuInput.style.display = this.value === 'Autre' ? 'block' : 'none';
        });

        document.getElementById('envoyer-arrivee').addEventListener('click', () => {
          const lieu = document.getElementById('lieu').value;
          const autreLieu = document.getElementById('autre-lieu').value;
          const finalLieu = lieu === 'Autre' && autreLieu ? autreLieu : lieu;

          fetch(`${scriptBase}?email=${encodeURIComponent(email)}&action=arrivee&lieu=${encodeURIComponent(finalLieu)}`)
            .then(response => response.text())
            .then(response => {
              document.getElementById("titre").innerText = response;
              document.getElementById('arrivee-container').style.display = 'none';
            });
        });

        document.getElementById('envoyer-urgence').addEventListener('click', () => {
          const raison = document.getElementById('raison').value;

          fetch(`${scriptBase}?email=${encodeURIComponent(email)}&action=urgence&raison=${encodeURIComponent(raison)}`)
            .then(response => response.text())
            .then(response => {
              document.getElementById("titre").innerText = response;
              document.getElementById('urgence-container').style.display = 'none';
            });
        });

      } else {
        document.getElementById("titre").innerText = response;
      }
    })
    .catch(error => {
      document.getElementById("titre").innerText = "Erreur de connexion 🚫";
      console.error(error);
    });
}
