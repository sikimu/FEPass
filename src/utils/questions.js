import algorithmQuestions from '../data/questions/technology_algorithm.json';
import computerQuestions from '../data/questions/technology_computer.json';
import osQuestions from '../data/questions/technology_os.json';
import networkQuestions from '../data/questions/technology_network.json';
import securityQuestions from '../data/questions/technology_security.json';
import databaseQuestions from '../data/questions/technology_database.json';
import managementQuestions from '../data/questions/management.json';
import strategyQuestions from '../data/questions/strategy.json';

export const ALL_QUESTIONS = [
  ...algorithmQuestions,
  ...computerQuestions,
  ...osQuestions,
  ...networkQuestions,
  ...securityQuestions,
  ...databaseQuestions,
  ...managementQuestions,
  ...strategyQuestions,
];

export function getQuestionsBySubcategory(subcategory) {
  return ALL_QUESTIONS.filter(q => q.subcategory === subcategory);
}

export function getQuestionsByCategory(category) {
  return ALL_QUESTIONS.filter(q => q.category === category);
}

export function getRandomQuestions(count = 10, filter = {}) {
  let pool = ALL_QUESTIONS;
  if (filter.category) pool = pool.filter(q => q.category === filter.category);
  if (filter.subcategory) pool = pool.filter(q => q.subcategory === filter.subcategory);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getUniqueSubcategories() {
  return [...new Set(ALL_QUESTIONS.map(q => q.subcategory))];
}

export function getUniqueCategories() {
  return [...new Set(ALL_QUESTIONS.map(q => q.category))];
}
