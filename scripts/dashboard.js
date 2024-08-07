// public/scripts/dashboard.js

document.addEventListener('DOMContentLoaded', function() {
  // Gestion des Sponsors
  let sponsorCount = 0;
  const sponsorCardsContainer = document.getElementById('sponsorCards');
  const addSponsorButton = document.getElementById('addSponsor');

  addSponsorButton.addEventListener('click', function() {
      sponsorCount++;

      // Créer une nouvelle carte de sponsor
      const newSponsorCard = document.createElement('div');
      newSponsorCard.classList.add('col-md-6', 'col-lg-4', 'col-xl-3'); // Classes Bootstrap pour la grille
      newSponsorCard.innerHTML = `
          <div class="card card-sponsor mb-3">
              <div class="card-body">
                  <h5 class="card-title">Sponsor ${sponsorCount}</h5>
                  <form action="/admin/add-sponsor" method="POST" class="sponsor-form">
                      <div class="mb-3">
                          <label for="sponsorName${sponsorCount}" class="form-label">Nom du Sponsor</label>
                          <input type="text" class="form-control" id="sponsorName${sponsorCount}" name="sponsors[${sponsorCount - 1}][name]" required>
                      </div>
                      <div class="mb-3">
                          <label for="sponsorDescription${sponsorCount}" class="form-label">Description du Sponsor</label>
                          <textarea class="form-control" id="sponsorDescription${sponsorCount}" name="sponsors[${sponsorCount - 1}][description]" rows="2" required></textarea>
                      </div>
                      <button type="button" class="btn btn-danger remove-sponsor">Supprimer</button>
                  </form>
              </div>
          </div>
      `;
      
      sponsorCardsContainer.appendChild(newSponsorCard);
  });

  sponsorCardsContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('remove-sponsor')) {
          event.target.closest('.col-md-6').remove(); // Assure la suppression de la carte entière
          // Met à jour les numéros des sponsors après suppression
          updateSponsorNumbers();
      }
  });

  function updateSponsorNumbers() {
      const sponsorCards = sponsorCardsContainer.querySelectorAll('.card');
      sponsorCards.forEach((card, index) => {
          const title = card.querySelector('.card-title');
          const nameInput = card.querySelector('input[name^="sponsors["]');
          const descriptionTextarea = card.querySelector('textarea[name^="sponsors["]');
          
          title.textContent = `Sponsor ${index + 1}`;
          nameInput.id = `sponsorName${index + 1}`;
          nameInput.name = `sponsors[${index}][name]`;
          descriptionTextarea.id = `sponsorDescription${index + 1}`;
          descriptionTextarea.name = `sponsors[${index}][description]`;
      });
      sponsorCount = sponsorCards.length;
  }

  // Gestion des Speakers
  let speakerCount = 0;
  const speakerCardsContainer = document.getElementById('speakerCards');
  const addSpeakerButton = document.getElementById('addSpeaker');

  function createSpeakerCard() {
      speakerCount++;
      const card = document.createElement('div');
      card.classList.add('col-md-6', 'col-lg-4', 'mb-4');
      card.innerHTML = `
          <div class="card bg-secondary text-light">
              <div class="card-body">
                  <h5 class="card-title">Speaker ${speakerCount}</h5>
                  <div class="mb-3">
                      <label for="speakerName${speakerCount}" class="form-label">Nom du Speaker</label>
                      <input type="text" class="form-control" id="speakerName${speakerCount}" name="speakers[${speakerCount - 1}][name]" required>
                  </div>
                  <div class="mb-3">
                      <label for="speakerSurname${speakerCount}" class="form-label">Prénom du Speaker</label>
                      <input type="text" class="form-control" id="speakerSurname${speakerCount}" name="speakers[${speakerCount - 1}][surname]" required>
                  </div>
                  <div class="mb-3">
                      <label for="speakerImage${speakerCount}" class="form-label">Image du Speaker</label>
                      <input type="file" class="form-control" id="speakerImage${speakerCount}" name="speakers[${speakerCount - 1}][image]" accept="image/*">
                  </div>
                  <div class="mb-3">
                      <label for="speakerDescription${speakerCount}" class="form-label">Description du Speaker</label>
                      <textarea class="form-control" id="speakerDescription${speakerCount}" name="speakers[${speakerCount - 1}][description]" rows="2" required></textarea>
                  </div>
                  <button type="button" class="btn btn-danger btn-sm remove-speaker">Supprimer</button>
              </div>
          </div>
      `;
      speakerCardsContainer.appendChild(card);
  }

  function removeSpeakerCard(button) {
      const card = button.closest('.col-md-6');
      card.remove(); // Utilisez remove() pour supprimer la carte
      // Met à jour les numéros des speakers après suppression
      updateSpeakerNumbers();
  }

  function updateSpeakerNumbers() {
      const speakerCards = speakerCardsContainer.querySelectorAll('.card');
      speakerCards.forEach((card, index) => {
          const title = card.querySelector('.card-title');
          const nameInput = card.querySelector('input[name^="speakers["]');
          const surnameInput = card.querySelector('input[name^="speakers["][name$="surname"]');
          const imageInput = card.querySelector('input[name^="speakers["][name$="image"]');
          const descriptionTextarea = card.querySelector('textarea[name^="speakers["]');
          
          title.textContent = `Speaker ${index + 1}`;
          nameInput.id = `speakerName${index + 1}`;
          nameInput.name = `speakers[${index}][name]`;
          surnameInput.id = `speakerSurname${index + 1}`;
          surnameInput.name = `speakers[${index}][surname]`;
          imageInput.id = `speakerImage${index + 1}`;
          imageInput.name = `speakers[${index}][image]`;
          descriptionTextarea.id = `speakerDescription${index + 1}`;
          descriptionTextarea.name = `speakers[${index}][description]`;
      });
      speakerCount = speakerCards.length;
  }

  addSpeakerButton.addEventListener('click', function () {
      createSpeakerCard();
  });

  speakerCardsContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('remove-speaker')) {
          removeSpeakerCard(event.target);
      }
  });

  // Gestion des Programmes
  let dayCount = 0;
  const programDaysContainer = document.getElementById('programDaysContainer');
  const addDayButton = document.getElementById('addDay');

  addDayButton.addEventListener('click', function() {
      dayCount++;

      // Créer une nouvelle carte de jour
      const newDayCard = document.createElement('div');
      newDayCard.classList.add('col-md-6', 'col-lg-4', 'mb-4');
      newDayCard.innerHTML = `
          <div class="card bg-light">
              <div class="card-body">
                  <h5 class="card-title">Jour ${dayCount}</h5>
                  <div class="mb-3">
                      <label for="dayDate${dayCount}" class="form-label">Date</label>
                      <input type="date" class="form-control" id="dayDate${dayCount}" name="days[${dayCount - 1}][date]" required>
                  </div>
                  <div class="mb-3">
                      <label for="dayDescription${dayCount}" class="form-label">Description</label>
                      <textarea class="form-control" id="dayDescription${dayCount}" name="days[${dayCount - 1}][description]" rows="2" required></textarea>
                  </div>
                  <button type="button" class="btn btn-danger btn-sm remove-day">Supprimer</button>
              </div>
          </div>
      `;

      programDaysContainer.appendChild(newDayCard);
  });

  programDaysContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('remove-day')) {
          event.target.closest('.col-md-6').remove();
          // Met à jour les numéros des jours après suppression
          updateDayNumbers();
      }
  });

  function updateDayNumbers() {
      const dayCards = programDaysContainer.querySelectorAll('.card');
      dayCards.forEach((card, index) => {
          const title = card.querySelector('.card-title');
          const dateInput = card.querySelector('input[type="date"]');
          const descriptionTextarea = card.querySelector('textarea');
          
          title.textContent = `Jour ${index + 1}`;
          dateInput.id = `dayDate${index + 1}`;
          dateInput.name = `days[${index}][date]`;
          descriptionTextarea.id = `dayDescription${index + 1}`;
          descriptionTextarea.name = `days[${index}][description]`;
      });
      dayCount = dayCards.length;
  }
});
