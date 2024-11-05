const storyElement = document.getElementById("story");
const choicesElement = document.getElementById("choices");
const inventoryList = document.getElementById("inventory-list");
const restartButton = document.getElementById("restart");

let inventory = [];
let state = {};

// Estrutura das cenas do jogo
const scenes = {
  start: {
    text: "Você acorda em uma floresta misteriosa e percebe que está perdido. Há um caminho à esquerda que leva a uma clareira e um à direita que leva a uma montanha.",
    choices: [
      { text: "Ir para a clareira", nextScene: "clearing" },
      { text: "Subir a montanha", nextScene: "mountain" }
    ]
  },
  clearing: {
    text: "Na clareira, você encontra uma espada brilhante no chão. Pode pegar a espada ou continuar explorando.",
    choices: [
      { text: "Pegar a espada", nextScene: "takeSword" },
      { text: "Continuar sem a espada", nextScene: "lake" }
    ]
  },
  mountain: {
    text: "Ao subir a montanha, você vê um castelo ao longe. No entanto, a subida é difícil e perigosa. Você quer continuar ou voltar?",
    choices: [
      { text: "Continuar subindo", nextScene: "castle" },
      { text: "Voltar", nextScene: "start" }
    ]
  },
  takeSword: {
    text: "Você pega a espada. Agora se sente mais seguro. À sua frente há um lago.",
    choices: [
      { text: "Ir até o lago", nextScene: "lake" }
    ],
    action: () => addToInventory("Espada")
  },
  lake: {
    text: "Você chega a um lago. Uma ponte velha atravessa o lago, mas parece instável. Você pode tentar atravessar ou procurar outro caminho.",
    choices: [
      { text: "Atravessar a ponte", nextScene: "bridge" },
      { text: "Procurar outro caminho", nextScene: "forestPath" }
    ]
  },
  bridge: {
    text: "A ponte quebra e você cai na água. Sem a espada, a aventura termina aqui.",
    choices: [],
    action: () => {
      if (!inventory.includes("Espada")) {
        endGame("Você caiu no lago e se afogou sem a espada para te ajudar a nadar. Fim de jogo.");
      } else {
        storyElement.innerText = "Com a espada, você consegue se segurar nas pedras e nadar até a margem oposta.";
        nextScene("castle");
      }
    }
  },
  forestPath: {
    text: "Você encontra um caminho escondido que leva ao castelo.",
    choices: [
      { text: "Seguir pelo caminho", nextScene: "castle" }
    ]
  },
  castle: {
    text: "Você chega ao castelo. O portão está trancado, mas há uma janela aberta. Você quer entrar?",
    choices: [
      { text: "Entrar pela janela", nextScene: "finalChallenge" },
      { text: "Dar meia-volta", nextScene: "start" }
    ]
  },
  finalChallenge: {
    text: "Dentro do castelo, um dragão está protegendo um baú. Você pode lutar ou fugir.",
    choices: [
      { text: "Lutar com o dragão", nextScene: "fightDragon" },
      { text: "Fugir", nextScene: "start" }
    ]
  },
  fightDragon: {
    text: "Você ataca o dragão!",
    choices: [],
    action: () => {
      if (inventory.includes("Espada")) {
        endGame("Com a espada, você derrota o dragão e abre o baú, encontrando um tesouro. Parabéns, você venceu!");
      } else {
        endGame("Sem uma arma, você é derrotado pelo dragão. Fim de jogo.");
      }
    }
  }
};

// Função para iniciar o jogo
function startGame() {
  state = {};
  inventory = [];
  updateInventory();
  restartButton.style.display = "none";
  showScene("start");
}

// Função para exibir a cena atual
function showScene(sceneKey) {
  const scene = scenes[sceneKey];
  storyElement.innerText = scene.text;
  choicesElement.innerHTML = "";

  if (scene.action) scene.action();

  scene.choices.forEach(choice => {
    const button = document.createElement("button");
    button.innerText = choice.text;
    button.onclick = () => showScene(choice.nextScene);
    choicesElement.appendChild(button);
  });

  if (scene.choices.length === 0) {
    restartButton.style.display = "block";
  }
}

// Função para adicionar itens ao inventário
function addToInventory(item) {
  if (!inventory.includes(item)) {
    inventory.push(item);
    updateInventory();
  }
}

// Função para atualizar a exibição do inventário
function updateInventory() {
  inventoryList.innerHTML = "";
  inventory.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    inventoryList.appendChild(li);
  });
}

// Função para encerrar o jogo
function endGame(message) {
  storyElement.innerText = message;
  choicesElement.innerHTML = "";
  restartButton.style.display = "block";
}

// Inicia o jogo ao carregar a página
startGame();
