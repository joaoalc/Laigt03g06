% Imprime toda a informação do jogo - Caso em que o jogo foi ganho
display_game(Board-ColoursWon, 0) :-
    print_board(Board, 1),
    display_discs(Board-ColoursWon),
    displayColoursState(ColoursWon).

% Imprime toda a informação do jogo - Incluindo o próximo player a jogar
display_game(Board-ColoursWon, Player) :-
    print_board(Board, 1),
    display_discs(Board-ColoursWon),
    displayColoursState(ColoursWon),
    display_player(Player).

% Imprime número de discos disponíveis
display_discs(GameState) :-
    countDiscs(GameState, O, G, P),
    NewO is 42 - O,
    NewG is 42 - G,
    NewP is 42 - P,
    write('   Orange discs: '), write(NewO), 
    write(' | Green discs: '), write(NewG),
    write(' | Purple discs: '), write(NewP),nl.

% Imprime a vez do próximo Jogador
display_player(Player) :-
    write('                      Player '),
    write(Player),
    write('\'s turn'), nl, nl.

% Imprime as cores que cada jogador já arrecadou
displayColoursState(PurpleWon1-OrangeWon1-GreenWon1-PurpleWon2-OrangeWon2-GreenWon2) :-
    displayColoursStateAux(1, PurpleWon1-OrangeWon1-GreenWon1),
    displayColoursStateAux(2, PurpleWon2-OrangeWon2-GreenWon2).

displayColoursStateAux(Player, 'FALSE'-'FALSE'-'FALSE') :- write('                  Player '), write(Player), write(' has no colours'),nl.

displayColoursStateAux(Player, PurpleWon-OrangeWon-GreenWon) :-
    write('                  Player '), write(Player), write(' has colour(s): '), 
    displayColourWon('PURPLE', PurpleWon),
    displayColourWon('ORANGE', OrangeWon),
    displayColourWon('GREEN', GreenWon),
    nl.

% Display de cor ganha
displayColourWon(_, 'FALSE').

displayColourWon(Colour, 'TRUE') :-
    write(Colour), write(' ').