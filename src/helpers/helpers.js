const BASE_IMAGE_URL = 'https://raw.githubusercontent.com/Ed0ardo/QuizPatenteB/main';

export async function getDomande(link = 'https://raw.githubusercontent.com/Ed0ardo/QuizPatenteB/refs/heads/main/quizPatenteB2023.json') {
    const r = await fetch(link);
    if (!r.ok) {
        throw new Error('Error fetching the quiz');
    }
    const data = await r.json();

    return data;
}

export function getDomandaCasuale(data) {
    const categories = Object.values(data)[0];
    const categoryKeys = Object.keys(categories);

    const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const questions = categories[randomCategoryKey];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    let imgPath = null;
    if (randomQuestion.img) {
        imgPath = randomQuestion.img;
        
        if (imgPath && !imgPath.startsWith('http')) {
            if (imgPath.startsWith('/')) {
                imgPath = imgPath.substring(1);
            }
            
            imgPath = `${BASE_IMAGE_URL}/${imgPath}`;
        }
    }

    return {
        img: imgPath,
        q: randomQuestion.q,
        a: randomQuestion.a
    };
    }

export async function verifyImageUrl(url) {
    if (!url) return false;
    
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log("ok");
        return response.ok;
    } catch (error) {
        console.error(`Errore nel verificare l'URL dell'immagine ${url}:`, error);
        return false;
    }
}
