% Depth máxima que o algoritmo greedy suporta (cobre todos os caminhos possíveis)
max_depth(2000).

% Escolhe a jogada a efetuar pelo computador para o nível Level (Random ou Greedy)
choose_move(GameState, Player, Level, Move) :-
    valid_moves(GameState, ListOfMoves),
    getMove(GameState, Level, ListOfMoves, Move, Player).

getMove(_, random, ListOfMoves, Move, _) :- 
    sleep(1),
    random_member(Move, ListOfMoves).

getMove(Board-(PurpleWon1-OrangeWon1-GreenWon1-PurpleWon2-OrangeWon2-GreenWon2), Level, ListOfMoves, Move, Player) :-
    colourWonBoth(PurpleWon1, PurpleWon2, PurpleWon),
    colourWonBoth(GreenWon1, GreenWon2, GreenWon),
    colourWonBoth(OrangeWon1, OrangeWon2, OrangeWon),
    
    getMoveAux(Board-(PurpleWon-OrangeWon-GreenWon), Player, ListOfMoves, Level, ValueMoveList),
    max_member(ValueMax-_, ValueMoveList),
    findall(Value1-MoveBest, (member(Value1-MoveBest, ValueMoveList), Value1 == ValueMax), BestMoves),

    random_member(_-ChosenMove, BestMoves),
    Move = ChosenMove.

% Para o modo greedy, calcula a melhor jogada com base nas movimentações possíveis do próprio jogador
getMoveAux(Board-ColoursWon, Player, ListOfMoves, greedy, ValueMoveList) :-
    findall(Value-Move1, ( 
        member(Move1, ListOfMoves), updateBoard(Board, Move1, NewBoard), value(NewBoard-ColoursWon, Player, Value)
    ), ValueMoveList).
    
% Para o modo greedy 'difícil', calcula-se o valor do tabuleiro pela perspetiva do jogador inimigo e subtrai-se ao do jogador atual 
% para obter uma melhor aproximação da próxima melhor jogada
getMoveAux(Board-ColoursWon, Player, ListOfMoves, greedy_hard, ValueMoveList) :-
    other_player(Player, OtherPlayer),
    findall(ValueTotal-Move1, ( 
        member(Move1, ListOfMoves), updateBoard(Board, Move1, NewBoard), value(NewBoard-ColoursWon, Player, Value1),
        value(NewBoard-ColoursWon, OtherPlayer, Value2), ValueTotal is Value1 - Value2**2
    ), ValueMoveList).


% Verifica se uma cor já foi ganha (para depois não a processar no algoritmo de path finding do bot)
colourWonBoth('TRUE', _, 'TRUE').
colourWonBoth(_, 'TRUE', 'TRUE').
colourWonBoth('FALSE', 'FALSE', 'FALSE').

% Obtém a lista de moves válidos para a próxima jogada 
valid_moves(Board-ColoursWon, ListOfMoves) :-
    searchBoard(Board, [], List, 1),
    findall(Move, 
        (
            member(Move, List), 
            checkValidMove(Board-ColoursWon, Move)
        ), ListOfMoves).

% Verifica se uma jogada é válida; isto é, se a célula está vazia e se existem discos suficientes para efetuar essa jogada.
checkValidMove(Board-ColoursWon, [Row, Diagonal, Colour]) :-
    checkEmpty([Row, Diagonal, Colour], Board),
    checkAvailableDisc(Board-ColoursWon, Colour).



    