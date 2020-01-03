// CONSTANTS
const SOCKET = io();
// VARIABLES
let playerObjs = [];
// DOM VARIABLES
let btn;
let choices = [];
let feed;
let feedLosers;
let feedWinners;
let game;
let login;
let losers = [];
let playerList;
let username;
let winners = [];
let submitted = false;
// ON DOCUMENT LOAD
document.addEventListener('DOMContentLoaded', () => {
    btn = document.getElementById('btn').addEventListener('click', addUsername);
    choices = document.querySelectorAll('.game-choice');
    choices.forEach(choice => {
        choice.addEventListener('click', addChoice);
    });
    feedLosers = document.getElementById('feed-losers');
    feedWinners = document.getElementById('feed-winners');
    game = document.getElementById('game');
    login = document.getElementById('login');
    playerList = document.getElementById('player-list');
    username = document.getElementById('username');
});
// PRIMARY FUNCTIONS
const addUsername = () => {
    SOCKET.emit('add username', username.value, data => {
        if (data) {
            login.style.display = 'none';
            game.style.display = 'flex';
        } else {
            alert('Username already in use');
        };
    });
};
const addChoice = e => {
    let choice = e.target.id;
    if (!submitted) {
        submitted = true;
        SOCKET.emit('player choice', username.value, choice);
    };
};
// SOCKETS: CLIENT
SOCKET.on('get players', players => {
    playerObjs = [];
    players.forEach(player => {
        playerObjs.push({'name' : player, 'lives': 3});
    });
    playerListGenerator();
});

// HELPER FUNCTIONS