// Spot It Game Logic
class SpotItGame {
    constructor() {
        this.cards = [];
        this.centerCard1 = null;
        this.centerCard2 = null;
        this.score = 0;
        this.timeLeft = 60;
        this.gameTimer = null;
        this.isGameActive = false;
        this.symbolList = ['🍎','🚗','🐶','⭐','🎈','🌵','🎲','🦄','🍕','👻','🎵','⚽','🛴','🦊','🌈','🐸','🎁','🪁','🪐','🐱','🍔','🎨','📚','🐢','🚀','🧸','🎤','👽','🥕','🍄','🐧','🍩','🧃','🛸','🎮','🥑','🔮','📸','🧃','🌻','🌙','🧁','🔔','🐠','🦋','📀','📌','🍇','🍪','🍰','🎓','🐙','🎯','🥎','🎬','🍹'];
        
        // Track clicked symbols
        this.clickedCard1Symbol = null;
        this.clickedCard2Symbol = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    generateSpotItCards(n = 7) {
        const cards = [];

        // First set of n + 1 cards
        for (let i = 0; i <= n; i++) {
            const card = [0];
            for (let j = 1; j <= n; j++) {
                card.push(i * n + j);
            }
            cards.push(card);
        }

        // Remaining n * n cards
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= n; j++) {
                const card = [i]        ;
                for (let k = 1; k <= n; k++) {
                    const val = n + 1 + n * (k - 1) + ((i * (k - 1) + j - 1) % n);
                    card.push(val);
                }
                cards.push(card);
            }
        }

        return cards;
    }

    initializeGame() {
        this.cards = this.generateSpotItCards();
        this.cards = this.shuffleCards(this.cards);
        this.dealNewRound();
        document.getElementById('startBtn').style.display = ''; 
    }

    shuffleCards() {

            let shuffledCards = [];
            let index = 0;

            for (let i = 0; i < this.cards.length; i++) {
                index = Math.floor(Math.random()*this.cards.length);
                shuffledCards.push(this.cards[index]);
                this.cards.splice(index,1);
            }

            return shuffledCards;
    }

    startGame() {
        this.isGameActive = true;
        document.getElementById('startBtn').style.display = 'none'; 
        this.dealNewRound();
        this.updateDisplay();
        this.startTimer();
    }

    dealNewRound() {

        if (this.cards.length > 1) {
            this.centerCard1 = this.cards[this.cards.length-1];
            this.cards.pop();
            this.centerCard2 = this.cards[this.cards.length-1];
            this.cards.pop();
        } else {
            this.centerCard1 = this.cards[this.cards.length-1];
            this.cards.pop();
        }

        this.updateDisplay();
    }

    startTimer() {
        this.timeLeft = 60;
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                clearInterval(this.gameTimer);
                this.endGame();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    handleSymbolClick(cardNumber, symbolIndex) {

        if (!this.isGameActive) {
            return;
        }

        if (cardNumber === 1) {
            this.clickedCard1Symbol = symbolIndex;
        } else if (cardNumber === 2) {
            this.clickedCard2Symbol = symbolIndex;
        }

        if (this.clickedCard1Symbol !== null && this.clickedCard2Symbol !== null) {
            if (this.checkForMatch()) {
                this.dealNewRound();
            }
        }
        
        this.updateDisplay();

    }

    checkForMatch() {

        if (this.centerCard1 && this.centerCard2 && this.clickedCard1Symbol !== null && this.clickedCard2Symbol !== null) {

            const symbol1  = this.centerCard1[this.clickedCard1Symbol];
            const symbol2  = this.centerCard2[this.clickedCard2Symbol];

            if (symbol1 === symbol2) {

                this.score += 1;
                this.centerCard1 = null;
                this.centerCard2 = null;
                this.clickedCard1Symbol = null;
                this.clickedCard2Symbol = null;
                this.timeLeft = 60;
                return true;
            } 
        }

        this.score -= 1;
        return false;
    }
    
    handleWrongClick() {
        this.showFeedback(false, 'Not a match!');
    }

    showFeedback(isCorrect, message = '') {
        this.updateDisplay();
        if (isCorrect) {
            this.showMessage("Correct!");
        } else {
            this.showMessage("Oops!");
        }
    }

    showMessage(message, type) {
        console.log(message);
    }

    endGame() {
        this.isGameActive = false;
        this.gameTimer = null;
        this.updateDisplay();
    }

    resetGame() { 
        this.isGameActive = false;
        this.score = 0;
        this.initializeGame();
        this.setupEventListeners();
    }

    updateDisplay() {

        //regularly update the time shown based on internal timer if the game is active
        if (this.isGameActive) {
            document.getElementById('timer').textContent = '00:' + this.timeLeft;
        } else {
            document.getElementById('timer').textContent = '00:00';
        }

        document.getElementById('score').textContent = this.score;

        // Clear existing cards
        document.getElementById('card1').innerHTML = '';
        document.getElementById('card2').innerHTML = '';

        // Render card1 symbols
        if (this.centerCard1) {
            for (let i = 0; i < this.centerCard1.length; i++) {
                const symbolDiv1 = document.createElement('div');
                symbolDiv1.classList.add('symbol');
                symbolDiv1.textContent = this.symbolList[this.centerCard1[i] % this.symbolList.length];
                symbolDiv1.addEventListener('click', ()=>  this.handleSymbolClick(1,i));
                document.getElementById('card1').appendChild(symbolDiv1);
            }
        }

        // Render card2 symbols
        if (this.centerCard2) {
            for (let i = 0; i < this.centerCard2.length; i++) {
                const symbolDiv2 = document.createElement('div');
                symbolDiv2.classList.add('symbol');
                symbolDiv2.textContent = this.symbolList[this.centerCard2[i] % this.symbolList.length];
                symbolDiv2.addEventListener('click', ()=>  this.handleSymbolClick(2,i));
                document.getElementById('card2').appendChild(symbolDiv2);
            }
        }


        //if it is a match then we refresh the cards and also check if something in the symbol clicks has changed
        //  if (this.checkForMatch()) {

        //      document.getElementById('card1').innerHTML = '';
        //      document.getElementById('card2').innerHTML = '';

        //      for (let i = 0; i < this.centerCard1.length; i++)  {
        //          const symbolDiv1 = document.createElement('div');
        //          symbolDiv1.textContent = this.centerCard1[i];
        //          document.getElementById('card1').appendChild(symbolDiv1);

        //          const symbolDiv2 = document.createElement('div');
        //          symbolDiv2.textContent = this.centerCard2[i];
        //          document.getElementById('card2').appendChild(symbolDiv2);

        //          if (i === this.clickedCard1Symbol) {
        //              symbolDiv1.classList.add('glow');
        //          } 

        //          if (i === this.clickedCard2Symbol) {
        //              symbolDiv2.classList.add('glow');
        //          }
        //      }

        //  }

    }
    

    setupEventListeners() {
       document.getElementById('startBtn').addEventListener('click', () => this.startGame());
       document.getElementById('reshuffleBtn').addEventListener('click', () => this.shuffleCards());
       document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
       document.getElementById('rulesBtn').addEventListener('click', () => this.showRules());
       document.getElementById('settingsBtn').addEventListener('click', () => {
            // Show settings modal or menu
            this.showSettings();
       });

       document.getElementById('closeModalBtn').addEventListener('click', hideModal);
       document.getElementById('overlay').addEventListener('click', hideModal);

    }

    // hideAllButtons() {}

    // showCustomize() {}

    showSettings() {

        const reset = document.getElementById('resetBtn');
        const rules = document.getElementById('rulesBtn');
        reset.style.display = reset.style.display === 'none' ? '' : 'none';
        rules.style.display = rules.style.display === 'none' ? '' : 'none';
    }

    showRules() {
        showModal('<div><p>The rules of the game are very simple. Given two cards, find the matching symbol between both cards!</p></div>');
    }
}

function showModal(contentHtml) {
    document.getElementById('modal-content').innerHTML = contentHtml;
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
}

function hideModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotItGame();
}); 