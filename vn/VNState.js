export const VNState = {
  // Quiz data
  questions: [],
  personalities: [],

  // Current position
  currentQuestion: 0,

  // One answer per question
  answers: [],

  // Calculated results
  results: [],

  /**
   * Initialize a new quiz session
   */
  init({ questions, personalities }) {
    this.questions = [...questions];
    this.personalities = [...personalities];

    this.currentQuestion = 0;
    this.answers = new Array(this.questions.length).fill(null);
    this.results = [];
  },

  /**
   * Current question object
   */
  getCurrentQuestion() {
    return this.questions[this.currentQuestion] ?? null;
  },

  /**
   * Total number of questions
   */
  getQuestionCount() {
    return this.questions.length;
  },

  /**
   * Current question index
   */
  getCurrentIndex() {
    return this.currentQuestion;
  },

  /**
   * Navigation
   */
  hasPrevious() {
    return this.currentQuestion > 0;
  },

  hasNext() {
    return this.currentQuestion < this.questions.length - 1;
  },

  nextQuestion() {
    if (this.hasNext()) {
      this.currentQuestion++;
    }
  },

  previousQuestion() {
    if (this.hasPrevious()) {
      this.currentQuestion--;
    }
  },

  /**
   * Answers
   */
  setAnswer(index, value) {
    this.answers[index] = value;
  },

  getAnswer(index) {
    return this.answers[index] ?? null;
  },

  getAnswers() {
    return [...this.answers];
  },

  /**
   * Results
   */
  setResults(results) {
    this.results = [...results];
  },

  getResults() {
    return [...this.results];
  },

  /**
   * Reset current playthrough
   */
  reset() {
    this.currentQuestion = 0;
    this.answers = new Array(this.questions.length).fill(null);
    this.results = [];
  },
};
