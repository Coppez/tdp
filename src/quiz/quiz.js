import { getDomande, getDomandaCasuale } from "../../helpers/helper";

class quiz {
    constructor(domande) {
        this.domande = getDomande();
        this.errori = 0;
        this.indiceDomande = 0;
        this.domandeQuiz = [];
        
        for(i = 0; i !== 30; i++) {
            this.domandeQuiz.push(getDomandaCasuale(this.domande))
        }
    }

    getDomandaCorrente() {
       return this.domande[this.indiceDomande];
    }
}