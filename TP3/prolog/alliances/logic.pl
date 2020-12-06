% Neste ficheiro estão presentes os predicados principais para o funcionamento do jogo, incluindo o game loop para executar jogadas 
% e atualizar o estado do jogo

% Jogador Atual | Outro Jogador
other_player(1, 2).
other_player(2, 1).

% Start Game (Direciona para o Menu principal)
startGame(GameState) :-
    mainMenu(GameState).

% Verifica se a jogada é válida, isto é se a célula a jogar está vazia e se existem discos disponíveis para efetuar a jogada
checkValidPlay(Board-ColoursWon, [Row, Diagonal, Colour]) :-
    checkEmptyPlay([Row, Diagonal, Colour], Board),
    checkAvailableDiscAux(Board-ColoursWon, Colour). 

checkEmptyPlay(Move, Board) :-
    checkEmpty(Move, Board),!.

checkEmptyPlay(_, _) :-
    write('Cell not empty!'), nl, fail.

checkAvailableDiscAux(Board-ColoursWon, Colour) :-
    checkAvailableDisc(Board-ColoursWon, Colour), !.  

checkAvailableDiscAux(_, Colour) :-
    write('No more '), write(Colour), write(' discs remaining!'), nl, fail.
    
% Parse dos discos disponíveis para jogar
checkAvailableDisc(Board-ColoursWon, Colour) :-
    countDiscs(Board-ColoursWon, O, G, P),
    checkColourDiscs(Colour, P-O-G).

checkColourDiscs(orange, _-Existing-_) :-
    Available is 42 - Existing,
    Available > 0.

checkColourDiscs(green, _-_-Existing) :-
    Available is 42 - Existing,
    Available > 0.

checkColourDiscs(purple, Existing-_-_) :-
    Available is 42 - Existing,
    Available > 0.

% Imprime a jogada efetuada
print_move([Row, Diagonal, Colour]) :-
    write('Played R:'), write(Row),
    write(', D:'), write(Diagonal),
    write(', '), write(Colour), nl.

% Jogada de um Player
userPlay(GameState, NewGameState, Nplayer-p) :-
    repeat,
    (
        getUserInput(Row, Diagonal, Colour),
        move(GameState, [Row, Diagonal, Colour], NewGameStateBoard),
        updateColours(NewGameStateBoard, NewGameState, Nplayer),
        print_move([Row, Diagonal, Colour])
    ).

% Jogada de um Computador
userPlay(GameState, NewGameState, Nplayer-(c-Level)) :-
    choose_move(GameState, Nplayer, Level, Move),
    move(GameState, Move, NewGameStateBoard),
    updateColours(NewGameStateBoard, NewGameState, Nplayer),
    print_move(Move).

% Efetua um move no Board com verificação de jogada válida
move(Board-ColoursWon, Move, NewBoard-ColoursWon) :-
    checkValidPlay(Board-ColoursWon, Move),
    updateBoard(Board, Move, NewBoard).

% Verifica se um jogador ganhou o jogo
checkPlayerWinner('TRUE'-'TRUE'-_).
checkPlayerWinner('TRUE'-_-'TRUE').
checkPlayerWinner(_-'TRUE'-'TRUE').

% Verifica a situação de Game Over
game_over(_-(Purple-Orange-Green-_-_-_), Winner) :-
    checkPlayerWinner(Purple-Orange-Green),
    Winner is 1.

game_over(_-(_-_-_-Purple-Orange-Green), Winner) :-
    checkPlayerWinner(Purple-Orange-Green),
    Winner is 2.

% Apresenta no ecrã o vencedor se o jogo acabar
check_over(GameState, _, _) :-
    game_over(GameState, Winner),
    display_game(GameState, 0),
    write('Player '), write(Winner), write(' won!'), nl.
    
check_over(GameState, Players, Player) :-
    other_player(Player, Next),
    gameLoop(GameState, Players, Next).

% Verifica se uma cor já foi ganha por algum player
checkColours(_, _, _, 'TRUE', _, 'TRUE').

checkColours(_, _, _, 'FALSE', 'TRUE', 'FALSE').

checkColours(Board, Colour, Player, 'FALSE', 'FALSE', NewColour) :-
    checkColourWon(Board, Player, Colour, ColourWon),
    NewColour = ColourWon.

% Atualiza o estado das cores (ganhas ou não) no estado do jogo
updateColours(GameState, NewGameState, 1) :-
    GameState = NewBoard-(PurpleWon1-OrangeWon1-GreenWon1-PurpleWon2-OrangeWon2-GreenWon2),
    checkColours(NewBoard, purple, 1, PurpleWon1, PurpleWon2, NewPurpleWon1),
    checkColours(NewBoard, orange, 1, OrangeWon1, OrangeWon2, NewOrangeWon1),
    checkColours(NewBoard, green, 1, GreenWon1, GreenWon2, NewGreenWon1),
    checkColours(NewBoard, purple, 2, PurpleWon2, NewPurpleWon1, NewPurpleWon2),
    checkColours(NewBoard, orange, 2, OrangeWon2, NewOrangeWon1, NewOrangeWon2),
    checkColours(NewBoard, green, 2, GreenWon2, NewGreenWon1, NewGreenWon2),
    NewGameState = NewBoard-(NewPurpleWon1-NewOrangeWon1-NewGreenWon1-NewPurpleWon2-NewOrangeWon2-NewGreenWon2).

updateColours(GameState, NewGameState, 2) :-
    GameState = FinalBoard-(NewPurpleWon1-NewOrangeWon1-NewGreenWon1-NewPurpleWon2-NewOrangeWon2-NewGreenWon2),
    checkColours(FinalBoard, purple, 2, NewPurpleWon2, NewPurpleWon1, NewPurpleWon4),
    checkColours(FinalBoard, orange, 2, NewOrangeWon2, NewOrangeWon1, NewOrangeWon4),
    checkColours(FinalBoard, green, 2, NewGreenWon2, NewGreenWon1, NewGreenWon4),
    checkColours(FinalBoard, purple, 1, NewPurpleWon1, NewPurpleWon4, NewPurpleWon3),
    checkColours(FinalBoard, orange, 1, NewOrangeWon1, NewOrangeWon4, NewOrangeWon3),
    checkColours(FinalBoard, green, 1, NewGreenWon1, NewGreenWon4, NewGreenWon3),
    NewGameState = FinalBoard-(NewPurpleWon3-NewOrangeWon3-NewGreenWon3-NewPurpleWon4-NewOrangeWon4-NewGreenWon4).

% Ciclo principal do jogo (Jogada dos dois players com verificações de cores ganhas; término de jogo e displays de informação)
gameLoop(GameState, PlayersMode, Player) :-
    display_game(GameState, Player),
    nth1(Player, PlayersMode, Mode),
    userPlay(GameState, NewGameState, Player-Mode),
    check_over(NewGameState, PlayersMode, Player).

% Verifica se uma determinada Colour foi ganha pelo Player
checkColourWon(Board, Player, Colour, ColourWon) :-
    colourTable(Player, Colour-AlliedColour-NotAlliedColour),
    colourEdges(Colour, Edge1, Edge2),
    auxCheckColourWon(Board, AlliedColour-NotAlliedColour, Edge1-Edge2, ColourWon).

auxCheckColourWon(Board, AlliedColour-NotAlliedColour, Edge1-Edge2, 'TRUE') :-
    findall(Row-Diagonal, execute(Edge1, [Row, Diagonal]), StartPoints),
    colourWonOrFence(StartPoints, AlliedColour, NotAlliedColour, 0, 0, Board, Edge2), !.

auxCheckColourWon(_, _, _, 'FALSE').    

colourWonOrFence(StartPoints, _, NotAlliedColour, Depth, DistanciaAtual, Board, Edge2) :-
    once( getDistance(StartPoints, [], NotAlliedColour, Depth, DistanciaAtual, Result, Board, Edge2) ),
    Result == 0.

colourWonOrFence(StartPoints, AlliedColour, _, _, DistanciaAtual, Board, Edge2) :-
    max_depth(MaxDepth),
    once( getDistance(StartPoints, [], AlliedColour, MaxDepth, DistanciaAtual, Result, Board, Edge2) ),
    Result == 2000.

% Dado um tabuleiro Board, unifica em Value o seu valor, sendo depois o mesmo utilizado para definir a melhor jogada no momento
value(GameState, Player, Value) :-
    findall(ColourTable, colourTable(Player, ColourTable), ColourTables),
    findall(ValueColour, ( member(Colour2-_-NotAlliedColour2, ColourTables), 
        getDistanceColour(GameState, Colour2-NotAlliedColour2, ValueColour1), transformValue(ValueColour1, ValueColour)), 
        ValueColours),
    sumlist(ValueColours, Value).

% Atribui o Valor a uma cor de acordo com a sua distância (menor distância, maior valor). Quando a cor está bloqueada o valor é 0
transformValue(2000, 0).

transformValue(Value, NewValue) :-
    Value1 is Value + 1,
    NewValue is 1 / (Value1 ** 3).

% Verifica se uma cor já foi ganha; se não então computa a distância a que o jogador se encontra para a completar
getDistanceColour(Board-ColourState, Colour-NotAlliedColour, Distance) :-  
    getColourStartingPoints(Colour, ColourState, StartPoints, Predicate),
    max_depth(MaxDepth),
    getDistance(StartPoints, [], NotAlliedColour, MaxDepth, 0, Distance, Board, Predicate), !.

% Obtém as células localizadas numa das bordas da cor pretendida, usadas para calcular a distância entre as bordas
getColourStartingPoints(purple, 'FALSE'-_-_, StartPoints, purple2) :-
    findall(Row-Diagonal, purple1(Row, Diagonal), StartPoints).
    
getColourStartingPoints(orange, _-'FALSE'-_, StartPoints, orange2) :-
    findall(Row-Diagonal, orange1(Row, Diagonal), StartPoints).

getColourStartingPoints(green, _-_-'FALSE', StartPoints, green2) :-
    findall(Row-Diagonal, green1(Row, Diagonal), StartPoints).