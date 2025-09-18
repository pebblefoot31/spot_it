// Spot It Game Logic
class SpotItGame {
    constructor() {
        this.cards = [];
        this.playerCards = [];
        this.centerCard1 = null;
        this.centerCard2 = null;
        this.symbolsPerCard = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.gameTimer = null;
        this.isGameActive = false;
        this.symbolList = ['🍎','🚗','🐶','⭐','🎈','🌵','🎲','🦄','🍕','👻','🎵','⚽','🛴','🦊','🌈','🐸','🎁','🪁','🪐','🐱','🍔','🎨','📚','🐢','🚀','🧸','🎤','👽','🥕','🍄','🐧','🍩','🧃','🛸','🎮','🥑','🔮','📸','🌻','🌙','🧁','🔔','🐠','🦋','📀','📌','🍇','🍪','🍰','🎓','🐙','🎯','🥎','🎬','🍹','🦜','🦒','🦁','🐯','🐨','🐼','🦘','🦡','🦔','🐿️','🦦','🦥','🐑','🐐','🐪','🦙','🦌','🐕','🐩','🐈','🐈‍⬛','🐓','🦃','🦚','🦜','🦢','🦩','🦨','🦝','🦡','🦔','🐿️','🦦','🦥','🐑','🐐','🐪','🦙','🦌','🐕','🐩','🐈','🐈‍⬛','🐓','🦃','🦚','🦜','🦢','🦩','🦨','🦝'];
        
        // Track clicked symbols
        this.clickedCard1Symbol = null;
        this.clickedCard2Symbol = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    generateSpotItCards(n = 7) {
        const cards = [];
        this.symbolsPerCard = n + 1; // 8 symbols per card
        
        // Create a finite projective plane of order n
        // This ensures each card has unique symbols and any two cards share exactly one symbol
        
        // First card: [0, 1, 2, 3, 4, 5, 6, 7]
        const firstCard = [];
        for (let i = 0; i <= n; i++) {
            firstCard.push(i);
        }
        cards.push(firstCard);
        
        // Generate remaining cards using the projective plane construction
        for (let i = 1; i <= n; i++) {
            for (let j = 0; j < n; j++) {
                const card = [i];
                for (let k = 0; k < n; k++) {
                    const symbol = n + 1 + k * n + ((i * k + j) % n);
                    card.push(symbol);
                }
                cards.push(card);
            }
        }
        
        return cards;
    }

    initializeGame() {
        this.cards = this.shuffleCards(this.generateSpotItCards());
        this.dealNewRound();
    }

    shuffleCards(cards) {



        let shuffled = [...cards];

        for (let i = shuffled.length-1; i > 0; i--) {
            let j = Math.floor(Math.random()*(i+1));
            [shuffled[i],shuffled[j]] = [shuffled[j],shuffled[i]];
        }

        return shuffled;
    }

    startGame() {
        document.getElementById('startBtn').classList.add('hidden');
        this.isGameActive = true;
        this.dealNewRound();
        this.updateDisplay();
        this.startTimer();
    }

    dealNewRound() {

        if (this.cards.length >= 2) {
            this.centerCard1 = this.cards.pop();
            this.centerCard2 = this.cards.pop();
        } else if (this.cards.length === 1) {
            this.centerCard1 = this.cards.pop();
            this.centerCard2 = this.playerCards[this.playerCards.length-1]; //take the top card from the player cards when deck only has one card left
            console.log("Just reached the final card in the deck.");
        } else {
            console.log("Ending game.");
            this.endGame();
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

                if (this.cards.length === 0) {
                    this.endGame();
                    return;
                }

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

                this.score += 5*this.timeLeft;
                this.playerCards.push(this.centerCard1);
                this.playerCards.push(this.centerCard2);


                this.centerCard1 = null;
                this.centerCard2 = null;
                this.clickedCard1Symbol = null;
                this.clickedCard2Symbol = null;
                this.timeLeft = 60;
                return true;
            } 
        }

        this.score -= 150;
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
        showModal('<div><p>The game is over!</p></div>');
    }

    resetGame() { 
        document.getElementById('startBtn').classList.remove('hidden');
        this.isGameActive = false;
        this.score = 0;
        this.initializeGame();
    }

    updateDisplay() {

        //regularly update the time shown based on internal timer if the game is active
        if (this.isGameActive) {
            document.getElementById('timer').textContent = '00:' + this.timeLeft;
        } else {
            document.getElementById('timer').textContent = '00:00';
        }

        const scoreElement = document.getElementById('score');
        const oldScore = parseInt(scoreElement.textContent) || 0;
        scoreElement.textContent = this.score;
        
        // Add animation if score changed
        if (oldScore !== this.score) {
            scoreElement.classList.add('score-change');
            setTimeout(() => {
                scoreElement.classList.remove('score-change');
            }, 600);
        }

        // Clear existing cards
        document.getElementById('card1').innerHTML = '';
        document.getElementById('card2').innerHTML = '';

        // Render card1 symbols
        if (this.centerCard1) {
            for (let i = 0; i < this.symbolsPerCard; i++) {
                const symbolDiv1 = document.createElement('div');
                symbolDiv1.classList.add('symbol');
                symbolDiv1.textContent = this.symbolList[this.centerCard1[i] % this.symbolList.length];
                symbolDiv1.addEventListener('click', ()=>  this.handleSymbolClick(1,i));
                document.getElementById('card1').appendChild(symbolDiv1);
            }
        }

        // Render card2 symbols
        if (this.centerCard2) {
            for (let i = 0; i < this.symbolsPerCard; i++) {
                const symbolDiv2 = document.createElement('div');
                symbolDiv2.classList.add('symbol');
                symbolDiv2.textContent = this.symbolList[this.centerCard2[i] % this.symbolList.length];
                symbolDiv2.addEventListener('click', ()=>  this.handleSymbolClick(2,i));
                document.getElementById('card2').appendChild(symbolDiv2);
            }
        }
    }
    

    setupEventListeners() {

       document.getElementById('startBtn').addEventListener('click', () => this.startGame());
       document.getElementById('reshuffleBtn').addEventListener('click', () => {
            if (this.centerCard1) this.cards.push(this.centerCard1);
            if (this.centerCard2) this.cards.push(this.centerCard2);

            this.cards = this.shuffleCards(this.cards);
            this.dealNewRound();
            this.updateDisplay();
       });

       document.getElementById('settingsBtn').addEventListener('click', () => {
            // Show settings modal or menu
            this.showSettings();
       });

       document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
       document.getElementById('rulesBtn').addEventListener('click', () => this.showRules());
       document.getElementById('customBtn').addEventListener('click', () => this.showCustomize());

       document.getElementById('closeModalBtn').addEventListener('click', () => {
            console.log("hiding!");
            hideModal();
       });

       document.getElementById('overlay').addEventListener('click', hideModal);

    }

    showCustomize() {}

    showSettings() {

        document.getElementById('control-panel').classList.toggle('hidden');
        // const reset = document.getElementById('resetBtn');
        // const rules = document.getElementById('rulesBtn');
        // const custom = document.getElementById('customBtn');
        // reset.classList.toggle('hidden');
        // rules.classList.toggle('hidden');
        // custom.classList.toggle('hidden');
    }

    showRules() {
        showModal('<p style="font-family: \'Inter\', sans-serif;">The rules of the game are very simple. Given two cards, find the matching symbol between both cards!</p>');
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
    console.log("hiding modal.");
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotItGame();
}); 