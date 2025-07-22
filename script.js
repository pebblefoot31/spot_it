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
    }

    shuffleCards() {

            shuffledCards = [];

            for (let i = 0; i < this.cards.size(); i++) {
                index = Math.floor(Math.random()*this.cards.size());
                shuffledCards.push(this.cards[index]);
                this.cards.splice(index,1)
            }

            return shuffledCards;
    }

    startGame() {
        this.isGameActive = true;
        this.dealNewRound();
        this.startTimer();
    }

    dealNewRound() {

        if (this.cards.size() > 1) {
            this.centerCard1 = this.cards[this.cards.length()-1];
            this.cards.pop();
            this.centerCard2 = this.cards[this.cards.length()-1];
            this.cards.pop();
        } else {
            this.centerCard1 = this.cards.back();
            this.cards.pop();
        }
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
            this.checkForMatch();
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
            document.getElementById('timer').textContent = this.timeLeft;
        }

        //if it is a match then we refresh the cards and also check if something in the symbol clicks has changed
        if (this.checkForMatch()) {

            document.getElementById('card1').innerHTML = '';
            document.getElementById('card2').innerHTML = '';

            for (let i = 0; i < this.centerCard1.length(); i++)  {
                const symbolDiv1 = document.createElement('div');
                symbolDiv1.textContent = this.centerCard1[i];
                document.getElementById('card1').appendChild(symbolDiv1);

                const symbolDiv2 = document.createElement('div');
                symbolDiv2.textContent = this.centerCard2[i];
                document.getElementById('card2').appendChild(symbolDiv2);

                if (i === this.clickedCard1Symbol) {
                    symbolDiv1.classList.add('glow');
                } 

                if (i === this.clickedCard2Symbol) {
                    symbolDiv2.classList.add('glow');
                }
            }

        }

    }
    

    setupEventListeners() {
       document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
       }); 

       document.getElementById('settingsBtn').addEventListener('click', () => {
            showModal('<h2>Settings</h2><p>Settings go here!</p>');
       }); 

       document.getElementById('closeModalBtn').addEventListener('click', hideModal);
       document.getElementById('overlay').addEventListener('click', hideModal);

       document.getElementById('rulesBtn').addEventListener('click', () => {

       }); 

    //    document.getElementById('card1').addEventListener('click', () => {
    //         this.check
    //    }); 

    //    document.getElementById('card2').addEventListener('click', () => {
    //         this.resetGame();
    //    }); 

    }

    toggleControlButtons() {}

    hideAllButtons() {}

    showCustomize() {}

    showRules() {}
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