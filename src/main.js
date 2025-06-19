import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import './style.css';

const supabase = createClient(
  'https://sueahkavaigvtwqamnxm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZWFoa2F2YWlndnR3cWFtbnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDQ5NTYsImV4cCI6MjA2NDM4MDk1Nn0.6zkizLKYR_58MtXeMiILpAAEDWm2KkkIAnyuPsqcIws'
);

let sort = 'created_at.desc';

async function fetchArticles() {
  const { data, error } = await supabase
    .from('article')
    .select('*')
    .order(...sort.split('.'));

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById('article-list');
  list.innerHTML = '';
  data.forEach(article => {
    const item = document.createElement('div');
    item.innerHTML = `
      <h3>${article.title}</h3>
      <h4>${article.subtitle}</h4>
      <p><strong>${article.author}</strong> | ${format(new Date(article.created_at), 'dd-MM-yyyy')}</p>
      <p>${article.content}</p>
      <hr />
    `;
    list.appendChild(item);
  });
}

fetchArticles();

document.getElementById('sort-select').addEventListener('change', (e) => {
  sort = e.target.value;
  fetchArticles();
});

document.getElementById('article-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const article = {
    title: form.title.value,
    subtitle: form.subtitle.value,
    author: form.author.value,
    content: form.content.value,
    created_at: form.created_at.value || new Date().toISOString()
  };

  const { error } = await supabase.from('article').insert([article]);

  if (error) {
    alert('Błąd!');
    console.error("Błąd Supabase:", error.message, error.details);
  } else {
    alert('Dodano!');
    form.reset();
    fetchArticles();
  }
});
