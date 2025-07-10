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
        this.clickedCard1Symbols = new Set();
        this.clickedCard2Symbols = new Set();
        
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
        
        // Reset clicked symbols
        this.clickedCard1Symbols.clear();
        this.clickedCard2Symbols.clear();
        
        this.dealNewRound();
        this.startTimer();
        this.updateDisplay();
        
        // Update both start buttons
        document.getElementById('startGameBtn').textContent = 'RUNNING...';
        document.getElementById('startGameBtn').disabled = true;
        document.getElementById('startBtn').textContent = 'Game Running...';
        document.getElementById('startBtn').disabled = true;
    }

    dealNewRound() {
        if (this.cards.length < 2) {
            this.endGame();
            return;
        }

        // Deal two center cards
        this.centerCard1 = this.cards.shift();
        this.centerCard2 = this.cards.shift();
        
        // Reset clicked symbols for new round
        this.clickedCard1Symbols.clear();
        this.clickedCard2Symbols.clear();
        
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

    handleSymbolClick(symbol, cardNumber, symbolIndex) {
        if (!this.isGameActive) return;

        if (cardNumber === 1) {
            // Handle card 1 symbol click
            if (this.clickedCard1Symbols.has(symbolIndex)) {
                // Already clicked, unclick it
                this.clickedCard1Symbols.delete(symbolIndex);
            } else {
                // Click the symbol
                this.clickedCard1Symbols.add(symbolIndex);
            }
        } else {
            // Handle card 2 symbol click
            if (this.clickedCard2Symbols.has(symbolIndex)) {
                // Already clicked, unclick it
                this.clickedCard2Symbols.delete(symbolIndex);
            } else {
                // Click the symbol
                this.clickedCard2Symbols.add(symbolIndex);
            }
        }

        // Check for matches
        this.checkForMatches();
        this.updateDisplay();
    }

    checkForMatches() {
        if (!this.centerCard1 || !this.centerCard2) return;

        // Get clicked symbols
        const clickedCard1Symbols = Array.from(this.clickedCard1Symbols).map(index => this.centerCard1[index]);
        const clickedCard2Symbols = Array.from(this.clickedCard2Symbols).map(index => this.centerCard2[index]);

        // Find matching symbols between clicked symbols
        const matchingSymbols = clickedCard1Symbols.filter(symbol => 
            clickedCard2Symbols.includes(symbol)
        );

        if (matchingSymbols.length > 0) {
            // Found a match! Award points based on time remaining
            const pointsEarned = 5 * this.timeLeft;
            this.score += pointsEarned;
            
            // Show success feedback
            this.showFeedback(true, `+${pointsEarned} points!`);
            
            // Move to next round
            this.dealNewRound();
        }
    }

    handleWrongClick() {
        if (!this.isGameActive) return;
        
        // Deduct points for wrong click
        this.score = Math.max(0, this.score - 150);
        
        // Show error feedback
        this.showFeedback(false, '-150 points!');
        
        this.updateDisplay();
    }

    showFeedback(isCorrect, message = '') {
        const centerCards = document.querySelectorAll('.center-circle-card');
        
        if (isCorrect) {
            centerCards.forEach(card => {
                card.classList.add('correct');
            });
            if (message) {
                this.showMessage(message, 'success');
            }
            setTimeout(() => {
                centerCards.forEach(card => {
                    card.classList.remove('correct');
                });
            }, 500);
        } else {
            centerCards.forEach(card => {
                card.classList.add('wrong');
            });
            if (message) {
                this.showMessage(message, 'error');
            }
            setTimeout(() => {
                centerCards.forEach(card => {
                    card.classList.remove('wrong');
                });
            }, 500);
        }
    }

    showMessage(message, type) {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#51cf66' : '#ff6b6b'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 1001;
            animation: messageFade 1s ease-in-out;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 1000);
    }

    endGame() {
        this.isGameActive = false;
        this.stopTimer();
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
        
        document.getElementById('startGameBtn').textContent = 'Start Game';
        document.getElementById('startGameBtn').disabled = false;
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
    }

    resetGame() {
        this.isGameActive = false;
        this.stopTimer();
        this.score = 0;
        this.timeLeft = 60;
        this.centerCard1 = null;
        this.centerCard2 = null;
        
        // Reset clicked symbols
        this.clickedCard1Symbols.clear();
        this.clickedCard2Symbols.clear();
        
        this.initializeGame();
        this.updateDisplay();
    }

    updateDisplay() {
        // Update center card 1
        const centerCard1Element = document.getElementById('card1');
        centerCard1Element.innerHTML = '';
        
        if (this.centerCard1) {
            // Create grid cells for center card 1
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                cell.className = 'symbol';
                
                if (i < this.centerCard1.length) {
                    cell.textContent = this.centerCard1[i];
                    
                    // Add click event to symbol
                    cell.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.handleSymbolClick(this.centerCard1[i], 1, i);
                    });
                    
                    // Add visual feedback for clicked symbols
                    if (this.clickedCard1Symbols.has(i)) {
                        cell.classList.add('clicked');
                    }
                }
                
                centerCard1Element.appendChild(cell);
            }
        }
        
        // Update center card 2
        const centerCard2Element = document.getElementById('card2');
        centerCard2Element.innerHTML = '';
        
        if (this.centerCard2) {
            // Create grid cells for center card 2
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                cell.className = 'symbol';
                
                if (i < this.centerCard2.length) {
                    cell.textContent = this.centerCard2[i];
                    
                    // Add click event to symbol
                    cell.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.handleSymbolClick(this.centerCard2[i], 2, i);
                    });
                    
                    // Add visual feedback for clicked symbols
                    if (this.clickedCard2Symbols.has(i)) {
                        cell.classList.add('clicked');
                    }
                }
                
                centerCard2Element.appendChild(cell);
            }
        }
        
        // Add click events to the entire cards for wrong clicks
        centerCard1Element.addEventListener('click', () => {
            if (!this.isGameActive) return;
            this.handleWrongClick();
        });
        
        centerCard2Element.addEventListener('click', () => {
            if (!this.isGameActive) return;
            this.handleWrongClick();
        });
    }

    setupEventListeners() {
        // Gear icon functionality
        document.getElementById('gearIcon').addEventListener('click', () => {
            this.toggleControlButtons();
        });
        
        // Close buttons when clicking outside
        document.addEventListener('click', (e) => {
            const gearIcon = document.getElementById('gearIcon');
            const resetBtn = document.getElementById('resetBtn');
            const customizeBtn = document.getElementById('customizeBtn');
            const rulesBtn = document.getElementById('rulesBtn');
            
            if (!gearIcon.contains(e.target) && 
                !resetBtn.contains(e.target) && 
                !customizeBtn.contains(e.target) && 
                !rulesBtn.contains(e.target)) {
                this.hideAllButtons();
            }
        });
        
        // Menu button event listeners
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
            this.hideAllButtons();
        });
        
        document.getElementById('customizeBtn').addEventListener('click', () => {
            this.showCustomize();
            this.hideAllButtons();
        });
        
        document.getElementById('rulesBtn').addEventListener('click', () => {
            this.showRules();
            this.hideAllButtons();
        });
    }

    toggleControlButtons() {
        const resetBtn = document.getElementById('resetBtn');
        const customizeBtn = document.getElementById('customizeBtn');
        const rulesBtn = document.getElementById('rulesBtn');
        
        if (resetBtn.style.display === 'none' || resetBtn.style.display === '') {
            // Show all buttons at the same time
            resetBtn.style.display = 'block';
            customizeBtn.style.display = 'block';
            rulesBtn.style.display = 'block';
        } else {
            // Hide all buttons
            this.hideAllButtons();
        }
    }

    hideAllButtons() {
        document.getElementById('resetBtn').style.display = 'none';
        document.getElementById('customizeBtn').style.display = 'none';
        document.getElementById('rulesBtn').style.display = 'none';
    }

    showCustomize() {
        alert('Customize feature coming soon! 🎨');
    }

    showRules() {
        alert(`🎯 SPOT IT! GAME RULES 🎯\n\n• Click matching symbols between the two cards\n• Earn 5 × (time remaining) points for each match\n• Wrong clicks cost 150 points\n• You have 60 seconds to find as many matches as possible!\n• The faster you find matches, the more points you earn!\n\nGood luck! 🍀`);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotItGame();
}); 