let map;
let markers = [];

// Funzione per inizializzare la mappa
function initMap() {
    // Imposta la posizione iniziale sulla mappa (es. Parma)
    map = L.map('map').setView([44.7919, 10.3279], 12); // Coordinate di Parma

    // Aggiungi il layer di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Funzione per cercare autoscuole nelle vicinanze
async function cercaAutoscuole() {
    const indirizzo = document.getElementById("indirizzo").value || "Parma";

    caricamento.style.display = "block";
    caricamento.innerHTML = "<span>Caricamento...</span>";

    // Geocodifica con Nominatim per ottenere le coordinate di una città

    await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${indirizzo}`)
        .then(response => response.json())
        .then(async data => {
            if (data && data[0]) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                
                // Centra la mappa sulla posizione trovata
                map.setView([lat, lon], 12);

                // Ricerca delle autoscuole nelle vicinanze usando Overpass API
                await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="driving_school"](around:10000,${lat},${lon});way["amenity"="driving_school"](around:10000,${lat},${lon});relation["amenity"="driving_school"](around:10000,${lat},${lon}););out center;`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.elements) {
                            // Rimuovi marker precedenti
                            markers.forEach(marker => map.removeLayer(marker));
                            markers = [];

                            // Aggiungi marker per ogni autoscuola trovata
                            data.elements.forEach(element => {
                                const autoLat = element.lat;
                                const autoLon = element.lon;
                                const name = element.tags ? element.tags.name : "Autoscuola";

                                const marker = L.marker([autoLat, autoLon]).addTo(map)
                                    .bindPopup(`<b>${name}</b><br>Lat: ${autoLat}, Lon: ${autoLon}`);
                                markers.push(marker);
                            });
                        } else {
                            alert("Nessuna autoscuola trovata nelle vicinanze.");
                            caricamento.style.color = "red";
                            caricamento.style.borderColor = "red";
                            caricamento.innerHTML = "Nessuna autoscuola trovata";
                        }
                        if (markers.length != 0) {
                            caricamento.style.color = "green";
                            caricamento.style.borderColor = "green";
                            caricamento.innerHTML = `Trovate: ${markers.length} Autoscuole`;
                        } else {
                            caricamento.style.color = "red";
                            caricamento.style.borderColor = "red";
                            caricamento.innerHTML = "Nessuna autoscuola trovata";
                        }
                        
                    })
                    .catch(error => {
                        console.error("Errore nell'ottenere dati dalle API:", error);
                        caricamento.style.color = "red";
                        caricamento.style.borderColor = "red";
                        caricamento.innerHTML = "Nessuna autoscuola trovata";
                    });
            } else {
                alert("Indirizzo non trovato.");
                caricamento.style.color = "red";
                caricamento.style.borderColor = "red";
                caricamento.innerHTML = "Nessuna autoscuola trovata";
            }
        })
        .catch(error => {
            console.error("Errore nella geocodifica:", error);
            alert("Errore nella geocodifica dell'indirizzo.");
            caricamento.style.color = "red";
            caricamento.style.borderColor = "red";
            caricamento.innerHTML = "Nessuna autoscuola trovata";
        });

}
const caricamento = document.getElementById("map-message");
caricamento.style.display = "none";
window.onload = initMap;
