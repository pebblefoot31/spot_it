// Spot It Game Logic
class SpotItGame {
    constructor() {
        this.cards = [];
        this.centerCard = null;
        this.playerCards = [];
        this.score = 0;
        this.timeLeft = 60;
        this.gameTimer = null;
        this.isGameActive = false;
        this.symbolList = ['🍎','🚗','🐶','⭐','🎈','🌵','🎲','🦄','🍕','👻','🎵','⚽','🛴','🦊','🌈','🐸','🎁','🪁','🪐','🐱','🍔','🎨','📚','🐢','🚀','🧸','🎤','👽','🥕','🍄','🐧','🍩','🧃','🛸','🎮','🥑','🔮','📸','🧃','🌻','🌙','🧁','🔔','🐠','🦋','📀','📌','🍇','🍪','🍰','🎓','🐙','🎯','🥎','🎬','🍹'];
        
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
                const card = [i];
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
        // Generate cards with emojis
        const cardIndices = this.generateSpotItCards(7);
        this.cards = cardIndices.map(card => card.map(index => this.symbolList[index]));
        
        // Shuffle the cards
        this.shuffleCards();
        
        this.updateDisplay();
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    startGame() {
        if (this.isGameActive) return;
        
        this.isGameActive = true;
        this.score = 0;
        this.timeLeft = 60;
        this.shuffleCards();
        
        this.dealNewRound();
        this.startTimer();
        this.updateDisplay();
        
        document.getElementById('startBtn').textContent = 'Game Running...';
        document.getElementById('startBtn').disabled = true;
    }

    dealNewRound() {
        if (this.cards.length < 6) {
            this.endGame();
            return;
        }

        // Deal center card
        this.centerCard = this.cards.shift();
        
        // Deal 5 player cards
        this.playerCards = this.cards.splice(0, 5);
        
        this.updateDisplay();
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
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

    checkMatch(selectedSymbol) {
        if (!this.isGameActive || !this.centerCard) return;

        // Check if the selected symbol exists in the center card
        const isMatch = this.centerCard.includes(selectedSymbol);
        
        if (isMatch) {
            this.score += 10;
            this.showFeedback(true);
            this.dealNewRound();
        } else {
            this.showFeedback(false);
        }
        
        this.updateDisplay();
    }

    showFeedback(isCorrect) {
        const playerCards = document.querySelectorAll('.player-card');
        const centerCard = document.getElementById('centerCard');
        
        if (isCorrect) {
            centerCard.classList.add('correct');
            setTimeout(() => {
                centerCard.classList.remove('correct');
            }, 500);
        } else {
            centerCard.classList.add('wrong');
            setTimeout(() => {
                centerCard.classList.remove('wrong');
            }, 500);
        }
    }

    endGame() {
        this.isGameActive = false;
        this.stopTimer();
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
        
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
    }

    resetGame() {
        this.isGameActive = false;
        this.stopTimer();
        this.score = 0;
        this.timeLeft = 60;
        this.centerCard = null;
        this.playerCards = [];
        
        this.initializeGame();
        this.updateDisplay();
        
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('gameOver').style.display = 'none';
    }

    updateDisplay() {
        // Update score
        document.getElementById('score').textContent = this.score;
        document.getElementById('timer').textContent = this.timeLeft;
        
        // Update center card
        const centerCardElement = document.getElementById('centerCard');
        if (this.centerCard) {
            centerCardElement.innerHTML = this.centerCard.join('<br>');
        } else {
            centerCardElement.innerHTML = '🎯<br>Click Start!';
        }
        
        // Update player cards
        const playerCardsContainer = document.getElementById('playerCards');
        playerCardsContainer.innerHTML = '';
        
        this.playerCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'player-card';
            cardElement.innerHTML = card.join('<br>');
            
            // Add click event to each symbol in the card
            cardElement.addEventListener('click', () => {
                if (!this.isGameActive) return;
                
                // Get the clicked symbol (first symbol for simplicity)
                const selectedSymbol = card[0];
                this.checkMatch(selectedSymbol);
            });
            
            playerCardsContainer.appendChild(cardElement);
        });
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            document.getElementById('gameOver').style.display = 'none';
            this.resetGame();
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotItGame();
}); 