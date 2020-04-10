const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const gameLimit = 25;
const users = ["Alexa The Bot", "Andre"];

const getDefaultGameState = () => ({
  currentTurn: null,
  total: null,
  gameLimit: gameLimit,
  allOptions: options,
  availibleOptions: options,
  usedOptions: [],
  history: [],
  gameIsOver: false,
  lastMove: null,
});

let gameState;
let gameElements;

const getTotalElement = () => document.getElementById("total");
const getCurrentUserTurnElement = () =>
  document.getElementById("currentUserTurn");
const getTurnOptionsElement = () => document.getElementById("turnOptions");
const getTurnHistoryElement = () => document.getElementById("turnHistory");

const updateHistory = (user, option) => {
  const currentHistoty = gameState.history;
  const newRecord = { user, option };
  return [...currentHistoty, newRecord];
};

const renderHistory = () => {
  const history = gameState.history;
  const historyElement = gameElements.turnHistoryElement;
  historyElement.innerHTML = history
    .map(
      (historyObj) => `${historyObj.user} поставил гирю: ${historyObj.option}`
    )
    .join("<br/>");
};

const renderTotal = () => {
  const totalElement = gameElements.totalElement;
  const total = gameState.total;
  totalElement.textContent = total;
};

const renderCurrentTurn = () => {
  const user = users[gameState.currentTurn];
  const currentUserTurnElement = gameElements.currentUserTurnElement;
  currentUserTurnElement.textContent = user;
};

const render = () => {
  renderHistory();
  renderTotal();
  renderCurrentTurn();
};

const checkGameOver = () => {
  const total = gameState.total;
  const user = users[gameState.currentTurn];

  if (total > gameState.gameLimit) {
    const newGameState = {
      ...gameState,
      gameIsOver: true,
    };
    gameState = newGameState;

    gameElements.options.map((option) => option.setAttribute("disabled", true));
    gameElements.turnHistoryElement.innerHTML =
      gameElements.turnHistoryElement.innerHTML +
      `<div class="alert alert-success"> Game is won by ${user} </div>`;
  }
};

const getRandomArrayEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

const botMakeDecision = () => {
  if (!gameState.lastMove && gameState.availibleOptions.includes(5)) return 5;
  return 10 - gameState.lastMove;
};

const botMakeTurn = () => {
  setTimeout(makeTurn(botMakeDecision()), 2000);
};

const makeTurn = (option) => {
  const user = users[gameState.currentTurn];

  const newGameState = {
    ...gameState,
    currentTurn: (gameState.currentTurn + 1) % 2,
    total: gameState.total + option,
    history: updateHistory(user, option),
    availibleOptions: gameState.availibleOptions.filter(
      (item) => item !== option
    ),
    lastMove: option,
  };
  gameState = newGameState;
  render();
  checkGameOver();
  if (user === "Alexa The Bot") {
    return;
  }
  if (gameState.gameIsOver) return;
  botMakeTurn();
};

const onOptionClick = (option, element) => {
  element.setAttribute("disabled", true);
  makeTurn(option);
};

const createOption = (option) => {
  const element = document.createElement("button");
  element.setAttribute("class", "btn btn-outline-dark");
  element.textContent = option;
  element.addEventListener("click", () => onOptionClick(option, element));
  return element;
};
const createOptions = () => options.map(createOption);

const getGameElements = () => ({
  totalElement: getTotalElement(),
  currentUserTurnElement: getCurrentUserTurnElement(),
  turnOptionsElement: getTurnOptionsElement(),
  turnHistoryElement: getTurnHistoryElement(),
  options: createOptions(),
});

const renderOptions = () => {
  const options = gameElements.options;
  const turnOptionsElement = gameElements.turnOptionsElement;

  options.forEach((option) => {
    turnOptionsElement.appendChild(option);
  });
};

const initGame = () => {
  gameState = getDefaultGameState();
  gameElements = getGameElements();
  gameState.currentTurn = 0;
  gameState.total = 0;
  renderOptions();
  render();
  botMakeTurn();
};

initGame();
