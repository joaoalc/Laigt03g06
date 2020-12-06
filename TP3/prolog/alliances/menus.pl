% Menu Principal
mainMenu(GameState) :-
    repeat,
    (
        checkInput(Input),
        \+manageInput(Input, GameState) 
    ).

% Verifica se o input do menu é válido
checkInput(Input) :-
    printMainMenu,
    repeat,
    (checkInputAux(Input)), !. 

checkInputAux(Input) :-
    askMenuOption,
    getNewInt(Input),
    Input >= 0,
    Input =< 5,!.

checkInputAux(_) :- 
    nl, write('ERROR: Invalid Option!'), nl, nl, 
    fail.

% Prompt da nova opção a inserir
askMenuOption :-
    write('> Insert your option ').   

% Game Levels
mode('R', random).
mode('G', greedy).
mode('H', greedy_hard).

% Escolhe o modo de jogo (Random / Greedy)
pickMode(Mode, N) :- 
    repeat,
    write('Choose Mode ('), write(N), write(') - Random(R) or Greedy(G) or Greedy-HardMode(H): '),
    inputPickMode(Mode). 

inputPickMode(Mode) :-
    getChar(Input),
    mode(Input, Mode).

inputPickMode(_) :-
    nl, write('ERROR: Invalid Mode!'), nl, nl, 
    fail.

% Verifica se o argumento recebido é um número de jogador válido
checkPlayer(1).
checkPlayer(2).
checkPlayer(_) :- write('Invalid player! Please try again (1/2)'), nl, fail.

% Escolher qual o jogador a efetuar a primeira jogada
pickStartPlayer(PlayerN) :-
    write('Which player starts? (1/2): '),
    repeat, (
        getNewInt(PlayerN),
        checkPlayer(PlayerN)
    ).

% Exit
manageInput(0, _) :-
    write('\nExiting...\n\n'), fail.

manageInput(1, GameState) :- % Player vs Player
    pickStartPlayer(PlayerN),
    gameLoop(GameState, [p,p], PlayerN).

manageInput(2, GameState) :- % Player vs Computer
    pickMode(Mode, 'Computer2'), 
    pickStartPlayer(PlayerN),
    gameLoop(GameState, [p,c-Mode], PlayerN).

manageInput(3, GameState) :- % Computer vs Player
    pickMode(Mode, 'Computer1'), 
    pickStartPlayer(PlayerN),
    gameLoop(GameState, [c-Mode,p], PlayerN).

manageInput(4, GameState) :- % Computer vs Computer
    pickMode(Mode1, 'Computer1'), pickMode(Mode2, 'Computer2'), 
    pickStartPlayer(PlayerN),
    gameLoop(GameState, [c-Mode1,c-Mode2], PlayerN).

% How To Play Menu
manageInput(5, _) :-
    nl,
    write('._______________________________________________________________.'), nl,
    write('|                                                               |'), nl,                                        
    write('|                          HOW TO PLAY                          |'), nl,  
    write('|===============================================================|'), nl,              
    write('|    Each player has to use the colored discs to connect two    |'), nl,
    write('|    borders for each color. Allied colours can also be used    |'), nl,
    write('|          according to each player\'s colour table.             |'), nl,
    write('|                                                               |'), nl,
    write('|     The first player to get two different colours, wins!      |'), nl, 
    write('|_______________________________________________________________|'), nl,
    getChar(_).

% Menu Principal
printMainMenu :-
    nl, nl,
    write(' ________________________________________________________________ '), nl,
    write('|                                                                |'), nl,
    write('|               _   _ _ _                                        |'), nl,
    write('|              /_\\ | | (_) __ _ _ __   ___ ___  ___              |'), nl,
    write('|             //_\\\\| | | |/ _` |  _ \\ / __/ _ \\/ __|             |'), nl,
    write('|            /  _  \\ | | | (_| | | | | (_|  __/\\__ \\             |'), nl,
    write('|            \\_/ \\_/_|_|_|\\__,_|_| |_|\\___\\___||___/             |'), nl,
    write('|                                                                |'), nl,
    write('|                                                                |'), nl,                                           
    write('|                         Davide Castro                          |'), nl,  
    write('|                               &                                |'), nl, 
    write('|                            Rui Pinto                           |'), nl,
    write('|================================================================|'), nl,              
    write('|                                                                |'), nl,
    write('|                    1. Player   vs  Player                      |'), nl,
    write('|                    2. Player   vs  Computer                    |'), nl,
    write('|                    3. Computer vs  Player                      |'), nl,
    write('|                    4. Computer vs  Computer                    |'), nl,
    write('|                                                                |'), nl,
    write('|                         5. How to play                         |'), nl,
    write('|                            0. Exit                             |'), nl,     
    write('|________________________________________________________________|'), nl.                                                                 

% (Ogre)
%        _ _ _                            
%   /_\ | | (_) __ _ _ __   ___ ___  ___ 
%  //_\\| | | |/ _` | '_ \ / __/ _ \/ __|
% /  _  \ | | | (_| | | | | (_|  __/\__ \
% \_/ \_/_|_|_|\__,_|_| |_|\___\___||___/