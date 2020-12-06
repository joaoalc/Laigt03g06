% Tipos de células
code(empty, ' ').
code(orange, 'O').
code(purple, 'P').
code(green, 'G').

% Nº Diagonal | Cor
info(1, ' [G]').
info(2, ' [G]').
info(3, ' [G]').
info(4, ' [G]').
info(5, ' [G]').
info(6, ' [G]').
info(8, '  [O]').
info(9, '  [O]').
info(10, ' [O]').
info(11, ' [O]').
info(12, ' [O]').
info(13, ' [P]').

% Display da direita do board 
line(1, '                     1').
line(2,     '                 2').
line(3,         '             3').
line(4,             '         4 ').
line(5,         '             5 .________________________________________________.').
line(6,           '           6 |        |                PLAYER 1               |').
line(7,            '          7 |________|_______________________________________|').
line(8,                   '   8 | Colour |   PURPLE   |    ORANGE   |   GREEN    |').
line(9,             '         9 | Allied |   Orange   |    Green    |   Purple   |').
line(10,                  '  10 |________|____________|_____________|____________|').
line(11,            '        11').
line(12,                  '  12 .________________________________________________.').
line(13,            '        13 |        |                PLAYER 2               |').
line(14,                  '  14 |________|_______________________________________|').
line(15,            '        15 | Colour |   PURPLE   |    ORANGE   |   GREEN    |').
line(16,                  '  16 | Allied |   Green    |    Purple   |   Orange   |').
line(17,            '        17 |________|____________|_____________|____________|').
line(18,        '            18').
line(19,          '          19').
line(20,           '         20').
line(21,       '             21').
line(22,   '                 22').
line(23,  '                     23').

% Line | Start Diagonal   
startDiag(1, 1).
startDiag(2, 1).
startDiag(3, 1).
startDiag(4, 1).
startDiag(5, 1).
startDiag(6, 2).
startDiag(7, 2).
startDiag(8, 2).
startDiag(9, 3).
startDiag(10, 3).
startDiag(11, 4).
startDiag(12, 4).
startDiag(13, 5).
startDiag(14, 5).
startDiag(15, 6).
startDiag(16, 6).
startDiag(17, 7).
startDiag(18, 8).
startDiag(19, 8).
startDiag(20, 9).
startDiag(21, 10).
startDiag(22, 11).
startDiag(23, 12).

% Purple Upper Border
purple1(1,1).
purple1(2,1).
purple1(3,1).
purple1(4,1).
purple1(5,1).

% Purple Lower Border
purple2(19,13).
purple2(20,13).
purple2(21,13).
purple2(22,13).
purple2(23,13).

% Green Upper Border
green2(1,2).
green2(2,3).
green2(3,4).
green2(4,5).
green2(5,6).

% Green Lower Border
green1(19,8).
green1(20,9).
green1(21,10).
green1(22,11).
green1(23,12).

% Orange Left Border
orange1(8, 2).
orange1(10,3).
orange1(12,4).
orange1(14,5).
orange1(16,6).

% Orange Right Border
orange2(8, 8).
orange2(10,9).
orange2(12,10).
orange2(14,11).
orange2(16,12).

% Nomes dos predicados associados às borders de cada cor
%            Cor | Borda 1 | Borda 2
colourEdges(purple, purple1, purple2).
colourEdges(orange, orange1, orange2).
colourEdges(green, green1, green2).

%    Player | Cor | Cor Aliada | Cor Não Aliada
colourTable(1, purple-orange-green). 
colourTable(1, orange-green-purple).
colourTable(1, green-purple-orange).
colourTable(2, purple-green-orange).
colourTable(2, orange-purple-green).
colourTable(2, green-orange-purple). 

% Initial Game State
initial([
    [                                         empty,    empty],                            %1
    [                                     empty,   empty,   empty],                         %2
    [                                empty,    empty,   empty,  empty],                     %3
    [                           empty,    empty,    empty,   empty,   empty],               %4
    [                      empty,    empty,    empty,   empty,   empty,   empty],           %5
    [                          empty,     empty,   empty,   empty,    empty],               %6
    [                      empty,    empty,    empty,   empty,   empty,   empty],           %7 
    [                 empty,   empty,     empty,   empty,   empty,    empty,   empty],      %8
    [                      empty,    empty,    empty,   empty,  empty,   empty],           %9
    [                 empty,   empty,     empty,    empty,   empty,    empty,   empty],      %10
    [                      empty,    empty,    empty,   empty,  empty,   empty],           %11
    [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      %12
    [                      empty,    empty,    empty,   empty,  empty,   empty],           %13
    [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      %14
    [                      empty,    empty,    empty,   empty,   empty,   empty],           %15
    [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      %16
    [                      empty,    empty,    empty,   empty,   empty,   empty],           %17
    [                           empty,    empty,   empty,    empty,   empty],               %18
    [                      empty,    empty,    empty,   empty,   empty,   empty],           %19
    [                           empty,    empty,   empty,   empty,   empty],                %20
    [                                empty,    empty,   empty,   empty],                    %21
    [                                     empty,   empty,   empty],                         %22
    [                                          empty,   empty]                              %23
    ]-('FALSE'-'FALSE'-'FALSE'-'FALSE'-'FALSE'-'FALSE')).


% Pontos Adjacentes
adjacent(Row1-Diagonal1, Row2-Diagonal2) :-
    Row1 is Row2 + 1, Diagonal1 is Diagonal2 + 1.

adjacent(Row1-Diagonal1, Row2-Diagonal2) :-
    Row1 is Row2 + 1, Diagonal1 is Diagonal2.

adjacent(Row1-Diagonal1, Row2-Diagonal2) :-
    Row1 is Row2 + 2, Diagonal1 is Diagonal2 + 1.

adjacent(Row1-Diagonal1, Row2-Diagonal2) :-
    Row1 is Row2 - 1, Diagonal1 is Diagonal2.

adjacent(Row1-Diagonal1, Row2-Diagonal2) :-
    Row1 is Row2 - 1, Diagonal1 is Diagonal2 - 1.

adjacent(Row1-Diagonal1, Row2-Diagonal2) :-
    Row1 is Row2 - 2, Diagonal1 is Diagonal2 - 1.

% Adjacentes de um dado nível de profundidade (inclui empty)
validAdjacent(NivelAtual, RowAdj-DiagAdj, NotAlliedColour, Visitados, Board) :-
    member(Ponto, NivelAtual),
    adjacent(RowAdj-DiagAdj, Ponto),
    \+member(RowAdj-DiagAdj, Visitados),
    getCellByCoords(Board, RowAdj, DiagAdj, Cell),
    Cell \= NotAlliedColour.

% Verifica se a célula corresponde à colour border
checkReached([Row-Diagonal| _ ], Predicate) :-
    execute(Predicate, [Row,Diagonal]).

checkReached([_|RestoDoNivel], Predicate) :-
    checkReached(RestoDoNivel, Predicate).

% Adjacentes aliados (própria cor + cor aliada)
adjacentAllied(Pontos, NotAlliedColour, Visitados, Board, Row-Diag) :-
    member(Ponto, Pontos),
    adjacent(Row-Diag, Ponto),
    \+member(Row-Diag, Visitados),
    getCellByCoords(Board, Row, Diag, Cell),
    Cell \= NotAlliedColour,
    Cell \= empty.

% Lista de células adjacentes total para um dado nível
getAdjList([], _, _, _, Lista, Resultado) :-
    Resultado = Lista.

getAdjList(Pontos, NotAlliedColour, Visited, Board, Lista, Resultado) :-
    append(Pontos, Lista, NovaLista),
    append(NovaLista, Visited, NovaLista1),
    setof(Ponto, adjacentAllied(Pontos, NotAlliedColour, NovaLista1, Board, Ponto), Adjacentes),   
    getAdjList(Adjacentes, NotAlliedColour, Visited, Board, NovaLista, Resultado).

getAdjList(Pontos, NotAlliedColour, Visited, Board, Lista, Resultado) :-
    append(Pontos, Lista, NovaLista),
    getAdjList([], NotAlliedColour, Visited, Board, NovaLista, Resultado).

% Computa o nível 0 (0 jogadas de distância) e o nível 1 (1 jogada de distância) para os algoritmos do bot. 
getDistance(PontosDoNivelAtual, JaVisitados, NotAlliedColour, Depth, 0, Resultado, Board, Predicate) :-
    findall(Row-Diag, 
        (member(Row-Diag, PontosDoNivelAtual), getCellByCoords(Board, Row, Diag, Cell), Cell \= NotAlliedColour, Cell \= empty)
        , PontosAliados),
    
    getAdjList(PontosAliados, NotAlliedColour, JaVisitados, Board, [], LevelZero),
    (
        (
            checkReached(LevelZero, Predicate),
            Resultado is 0
        );
        (
            (   (
                    setof(Row-Diag, (
                        member(Row-Diag, PontosDoNivelAtual),
                        getCellByCoords(Board, Row, Diag, Cell), 
                        Cell == empty      
                    ), Part1)
                ); Part1 = []
            ),
            append(LevelZero, Part1, Visitados),
            (
                setof(Ponto, validAdjacent(LevelZero, Ponto, NotAlliedColour, Visitados, Board), Part2);
                Part2 = []
            ),
            append(Part1, Part2, Part3),
            

            (
                (
                    setof(Row1-Diag1, 
                    ( 
                        validAdjacent(Part3, Row1-Diag1, NotAlliedColour, Visitados, Board),
                        getCellByCoords(Board, Row1, Diag1, Cell1), Cell1 \= empty, Cell1 \= NotAlliedColour
                    ), NovoNivelAdjacentes)
                );
                NovoNivelAdjacentes = []
            ),
            append(LevelZero, Part3, Visited1),
            getAdjList(NovoNivelAdjacentes, NotAlliedColour, Visited1, Board, [], Part4),
            append(Part3, Part4, LevelOne),
            !, getDistance(LevelOne, LevelZero, NotAlliedColour, Depth, 1, Resultado, Board, Predicate)
        )  
    ).
    
% Quando a profundidade máxima é atingida ou o próximo nível está vazio, a distância é considerada como 2000
getDistance( _, _, _, Depth, DistanciaAtual, Resultado, _, _) :- 
    DistanciaAtual > Depth,
    Resultado is 2000.

getDistance([], _, _, _, _, Resultado, _, _) :- 
    Resultado is 2000.

getDistance(NivelAtual, _, _, _, DistanciaAtual, Resultado, _, Predicate) :- % encontrou distancia
    checkReached(NivelAtual, Predicate),
    Resultado is DistanciaAtual.

% Computa os restantes níveis de profundidade recursivamente
getDistance(PontosDoNivelAtual, JaVisitados, NotAlliedColour, Depth, DistanciaAtual, Resultado, Board, Predicate) :-
    append(PontosDoNivelAtual, JaVisitados, Visitados),
    Depth >= DistanciaAtual,

    (
        setof(Ponto, validAdjacent(PontosDoNivelAtual, Ponto, NotAlliedColour, Visitados, Board) , Parte1); 
        Parte1 = []
    ),
    findall(Row-Diag, (member(Row-Diag, Parte1), getCellByCoords(Board, Row, Diag, Cell), Cell \= empty, Cell \= NotAlliedColour), PontosAliados),
    getAdjList(PontosAliados, NotAlliedColour, Board, Visitados, [], Parte2),
    append(Parte1, Parte2, NovoNivel),
    (
        (
            setof(Row1-Diag1, 
            ( 
                validAdjacent(NovoNivel, Row1-Diag1, NotAlliedColour, NovoNivel, Board),
                getCellByCoords(Board, Row1, Diag1, Cell1), Cell1 \= empty, Cell1 \= NotAlliedColour
            ), NovoNivelAdjacentes)
        );
        NovoNivelAdjacentes = []
    ),

    getAdjList(NovoNivelAdjacentes, NotAlliedColour, Board, NovoNivel, [], Parte3),
    
    append(NovoNivel, Parte3, Nivel),
    NovaDistancia is DistanciaAtual + 1,

    getDistance(Nivel, Visitados, NotAlliedColour, Depth, NovaDistancia, Resultado, Board, Predicate).

% Update ao Board no ato de uma nova jogada
updateBoard(Board, [Row, Diagonal, Colour], NewBoard) :-
    nth1(Row, Board, Line),
    startDiag(Row, StartDiagonal),
    IndexDiagonal is (Diagonal - StartDiagonal),
    replaceNth(Line, IndexDiagonal, Colour, NewLine),
    RowToUpdate is Row - 1,
    replaceNth(Board, RowToUpdate, NewLine, NewBoard), !.

% Verifica se uma determinada célula está vazia
checkEmpty([Row, Diagonal, _], Board) :-
    getCellByCoords(Board, Row, Diagonal, Cell),
    Cell == 'empty'.

% Unifica em Cell a célula com as coordenadas definidas, falha se as coordenadas estiverem fora do tabuleiro
getCellByCoords(Board, Row, Diagonal, Cell) :-
    verifyCoordinates(Row, Diagonal),
    nth1(Row, Board, Line),
    startDiag(Row, StartDiagonal),
    Index is (Diagonal - StartDiagonal),
    nth0(Index, Line, Cell).

% Espaços do lado esquerdo para cada linha e respetiva informação
spaces([[17, '[P]'], [13,'[P]'], [9, '[P]'], [5, '[P]'], [4, '   '], [4, '   '], [1, '   '], [0, '[O]'], [0, '   '], [0, '[O]'], [0, '   '], [0, '[O]'], [0, '   '], [0, '[O]'], [0, '   '], [0, '[O]'], [0, '   '], [4, '   '], [4, '   '], [4, '[G]'], [8, '[G]'], [12, '[G]'], [16, '[G]']]).

% Imprime a Info de cada linha
printLineInfo(Nline) :-
    info(Nline, Info),
    write(Info).

% Imprime a Info de cada linha e número
printLineNumber(Nline) :-
    line(Nline, Info),
    write(Info).

% Imprime a cor de uma célula
printColour(Colour) :- write(Colour).

% Imprime o board na consola (última linha)
print_board([], _) :- 
    printSpaces(20), write('[G]'), put_code(9586), write('___'), put_code(9585), write('   '), put_code(9586), write('___'), put_code(9585), write('[P]'), nl.

% Imprime o board na consola 
print_board([L | Board], Line) :-
    print_line(L, Line),
    NewLine is Line + 1,
    print_board(Board, NewLine).

% Imprime o board na consola (primeira linha)
print_line1(_, 1) :-
    printSpaces(21), write('[P]___  1  ___ 2'), printLineInfo(2), nl.
print_line1(_, _).
    
% Imprime uma linha do tabuleiro 
print_line([Cell | Line], Nline) :-
    print_line1(_, Nline),
    getSpaces(Spaces, Nline, Colour),
    printSpaces(Spaces),
    printColour(Colour),
    specificPrint_line(Cell, Line, Nline),
    printLineNumber(Nline),
    nl.

% Casos de linhas específicas
specificPrint_line(Cell, Line, Nline) :-
    Nline =< 4,
    print_case1([Cell | Line], Nline).

specificPrint_line(Cell, Line, 7) :-
    print_case1([Cell | Line], 7).

specificPrint_line(Cell, Line, Nline) :-
    member(Nline, [5, 8, 10, 12, 14, 16, 19]),
    print_case2([Cell | Line], 0, Nline).

specificPrint_line(Cell, Line, Nline) :-
    member(Nline, [6, 9, 11, 13, 15, 17, 18, 20, 21, 22, 23]),
    print_case3([Cell | Line], Nline).

% Obtém os espaços de cada linha
getSpaces(Spaces, Nline, Colour) :-
    spaces(Aux),
    nth1(Nline, Aux, AuxSpaces),
    nth0(0, AuxSpaces, Spaces),
    nth0(1, AuxSpaces, Colour).

% Imprime os espaços da esquerda de cada linha
printSpaces(0).
printSpaces(Nspaces) :-
    write(' '),
    NewNspaces is Nspaces - 1,
    printSpaces(NewNspaces).
    
% 1º Tipo de linha hexagonal
print_case1([], Nline) :- 
    write('___'), 
    Nline =< 5,
    Diagonal is Nline + 2, 
    write(Diagonal), printLineInfo(Diagonal).
print_case1([], _).

print_case1([Cell | Line], Nline) :- % partes de cima
    write('___'),
    put_code(9585),
    write(' '),  
    code(Cell, P),             %  ___/ c \
    write(P),
    write(' '),
    put_code(9586),
    print_case1(Line, Nline).

% 2º Tipo de linha hexagonal
print_case2([], _, 10) :- write('9'), printLineInfo(9).
print_case2([], _, 12) :- write('10'), printLineInfo(10).
print_case2([], _, 14) :- write('11'), printLineInfo(11).
print_case2([], _, 16) :- write('12'), printLineInfo(12).
print_case2([], _, 19) :- write('13').
print_case2([], _, 8) :- write('8'), printLineInfo(8).
print_case2([], _, _).

print_case2([Cell | Line], Col, Nline) :- %parte sem lados
    print_case_2_aux(Cell, Col),
    NewCol is Col + 1,
    print_case2(Line, NewCol, Nline).

print_case_2_aux(Cell, 0) :-
    put_code(9585),  %  / c \
    write(' '),
    code(Cell, P),
    write(P),            
    write(' '),       
    put_code(9586).

print_case_2_aux(Cell, _) :-
    write('___'),
    put_code(9585),
    write(' '),
    code(Cell, P),     % ___/ c \
    write(P),
    write(' '),
    put_code(9586).

% 3º Tipo de linha hexagonal
print_case3([], Nline) :- 
    put_code(9586), 
    write('___'),
    put_code(9585),
    print_case_3_aux(Nline).

print_case3([Cell | Line], Nline) :- % partes de baixo
    put_code(9586),
    write('___'),
    put_code(9585),
    write(' '),
    code(Cell, P),       %  \___/ c
    write(P),
    write(' '),
    print_case3(Line, Nline).

print_case_3_aux(6) :- write(' 7').
print_case_3_aux(Nline) :- Nline >= 19, write('[P]').
print_case_3_aux(_).

