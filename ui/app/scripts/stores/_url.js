export default URL = {
    // Questions
    answer: 'api/answers/:answerId',
    answers: 'api/questions/:questionId/answers',
    question: 'api/questions/:questionId',
    questions: 'api/questions',

    // Votes
    voteAnswer: 'api/answers/:answerId/votes',
    voteQuestion: 'api/questions/:questionId/votes',

    // Authentication
    authenticated: 'api/authenticated',
    init: 'api/init',
    login: 'api/login',
    logout: 'api/logout'
};
