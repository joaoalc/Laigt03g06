% Parse do input do utilizador pelas coordenadas e pela cor 
getUserInput(Row, Diagonal, Colour) :- 
    getCoordinates(Row, Diagonal),
    getColour(Colour), !.

% Recebe o input das coordenadas e verifica a existência de erros
getCoordinates(Row, Diagonal) :-
    repeat,
    (
        getRow(Row),
        getDiagonal(Diagonal)
    ), !,
    getCoordinatesAux(Row, Diagonal).

getCoordinatesAux(Row, Diagonal) :-
    verifyCoordinates(Row, Diagonal).

getCoordinatesAux(_, _) :-
    write('Invalid coordinates!'), nl,
    fail.

% Input da Row
getRow(Row) :-
    write('Insert Row [1 - 23]: '),
    getInt(Row).

% Input da Diagonal
getDiagonal(Diagonal) :-
    write('Insert Diagonal [1 - 13]: '),
    getInt(Diagonal).

% Input da Colour
getColour(ColourAtom) :-
    repeat,
    getColourAux(ColourAtom).

getColourAux(ColourAtom) :-
    write('Insert Colour [G, O, P]: '),
    getChar(Colour),
    verifyColour(Colour),
    code(ColourAtom, Colour).

getColourAux(_) :- write('Invalid Colour!'), nl, fail.

% Verifica se a Colour obedece aos padrões definidos
verifyColour('G').
verifyColour('P').
verifyColour('O').
    
% Verifica se as coordenadas são válidas
verifyCoordinates(Row, Diagonal) :-       
    verifyRow(Row),
    verifyDiagonal(Diagonal),
    verifyRowDiagonal(Row, Diagonal).

% Verifica se a Row é válida
verifyRow(Row) :-
    between(1, 23, Row).

% Verifica se a Diagonal é válida
verifyDiagonal(Diagonal) :-
    between(1, 13, Diagonal).

% Verifica se o conjunto Row + Diagonal é válido
verifyRowDiagonal(Row, Diagonal) :-
    initial(Board-_),
    startDiag(Row, StartDiagonal),
    nth1(Row, Board, Line),
    length(Line, Len), 
    MaxDiagonal is (StartDiagonal + Len),
    Diagonal >= StartDiagonal, Diagonal < MaxDiagonal. 
    
