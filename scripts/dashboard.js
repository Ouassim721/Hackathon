document.addEventListener('DOMContentLoaded', function() {
    const addSponsorButton = document.getElementById('addSponsor');
    const sponsorCardsContainer = document.getElementById('sponsorCards');

    const addSpeakerButton = document.getElementById('addSpeaker');
    const speakerCardsContainer = document.getElementById('speakerCards');

    const addDayButton = document.getElementById('addDay');
    const programDaysContainer = document.getElementById('programDaysContainer');

    const eventForm = document.getElementById('eventForm');

    // Fonction pour ajouter une carte de sponsor
    addSponsorButton.addEventListener('click', function() {
        const sponsorCard = document.createElement('div');
        sponsorCard.className = 'col-12 col-md-6 col-lg-4';
        sponsorCard.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <h6 class="card-title">Sponsor</h6>
                    <div class="mb-3">
                        <label for="sponsorName" class="form-label">Nom du Sponsor</label>
                        <input type="text" class="form-control" name="sponsorName" required>
                    </div>
                    <div class="mb-3">
                        <label for="sponsorDescription" class="form-label">Description</label>
                        <textarea class="form-control" name="sponsorDescription" rows="3" required></textarea>
                    </div>
                </div>
            </div>
        `;
        sponsorCardsContainer.appendChild(sponsorCard);
    });

    // Fonction pour ajouter une carte de speaker
    addSpeakerButton.addEventListener('click', function() {
        const speakerCard = document.createElement('div');
        speakerCard.className = 'col-12 col-md-6 col-lg-4';
        speakerCard.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <h6 class="card-title">Speaker</h6>
                    <div class="mb-3">
                        <label for="speakerName" class="form-label">Nom</label>
                        <input type="text" class="form-control" name="speakerName" required>
                    </div>
                    <div class="mb-3">
                        <label for="speakerSurname" class="form-label">Prénom</label>
                        <input type="text" class="form-control" name="speakerSurname" required>
                    </div>
                    <div class="mb-3">
                        <label for="speakerDescription" class="form-label">Description</label>
                        <textarea class="form-control" name="speakerDescription" rows="3" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="speakerImage" class="form-label">Image</label>
                        <input type="file" class="form-control" name="speakerImage">
                    </div>
                </div>
            </div>
        `;
        speakerCardsContainer.appendChild(speakerCard);
    });

    // Fonction pour ajouter un jour au programme
    addDayButton.addEventListener('click', function() {
        const dayCard = document.createElement('div');
        dayCard.className = 'col-12 col-md-6 col-lg-4';
        dayCard.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <h6 class="card-title">Jour</h6>
                    <div class="mb-3">
                        <label for="dayNumber" class="form-label">Jour</label>
                        <input type="text" class="form-control" name="dayNumber" required>
                    </div>
                    <div class="mb-3">
                        <label for="dayDescription" class="form-label">Description</label>
                        <textarea class="form-control" name="dayDescription" rows="3" required></textarea>
                    </div>
                </div>
            </div>
        `;
        programDaysContainer.appendChild(dayCard);
    });

    // Fonction pour collecter les données et les insérer dans les champs cachés
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche la soumission normale

        const sponsors = Array.from(document.querySelectorAll('#sponsorCards .card-body')).map(card => ({
            name: card.querySelector('input[name="sponsorName"]').value,
            description: card.querySelector('textarea[name="sponsorDescription"]').value
        }));
        const speakers = Array.from(document.querySelectorAll('#speakerCards .card-body')).map(card => ({
            name: card.querySelector('input[name="speakerName"]').value,
            surname: card.querySelector('input[name="speakerSurname"]').value,
            description: card.querySelector('textarea[name="speakerDescription"]').value,
            image: card.querySelector('input[name="speakerImage"]').files[0] // Assuming you'll handle file uploads server-side
        }));
        const days = Array.from(document.querySelectorAll('#programDaysContainer .card-body')).map(card => ({
            number: card.querySelector('input[name="dayNumber"]').value,
            description: card.querySelector('textarea[name="dayDescription"]').value
        }));

        // Préparer les données à envoyer
        document.getElementById('sponsorsData').value = JSON.stringify(sponsors);
        document.getElementById('speakersData').value = JSON.stringify(speakers);
        document.getElementById('programDaysData').value = JSON.stringify(days);

        // Soumettre le formulaire
        eventForm.submit();
    });
});
