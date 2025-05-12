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
  
    return {
      img: randomQuestion.img || null,
      q: randomQuestion.q,
      a: randomQuestion.a
    };
  }
  