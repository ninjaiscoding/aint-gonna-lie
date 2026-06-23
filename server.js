const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

const gameDatabase = {
    "Animals": ["Lion", "Tiger", "Elephant", "Giraffe", "Kangaroo", "Dog", "Cat", "Rabbit", "Bear", "Wolf", "Deer", "Fox", "Zebra", "Monkey", "Hippo", "Rhino", "Cheetah", "Leopard", "Panda", "Koala", "Horse", "Cow", "Pig", "Sheep", "Goat", "Donkey", "Camel", "Squirrel", "Mouse", "Bat", "Frog", "Toad", "Turtle", "Snake", "Lizard", "Crocodile", "Alligator", "Dolphin", "Whale", "Shark", "Seal", "Octopus", "Crab", "Lobster", "Eagle", "Owl", "Parrot", "Penguin"],
    "Electronics": ["Smartphone", "Laptop", "Television", "Tablet", "Computer", "Smartwatch", "Headphones", "Speaker", "Camera", "Drone", "Projector", "Printer", "Monitor", "Keyboard", "Mouse", "Microphone", "Charger", "Battery", "Flashlight", "Controller", "Refrigerator", "Microwave", "Vacuum", "Fan", "Heater", "Airconditioner", "Lamp", "Clock", "Radio"],
    "Countries": ["Japan", "Canada", "Brazil", "Australia", "Germany", "USA", "Mexico", "France", "Italy", "Spain", "UK", "China", "India", "Egypt", "Russia", "Thailand", "Korea", "Dubai"],
    "Food": ["Pizza", "Burger", "Sushi", "Pasta", "Salad", "Soup", "Sandwich", "Chicken", "Rice", "Noodles", "Bread", "Cheese", "Egg", "Butter", "Milk", "Pancakes", "Hotdog", "Fries", "Chips", "Popcorn", "Cookie", "Cake", "Pie", "IceCream", "Donut", "Chocolate", "Candy", "Fruit", "Vegetable", "Fish", "Curry", "Omelet"],
    "Sports": ["Basketball", "Baseball", "Football", "Tennis", "Volleyball", "Golf", "Cricket", "Hockey", "Badminton", "Swimming", "Running", "Cycling", "Boxing", "Karate", "Gymnastics", "Skating", "Skiing", "Snowboarding", "Surfing", "Wrestling", "Archery", "Bowling", "Darts", "Skateboarding", "Dancing", "Hiking", "Climbing", "Fishing", "Hunting", "Kayaking", "Diving", "Marathon", "Handball", "TableTennis", "Weightlifting", "Bodybuilding"],
    "Fruits": ["Apple", "Banana", "Orange", "Strawberry", "Grape", "Watermelon", "Mango", "Pineapple", "Cherry", "Blueberry", "Blackberry", "Kiwi", "Lemon", "Lime", "Coconut", "Papaya", "Pomegranate", "Avocado", "Dragonfruit", "Pumpkin", "Peanut"],
    "Vegetables": ["Carrot", "Potato", "Broccoli", "Tomato", "Onion", "Garlic", "Cucumber", "Spinach", "Cabbage", "Cauliflower", "Corn", "Peas", "Beans", "Mushroom", "SweetPotato", "Ginger", "Chili"],
    "Clothing": ["Shirt", "Pants", "Dress", "Skirt", "Jacket", "Coat", "Sweater", "Hoodie", "Shorts", "Jeans", "Socks", "Shoes", "Boots", "Sneakers", "Sandals", "Hat", "Cap", "Gloves", "Scarf", "Belt", "Tie", "Suit", "Tuxedo", "Blouse", "Raincoat", "Swimsuit", "Pajamas", "Underwear", "Bra", "Slippers", "Uniform", "Jersey"],
    "School Subjects": ["Math", "Science", "History", "English", "Geography", "Art", "Music", "Biology", "Chemistry", "Physics", "Reading", "Writing", "Language", "Health", "Gym", "Drama", "Theater", "Computers", "Coding", "Geometry", "Algebra", "Calculus", "Astronomy", "Economics", "Politics", "Psychology", "Poetry", "Photography", "Cooking", "Sewing", "Business", "Accounting", "Finance", "Law", "Medicine", "Nursing", "Engineering", "Architecture", "Robotics", "Agriculture", "Gardening"],
    "Jobs": ["Teacher", "Doctor", "Nurse", "Firefighter", "Policeman", "Pilot", "Chef", "Farmer", "Scientist", "Engineer", "Artist", "Musician", "Actor", "Writer", "Journalist", "Lawyer", "Judge", "Dentist", "Vet", "Builder", "Carpenter", "Electrician", "Plumber", "Mechanic", "Driver", "Captain", "Soldier", "Astronaut", "Athlete", "Coach", "Manager", "Boss", "Salesman", "Waiter", "Gardener", "Painter", "Photographer", "Designer", "Programmer", "Developer", "Librarian", "Barber"],
    "Colors": ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Gray", "Brown", "Silver", "Gold", "Bronze", "Violet", "Indigo"],
    "Vehicles": ["Car", "Truck", "Van", "Bus", "Bike", "Motorcycle", "Scooter", "Train", "Subway", "Airplane", "Helicopter", "Jet", "Rocket", "Spaceship", "Boat", "Ship", "Yacht", "Submarine", "Kayak", "Raft", "Ambulance", "Firetruck", "Policecar", "Taxi", "Tractor", "Crane", "Golfcart", "GoKart", "Skateboard", "HotAirBalloon", "JetSki", "Tank"],
    "Furniture": ["Chair", "Table", "Desk", "Bed", "Sofa", "Stool", "Bench", "Closet", "Drawer", "Shelf", "Bookcase", "Mirror", "Lamp", "Carpet", "Curtain", "Pillow", "Mattress", "CoffeeTable", "Clock"],
    "Musical Instruments": ["Guitar", "Piano", "Violin", "Drums", "Flute", "Trumpet", "Recorder", "Whistle", "Tabla"],
    "Hobbies": ["Reading", "Writing", "Drawing", "Painting", "Singing", "Dancing", "Acting", "Cooking", "Gardening", "Knitting", "Photography", "Gaming", "Coding", "Skating", "Hiking", "Camping", "Fishing", "Hunting", "Swimming", "Running", "Cycling", "Traveling", "Shopping", "Crafting", "Sculpting", "Biking", "Chess", "Cards", "Puzzles"],
    "Weather": ["Sunny", "Rainy", "Cloudy", "Windy", "Snowy", "Drizzle", "Thunder", "Lightning"],
    "Family Members": ["Mother", "Father", "Son", "Daughter", "Brother", "Sister", "Grandmother", "Grandfather", "Grandson", "Granddaughter", "Aunt", "Uncle", "Cousin", "Nephew", "Niece", "Husband", "Wife", "Parent", "Stepfather", "Stepmother", "Stepdaughter", "Stepbrother", "Stepsister", "Triplet", "Sibling", "Godmother", "Godfather", "Boyfriend", "Girlfriend", "Partner", "Spouse"],
    "Rooms in a House": ["Kitchen", "Bathroom", "Bedroom", "LivingRoom", "DiningRoom", "Basement", "Garage", "Office", "Study", "Library", "Nursery", "Playroom", "StorageRoom"],
    "Shapes and Space": ["Sun", "Moon", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Milky Way", "Andromeda", "Orion Nebula", "Crab Nebula", "Black Hole", "Sagittarius A*", "Solar Eclipse", "Lunar Eclipse", "Supernova", "Meteor Shower", "Aurora Borealis", "Quasar", "Pulsar", "Asteroid Belt"],
    "Toys and Games": ["Doll", "ActionFigure", "Lego", "Blocks", "Puzzle", "Car", "Train", "Plane", "Ball", "Bat", "TeddyBear", "Plushie", "Robot", "Slime", "PlayDough", "Crayons", "Markers", "Paint", "YoYo", "Kite", "Frisbee", "Marble", "Dice", "Cards", "Chess", "Checkers", "Monopoly", "Scrabble", "Dominoes", "VideoGame", "Console", "Controller", "Headset", "Bicycle", "Scooter", "Skateboard", "Trampoline", "Swing", "Slide", "Sandbox", "WaterGun", "NerfGun", "RubiksCube", "Spinner", "Bubble", "Balloon"],
    "Video Games": ["Minecraft", "GTA", "Fortnite", "Valorant", "FIFA", "Pokemon", "PacMan", "Tetris", "CallOfDuty", "AssassinCreed", "Cyberpunk", "Witcher", "EldenRing", "Skyrim", "Spiderman", "Halo", "Uncharted", "GodOfWar", "Overwatch", "Roblox", "ApexLegends", "AmongUs", "Zelda", "MarioKart", "Sonic", "Doom", "ResidentEvil", "MortalKombat", "StreetFighter", "Tekken", "Fallout", "DarkSouls", "FinalFantasy", "ClashRoyale", "SubwaySurfers", "AngryBirds", "CandyCrush", "PUBG", "FreeFire", "TombRaider"],
    "Anime": ["Naruto", "OnePiece", "DragonBall", "Bleach", "DeathNote", "AttackOnTitan", "DemonSlayer", "JujutsuKaisen", "MyHeroAcademia", "HunterXHunter", "FullmetalAlchemist", "SteinsGate", "TokyoGhoul", "OnePunchMan", "BlackClover", "SwordArtOnline", "ChainsawMan", "CyberpunkEdgerunners", "Monster", "MobPsycho", "Haikyuu", "KurokoNoBasket", "BlueLock", "YourName", "SpiritedAway", "VinlandSaga", "FireForce", "FairyTail", "Boruto", "SpyXFamily", "KaijuNo8", "SoloLeveling", "DrStone", "TokyoRevengers", "JoJo", "Gintama", "Parasyte", "PsychoPass", "Overlord", "ReZero"],
    "Cartoon": ["Ben10", "RickAndMorty", "TomAndJerry", "ScoobyDoo", "LooneyTunes", "SpongeBob", "Simpsons", "FamilyGuy", "SouthPark", "BoJackHorseman", "Avatar", "PhineasAndFerb", "GravityFalls", "AdventureTime", "TeenTitans", "Batman", "SpiderMan", "JusticeLeague", "PowerpuffGirls", "DexterLaboratory", "JohnnyBravo", "CourageTheCowardlyDog", "Futurama", "AmericanDad", "StarWarsCloneWars", "XMen", "Transformers", "Popeye", "WeBareBears"]
};

const rooms = {};

io.on('connection', (socket) => {

    socket.on('createRoom', ({ rounds, categoryMode, gameMode }) => {
        const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        
        let lockedCategory = null;
        if (categoryMode === "random") {
            const keys = Object.keys(gameDatabase);
            lockedCategory = keys[Math.floor(Math.random() * keys.length)];
        } else if (categoryMode !== "all") {
            lockedCategory = categoryMode;
        }

        rooms[roomCode] = {
            code: roomCode,
            hostId: socket.id,
            maxRounds: gameMode === "amw" ? 2 : (parseInt(rounds) || 5),
            currentRound: 1,
            players: [],
            gameStarted: false,
            currentCategory: null,
            currentWord: null,
            imposterId: null,
            playedCombinations: [],
            currentTurnIndex: 0,
            categoryMode: categoryMode, 
            lockedCategory: lockedCategory,
            gameMode: gameMode || "aous",
            amwData: {
                noCount: 0,
                p1Word: "",
                p2Word: "",
                guesserId: null,
                answererId: null
            }
        };
        socket.emit('roomCreated', roomCode);
    });

    socket.on('joinRoom', ({ roomCode, playerName }) => {
        const room = rooms[roomCode];
        if (!room) return socket.emit('errorMsg', 'Room not found.');
        if (room.gameStarted) return socket.emit('errorMsg', 'Game already in progress.');
        
        if (room.gameMode === "amw" && room.players.length >= 2) {
            return socket.emit('errorMsg', 'This game mode is limited strictly to 2 players.');
        }
        if (room.players.length >= 10) return socket.emit('errorMsg', 'Room is full.');

        const existingPlayerIndex = room.players.findIndex(p => p.id === socket.id);
        if (existingPlayerIndex === -1) {
            const newPlayer = {
                id: socket.id,
                name: playerName || `Player ${room.players.length + 1}`,
                points: 0,
                isImposter: false,
                hint: "",
                pNumber: room.players.length + 1
            };
            room.players.push(newPlayer);
        }

        socket.join(roomCode);
        
        io.to(roomCode).emit('roomUpdated', {
            roomCode,
            players: room.players,
            hostId: room.hostId,
            gameStarted: room.gameStarted,
            gameMode: room.gameMode
        });
    });

    socket.on('startGame', ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || room.hostId !== socket.id) return;
        
        if (room.gameMode === "amw" && room.players.length !== 2) {
            return socket.emit('errorMsg', 'Need exactly 2 players to start Ain\'t My Word!');
        }

        room.gameStarted = true;
        startNewRound(roomCode);
    });

    function startNewRound(roomCode) {
        const room = rooms[roomCode];
        if (!room) return;
        const categories = Object.keys(gameDatabase);
        
        // Pick Category (Keep it locked if it was preselected)
        let chosenCategory = room.lockedCategory || categories[Math.floor(Math.random() * categories.length)];
        room.currentCategory = chosenCategory;

        const wordList = gameDatabase[chosenCategory];

        if (room.gameMode === "amw") {
            // CRITICAL FIX: Only roll words on Round 1. Keep them for Round 2!
            if (room.currentRound === 1) {
                let w1 = wordList[Math.floor(Math.random() * wordList.length)];
                let w2 = wordList[Math.floor(Math.random() * wordList.length)];
                while (w1 === w2) {
                    w2 = wordList[Math.floor(Math.random() * wordList.length)];
                }
                
                room.amwData.p1Word = w1;
                room.amwData.p2Word = w2;
                room.amwData.noCount = 0;
                room.amwData.guesserId = room.players[0].id;
                room.amwData.answererId = room.players[1].id;
            } else {
                // Round 2 uses the exact same words generated in Round 1
                room.amwData.noCount = 0;
                room.amwData.guesserId = room.players[1].id;
                room.amwData.answererId = room.players[0].id;
            }

            io.to(roomCode).emit('amwRoundStarted', {
                category: room.currentCategory,
                currentRound: room.currentRound,
                maxRounds: room.maxRounds,
                players: room.players,
                amwData: room.amwData
            });

        } else {
            let chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
            let attempts = 0;
            while (room.playedCombinations.includes(`${chosenCategory}:${chosenWord}`) && attempts < 50) {
                chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
                attempts++;
            }
            room.playedCombinations.push(`${chosenCategory}:${chosenWord}`);
            room.currentWord = chosenWord;
            
            const imposterIndex = Math.floor(Math.random() * room.players.length);
            room.players.forEach((p, idx) => {
                p.isImposter = (idx === imposterIndex);
                p.hint = "";
                if (p.isImposter) room.imposterId = p.id;
            });

            room.currentTurnIndex = (room.currentRound - 1) % room.players.length;
            emitTurnState(roomCode);
        }
    }

    function emitTurnState(roomCode) {
        const room = rooms[roomCode];
        if (!room) return;
        const activePlayer = room.players[room.currentTurnIndex];

        room.players.forEach((player) => {
            io.to(player.id).emit('roundStarted', {
                category: room.currentCategory,
                word: player.isImposter ? null : room.currentWord,
                isImposter: player.isImposter,
                currentRound: room.currentRound,
                maxRounds: room.maxRounds,
                players: room.players,
                activeTurnPlayerId: activePlayer.id,
                activeTurnPlayerName: activePlayer.name
            });
        });
    }

    // --- "AIN'T MY WORD" REAL-TIME EVENTS ---
    socket.on('amwUpdateNoCount', ({ roomCode, count }) => {
        const room = rooms[roomCode];
        if (!room || room.gameMode !== "amw") return;
        
        room.amwData.noCount = count;
        io.to(roomCode).emit('amwNoCountUpdated', { noCount: room.amwData.noCount });

        if (room.amwData.noCount >= 10) {
            const answerer = room.players.find(p => p.id === room.amwData.answererId);
            const guesser = room.players.find(p => p.id === room.amwData.guesserId);
            answerer.points += 1;

            let targetWord = room.amwData.guesserId === room.players[0].id ? room.amwData.p2Word : room.amwData.p1Word;

            let html = `<h3 style="color:#ed4956; font-size:1.5rem; margin-bottom:10px;">Out of Answers!</h3>
            <p><strong>${answerer.name}</strong> won this round by defending their word successfully!</p>
            <p style="margin-top:10px; color:#0095f6;">The word <strong>${guesser.name}</strong> was failing to guess: <strong>${targetWord}</strong></p><br>`;

            io.to(roomCode).emit('roundResult', {
                pointsSummaryHtml: html,
                players: room.players,
                isGameOver: room.currentRound >= room.maxRounds
            });
        }
    });

    socket.on('amwSubmitGuess', ({ roomCode, guessText }) => {
        const room = rooms[roomCode];
        if (!room || room.gameMode !== "amw") return;

        const guesser = room.players.find(p => p.id === room.amwData.guesserId);
        let targetWord = room.amwData.guesserId === room.players[0].id ? room.amwData.p2Word : room.amwData.p1Word;

        if (guessText.trim().toLowerCase() === targetWord.toLowerCase()) {
            guesser.points += 1;
            let html = `<h3 style="color:#0095f6; font-size:1.5rem; margin-bottom:10px;">Correct Guess!</h3>
            <p><strong>${guesser.name}</strong> cracked the code and guessed the word correctly!</p>
            <p style="margin-top:10px; color:#0095f6;">The secret word was indeed: <strong>${targetWord}</strong></p><br>`;

            io.to(roomCode).emit('roundResult', {
                pointsSummaryHtml: html,
                players: room.players,
                isGameOver: room.currentRound >= room.maxRounds
            });
        } else {
            socket.emit('errorMsg', "Wrong guess! Keep asking questions.");
        }
    });

    // --- CLASSIC MODE EVENTS ---
    socket.on('submitHint', ({ roomCode, hintText }) => {
        const room = rooms[roomCode];
        if (!room) return;

        const expectedPlayer = room.players[room.currentTurnIndex];
        if (socket.id !== expectedPlayer.id) return;

        expectedPlayer.hint = hintText.trim() || "🤐 Passed hint";
        room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;
        
        const subCount = room.players.filter(p => p.hint !== "").length;

        if (subCount === room.players.length) {
            io.to(roomCode).emit('hintSubmissionProgress', { allDone: true });
        } else {
            emitTurnState(roomCode);
        }
    });

    socket.on('revealHints', ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || room.hostId !== socket.id) return;
        io.to(roomCode).emit('allHintsSubmitted', { players: room.players });
    });

    // --- ONLY HOST CAN CAST THE FINAL VOTE ---
    socket.on('castVote', ({ roomCode, votedPlayerId }) => {
        const room = rooms[roomCode];
        if (!room || room.gameMode === "amw") return;

        if (socket.id !== room.hostId) {
            return socket.emit('errorMsg', 'Only the host has the authority to cast the final vote!');
        }

        let pointsSummaryHtml = "";
        const imposter = room.players.find(p => p.isImposter);

        if (votedPlayerId === room.imposterId) {
            pointsSummaryHtml = `<h3 style="color:#0095f6; font-size:1.5rem; margin-bottom:10px;">Imposter Caught!</h3>
            <p>The host successfully singled out the Imposter, <strong>${imposter.name}</strong>!</p>
            <p style="margin-top:10px; color:#cc2366;">The secret word was: <strong>${room.currentWord}</strong></p><br>`;
            room.players.forEach(p => { if (!p.isImposter) p.points += 1; });
        } else {
            const victim = room.players.find(p => p.id === votedPlayerId) || { name: "An Innocent Player" };
            pointsSummaryHtml = `<h3 style="color:#ed4956; font-size:1.5rem; margin-bottom:10px;">Wrong Accusation!</h3>
            <p>The host wrongly accused <strong>${victim.name}</strong>.</p>
            <p style="margin-top:10px; color:#cc2366;">The real imposter was actually <strong>${imposter.name}</strong>!</p>
            <p>The secret word was: <strong>${room.currentWord}</strong></p><br>`;
            imposter.points += 2;
        }

        io.to(roomCode).emit('roundResult', {
            pointsSummaryHtml,
            players: room.players,
            isGameOver: room.currentRound >= room.maxRounds
        });
    });

    socket.on('nextRound', ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || room.hostId !== socket.id) return;
        room.currentRound++;
        startNewRound(roomCode);
    });

    socket.on('restartGame', ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || room.hostId !== socket.id) return;

        room.currentRound = 1;
        room.gameStarted = false;
        room.players.forEach(p => { p.points = 0; p.hint = ""; });
        room.playedCombinations = [];

        if (room.categoryMode === "random") {
            const keys = Object.keys(gameDatabase);
            room.lockedCategory = keys[Math.floor(Math.random() * keys.length)];
        }
        
        io.to(roomCode).emit('gameRestartedByHost', {
            roomCode,
            players: room.players,
            hostId: room.hostId,
            gameStarted: room.gameStarted,
            gameMode: room.gameMode
        });
    });

    socket.on('disconnect', () => {
        for (const roomCode in rooms) {
            const room = rooms[roomCode];
            const pIdx = room.players.findIndex(p => p.id === socket.id);
            if (pIdx !== -1) {
                room.players.splice(pIdx, 1);
                room.players.forEach((p, idx) => p.pNumber = idx + 1);

                if (room.players.length === 0) {
                    delete rooms[roomCode];
                } else {
                    if (room.hostId === socket.id) room.hostId = room.players[0].id;
                    
                    if (room.gameStarted && room.currentTurnIndex >= room.players.length) {
                        room.currentTurnIndex = 0;
                    }

                    io.to(roomCode).emit('roomUpdated', {
                        roomCode,
                        players: room.players,
                        hostId: room.hostId,
                        gameStarted: room.gameStarted,
                        gameMode: room.gameMode
                    });
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
