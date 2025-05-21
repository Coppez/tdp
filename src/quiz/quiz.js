import { getDomande, getDomandaCasuale } from "../helpers/helpers.js";

class Quiz {
  constructor() {
    this.domande = null;
    this.errori = 0;
    this.indiceDomande = 0;
    this.domandeQuiz = [];
    this.risposteCorretteCount = 0;
    this.inizializzato = false;
    this.domandaCorrente = null;
    this.baseImagePath = "";
  }

  async inizializza() {
    try {
      this.domande = await getDomande();

      for(let i = 0; i < 30; i++) {
        this.domandeQuiz.push(getDomandaCasuale(this.domande));
      }
      
      this.domandaCorrente = this.domandeQuiz[0];
      this.inizializzato = true;
      
      return true;
    } catch (error) {
      console.error("Errore durante l'inizializzazione del quiz:", error);
      return false;
    }
  }

  getDomandaCorrente() {
    return this.domandeQuiz[this.indiceDomande];
  }

  rispondi(risposta) {
    const domandaCorrente = this.getDomandaCorrente();
    const rispostaCorretta = domandaCorrente.a;
    
    const esito = {
      corretta: risposta === rispostaCorretta,
      rispostaCorretta: rispostaCorretta
    };
    
    if (esito.corretta) {
      this.risposteCorretteCount++;
    } else {
      this.errori++;
    }
    
    return esito;
  }

  passaAllaProssimaDomanda() {
    if (this.indiceDomande < this.domandeQuiz.length - 1) {
      this.indiceDomande++;
      return true;
    }
    return false;
  }

  getProgresso() {
    return {
      domandaAttuale: this.indiceDomande + 1,
      totaleDomande: this.domandeQuiz.length,
      percentuale: Math.round(((this.indiceDomande + 1) / this.domandeQuiz.length) * 100)
    };
  }

  getRisultato() {
    return {
      risposteCorrette: this.risposteCorretteCount,
      errori: this.errori,
      totaleDomande: this.domandeQuiz.length,
      percentuale: Math.round((this.risposteCorretteCount / this.domandeQuiz.length) * 100),
      superato: this.errori <= 3
    };
  }

  reset() {
    this.errori = 0;
    this.indiceDomande = 0;
    this.risposteCorretteCount = 0;
    this.domandeQuiz = [];
    return this.inizializza();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const quizApp = new Quiz();
  const quizContainer = document.getElementById('quiz-container');
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const feedbackElement = document.getElementById('feedback');
  const progressBarElement = document.getElementById('progress-bar');
  const progressTextElement = document.getElementById('progress-text');
  const nextButton = document.getElementById('next-button');
  const restartButton = document.getElementById('restart-button');
  const resultContainer = document.getElementById('result-container');
  const imageContainer = document.getElementById('question-image');
  const loadingElement = document.getElementById('loading');
  
  let rispostaData = false;

  function mostraDomanda() {
    if (!quizApp.inizializzato) return;
    
    rispostaData = false;
    const domandaCorrente = quizApp.getDomandaCorrente();

    questionElement.textContent = domandaCorrente.q;

    // Gestione migliorata delle immagini
    if (domandaCorrente.img) {
      // Verifica se l'URL dell'immagine è valido
      const imgUrl = domandaCorrente.img;
      
      // Crea un elemento immagine con gestione degli errori
      imageContainer.innerHTML = '';
      const imgElement = document.createElement('img');
      imgElement.src = imgUrl;
      imgElement.alt = "Immagine domanda";
      imgElement.className = "img-fluid";
      
      // Gestione degli errori di caricamento dell'immagine
      imgElement.onerror = function() {
        console.error(`Errore nel caricamento dell'immagine: ${imgUrl}`);
        imageContainer.innerHTML = `
          <div class="image-placeholder">
            <i class="fas fa-image"></i>
            <p>Immagine non disponibile</p>
          </div>
        `;
      };

      imgElement.onload = function() {
        imageContainer.classList.remove('d-none');
      };
      
      imageContainer.appendChild(imgElement);
    } else {
      imageContainer.innerHTML = '';
      imageContainer.classList.add('d-none');
    }

    optionsElement.innerHTML = `
      <div class="quiz-options">
        <div class="option">
          <input type="radio" name="quiz-option" id="option-true" value="true">
          <label for="option-true">Vero</label>
        </div>
        <div class="option">
          <input type="radio" name="quiz-option" id="option-false" value="false">
          <label for="option-false">Falso</label>
        </div>
      </div>
    `;

    feedbackElement.innerHTML = '';
    feedbackElement.className = 'quiz-feedback';
    feedbackElement.style.display = 'none';

    const progresso = quizApp.getProgresso();
    progressBarElement.style.width = `${progresso.percentuale}%`;
    progressTextElement.textContent = `Domanda ${progresso.domandaAttuale} di ${progresso.totaleDomande}`;

    if (progresso.domandaAttuale === progresso.totaleDomande) {
      nextButton.textContent = 'Vedi Risultato';
    } else {
      nextButton.textContent = 'Prossima Domanda';
    }

    document.querySelectorAll('input[name="quiz-option"]').forEach(option => {
      option.addEventListener('change', verificaRisposta);
    });
  }

  function verificaRisposta(event) {
    if (rispostaData) return;
    
    rispostaData = true;
    const rispostaSelezionata = event.target.value === 'true';
    const esito = quizApp.rispondi(rispostaSelezionata);

    feedbackElement.style.display = 'block';
    
    if (esito.corretta) {
      feedbackElement.innerHTML = '<i class="fas fa-check-circle"></i> Risposta corretta!';
      feedbackElement.className = 'quiz-feedback quiz-correct';
    } else {
      feedbackElement.innerHTML = `<i class="fas fa-times-circle"></i> Risposta errata! La risposta corretta è: ${esito.rispostaCorretta ? 'Vero' : 'Falso'}`;
      feedbackElement.className = 'quiz-feedback quiz-incorrect';
      
    }

    document.querySelectorAll('input[name="quiz-option"]').forEach(option => {
        option.disabled = true;
      });
    nextButton.disabled = false;
  }
  
  function prossimaDomanda() {
    if (!rispostaData) {
      alert('Seleziona una risposta prima di procedere.');
      return;
    }
    
    const altreDisponibili = quizApp.passaAllaProssimaDomanda();
    
    if (altreDisponibili) {
        document.querySelectorAll('input[name="quiz-option"]').forEach(option => {
            option.disabled = true;
            });
        mostraDomanda();
        nextButton.disabled = true;
    } else {
        mostraRisultati();
    }
  }

  function mostraRisultati() {
    const risultato = quizApp.getRisultato();
    
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    let messaggioEsito = '';
    if (risultato.superato) {
      messaggioEsito = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> Congratulazioni! Hai superato il quiz.</div>';
    } else {
      messaggioEsito = '<div class="alert alert-danger"><i class="fas fa-times-circle"></i> Non hai superato il quiz. Riprova!</div>';
    }
    
    resultContainer.innerHTML = `
      <div class="section-header">
        <h2>Risultato Finale</h2>
      </div>
      ${messaggioEsito}
      <div class="result-details">
        <p>Risposte corrette: <strong>${risultato.risposteCorrette} su ${risultato.totaleDomande}</strong></p>
        <p>Errori: <strong>${risultato.errori}</strong></p>
        <p>Percentuale di risposte corrette: <strong>${risultato.percentuale}%</strong></p>
      </div>
      <button id="restart-quiz" class="btn btn-primary mt-3">Ricomincia Quiz</button>
    `;
    
    document.getElementById('restart-quiz').addEventListener('click', ricominciQuiz);
  }
  
  async function ricominciQuiz() {
    resultContainer.style.display = 'none';
    loadingElement.style.display = 'block';
    
    await quizApp.reset();
    
    loadingElement.style.display = 'none';
    quizContainer.style.display = 'block';
    mostraDomanda();
    nextButton.disabled = true;
  }
  
  nextButton.addEventListener('click', prossimaDomanda);
  
  loadingElement.style.display = 'block';
  
  try {
    await quizApp.inizializza();
    loadingElement.style.display = 'none';
    quizContainer.style.display = 'block';
    mostraDomanda();
    nextButton.disabled = true;
  } catch (error) {
    console.error("Errore durante l'inizializzazione del quiz:", error);
    loadingElement.innerHTML = `
      <div class="alert alert-danger">
        <p>Errore nel caricamento del quiz. Riprova più tardi.</p>
        <p>Dettaglio errore: ${error.message}</p>
      </div>
    `;
  }
});

export default Quiz;
