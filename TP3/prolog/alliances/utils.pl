% Lê um inteiro com deteção de erros
getInt(Int) :- 
    repeat,
    getIntAux(Int).

getIntAux(Int) :-
    catch(read(Int), _, true),
    read_line(_),
    integer(Int),
    nl.

getIntAux(_) :-
    write('Invalid input! Please try again.'), nl,
    fail.

% Lê um inteiro sem deteção de erros
getNewInt(Int) :-
    (
        catch(read(Int), _, true),
        read_line(_),
        integer(Int),
        nl
    ).

% Lê um carater
getChar(Char) :-
    get_char(Char),
    read_line(Line),!,
    (Line == ""; Line == "."),
    nl.

% Substitui o elemento de índice Index numa lista List, unificando com NewList
% replaceNth(+List, +Index, +Value, -NewList).
replaceNth([_|T], 0, X, [X|T]).
replaceNth([H|T], I, X, [H|R]):- I > -1, NI is I-1, replaceNth(T, NI, X, R), !.
replaceNth(L, _, _, L).

% Contar numero de vezes que elemento Value aparece na lista List
% countOccurrence(+List, +Value, -Count)
countOccurrence([] , _,0). % empty list, count of anything is 0. Base case.

countOccurrence([H|T] , H,NewCount):-
    countOccurrence(T,H, OldCount),
    NewCount is OldCount + 1.

countOccurrence([H|T], H2, Count):-
    H \= H2, 
    countOccurrence(T,H2,Count).

% Utilizado sobretudo na verificação se uma célula pertence a uma border (através do predicado correto)
execute(Function, Args) :-
    Run =.. [Function | Args], 
    Run.

% Se uma cor for ganha, então é retirado um disco 
incrementColourDiscWon('FALSE', NumDiscs, NumDiscs).
incrementColourDiscWon('TRUE', NumDiscs, NewNumDiscs) :-
    NewNumDiscs is mod(NumDiscs + 1, 43).

% Conta quantos discos há de cada cor com avaliação se a mesma já foi ganha (implica menos 1 disco)
countDiscs(Board-(PurpleWon1-OrangeWon1-GreenWon1-PurpleWon2-OrangeWon2-GreenWon2), TotalOrangeDiscs, TotalGreenDiscs, TotalPurpleDiscs) :-
    countTotalDiscs(Board, OrangeDiscs, GreenDiscs, PurpleDiscs),
    colourWonBoth(PurpleWon1, PurpleWon2, PurpleWon),
    colourWonBoth(GreenWon1, GreenWon2, GreenWon),
    colourWonBoth(OrangeWon1, OrangeWon2, OrangeWon),
    incrementColourDiscWon(PurpleWon, PurpleDiscs, TotalPurpleDiscs),
    incrementColourDiscWon(GreenWon, GreenDiscs, TotalGreenDiscs),
    incrementColourDiscWon(OrangeWon, OrangeDiscs, TotalOrangeDiscs).

% Conta quantos discos há de cada cor
countTotalDiscs([], 0, 0, 0).
countTotalDiscs([Line | Rest], OrangeDiscs, GreenDiscs, PurpleDiscs) :-
    countOccurrence(Line, orange, AuxOrangeDiscs),
    countOccurrence(Line, green, AuxGreenDiscs),
    countOccurrence(Line, purple, AuxPurpleDiscs),
    countTotalDiscs(Rest, Oranges, Greens, Purples),
    OrangeDiscs is Oranges + AuxOrangeDiscs,
    GreenDiscs is Greens + AuxGreenDiscs,
    PurpleDiscs is Purples + AuxPurpleDiscs.

% Unifica uma lista List com todas as células do board 
searchBoard(_, List, ResultAll, LineCounter) :- LineCounter == 24, ResultAll = List.
searchBoard(Board, List, ResultAll, LineCounter) :-
    LineCounter =< 23,
    nth1(LineCounter, Board, Line),
    length(Line, LineLength),
    startDiag(LineCounter, StartDiagonal),
    lookUpLine(LineCounter, StartDiagonal, LineLength, [], Result, 0),
    append(List, Result, NewList),
    NewLineCounter is LineCounter + 1,
    searchBoard(Board, NewList, ResultAll, NewLineCounter).

% Garante que cada uma dessas células têm 3 cores possíveis de jogada (Orange, Green, Purple)
lookUpLine(_, _, LineLength, List, Result, Index) :- Index == LineLength, Result = List.
lookUpLine(LineCounter, StartDiagonal, LineLength, List, Result, Index) :-
    Index < LineLength,
    (
        NewDiagonal is StartDiagonal + Index,

        append(List, [[LineCounter, NewDiagonal, green]], NewList),
        append(NewList, [[LineCounter, NewDiagonal, orange]], NewList1),
        append(NewList1, [[LineCounter, NewDiagonal, purple]], NewList2)
    ),
    NewIndex is Index + 1,
    lookUpLine(LineCounter, StartDiagonal, LineLength, NewList2, Result, NewIndex).
    
    
clearConsole :- write('\33\[2J').
