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

            //iterate through cards and randomly pick a card to push onto the shuffled array
            //remove the card from the original nonshuffled array
            //return the shuffled array
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

    updateDisplay() {}
    
    setupEventListeners() {}

    toggleControlButtons() {}

    hideAllButtons() {}

    showCustomize() {}

    showRules() {}
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotItGame();
}); 