function loadPage() {
    newGame();
    listenSente();
}

const validHandPieces = ["🐶", "🐱", "🐤"];

class Piece {
    constructor(name, promotion, moves) {
        this.displayName = name;
        this.promotion = promotion;
        this.validMoves = moves;
    }
}

//fuhyou, "pawn"
const chick = new Piece(
    "🐤",
    "🐔",
    null
);

//ginshou, "silver"
const cat = new Piece(
    "🐱",
    "😽",
    null
);

//kinshou, "gold"
const dog = new Piece(
    "🐶",
    null,
    null
);

//oushou, "king"
const lion = new Piece(
    "🦁",
    null,
    null
);

const PIECES = [chick, cat, dog, lion];
const PROMOTABLE_PIECES = ['🐤', '🐱'];
const PROMOTED_PIECES = ['🐔', '😽'];

const LEFT_EDGE = 5, BOTTOM_ROW = 6;

const GAME_STATE = {
    "11": '',
    "12": '',
    "13": '',
    "14": '',
    "15": '',
    "16": '',
    "21": '',
    "22": '',
    "23": '',
    "24": '',
    "25": '',
    "26": '',
    "31": '',
    "32": '',
    "33": '',
    "34": '',
    "35": '',
    "36": '',
    "41": '',
    "42": '',
    "43": '',
    "44": '',
    "45": '',
    "46": '',
    "51": '',
    "52": '',
    "53": '',
    "54": '',
    "55": '',
    "56": '',
    "sente-captures": [],
    "gote-captures": [],
    "player-turn": "sente",
    "check": false,
    "check-origin": null
}

function newGame() {
    GAME_STATE["11"] = {
        "piece": "🐱",
        "side": "gote"
    };
    GAME_STATE["16"] = {
        "piece": "🐱",
        "side": "sente"
    };
    GAME_STATE["21"] = {
        "piece": "🐶",
        "side": "gote"
    };
    GAME_STATE["23"] = {
        "piece": "🐤",
        "side": "gote"
    };
    GAME_STATE["24"] = {
        "piece": "🐤",
        "side": "sente"
    };
    GAME_STATE["26"] = {
        "piece": "🐶",
        "side": "sente"
    };
    GAME_STATE["31"] = {
        "piece": "🦁",
        "side": "gote"
    };
    GAME_STATE["33"] = {
        "piece": "🐤",
        "side": "gote"
    };
    GAME_STATE["34"] = {
        "piece": "🐤",
        "side": "sente"
    };
    GAME_STATE["36"] = {
        "piece": "🦁",
        "side": "sente"
    };
    GAME_STATE["41"] = {
        "piece": "🐶",
        "side": "gote"
    };
    GAME_STATE["43"] = {
        "piece": "🐤",
        "side": "gote"
    };
    GAME_STATE["44"] = {
        "piece": "🐤",
        "side": "sente"
    };
    GAME_STATE["46"] = {
        "piece": "🐶",
        "side": "sente"
    };
    GAME_STATE["51"] = {
        "piece": "🐱",
        "side": "gote"
    };
    GAME_STATE["56"] = {
        "piece": "🐱",
        "side": "sente"
    };
    GAME_STATE["sente-captures"] = [];
    GAME_STATE["gote-captures"] = [];
    GAME_STATE["player-turn"] = "sente";
    GAME_STATE["player-turn"] = "false";
    GAME_STATE["check-origin"] = "false";

    updateHTML();
}

function updateHTML() {
    for (position in GAME_STATE) {
        if(position.length === 2) {
            const pieceExists = GAME_STATE[position].piece;
    
            if (pieceExists) {
                displayPiece(position);
            } else {
                $(`#${position}`).html('');
            }
        }
    }
}

function displayPiece(position) {
    // make js
    const selector = $(`#${position}`);
    const pieceSide = GAME_STATE[position].side;
    const pieceName = GAME_STATE[position].piece;

    selector.html(
        `<div class="${pieceSide} piece">${pieceName}</div>`
    );
}

function selectPiece(pieceSelector) {
    const piece = $(pieceSelector);
    const square = $(pieceSelector).parent().attr('id');
    const isHandPiece = (square === "01" || square === "02");

    $('.piece').removeClass('selected');
    $('.possible-move').removeClass('possible-move');

    piece.addClass('selected');

    if(isHandPiece) {
        readyDrop(pieceSelector);
    } else {
        readyMove(square);
    }
}

function readyDrop(pieceSelector) {
    const piece = $(pieceSelector);
    const validDrops = findValidDrops(piece);

    highlightValidMoves(validDrops);
    listenDrops(pieceSelector, validDrops);
}

function readyMove(position) {
    const validMoves = findValidMoves(position);

    highlightValidMoves(validMoves);
    listenMove(position, validMoves);
}

function highlightValidMoves(movesArray) {
    if(movesArray.length > 0) {
        movesArray.forEach(move => {
            const thisSquare = $(`#${move}`);
            thisSquare.append(`<div class='possible-move'></div>`);
        });
    }
}

//listeners
function listenSente() {
    GAME_STATE["player-turn"] = "sente";

    $('.gote.piece').off('click');
    $('.sente.piece').on('click', (e) => {
        selectPiece(e.currentTarget);
    });
}

function listenGote() {
    GAME_STATE["player-turn"] = "gote";

    $('.sente.piece').off('click');
    $('.gote.piece').on('click', (e) => {
        selectPiece(e.currentTarget);
    });
}

function listenMove(position, validMoves) {
    const piece = GAME_STATE[position].piece;

    $('.square').off('click');
    $('.square').on('click', (e) => {
        const clickedSquare = e.currentTarget.id;
        const validity = validMoves.indexOf(parseInt(clickedSquare));

        const promotionZonePassed = (isInPromotionZone(position) || isInPromotionZone(clickedSquare));
        const pieceIsPromotable = PROMOTABLE_PIECES.indexOf(piece) !== -1;

        const pieceCanPromote = (promotionZonePassed && pieceIsPromotable);

        if (validity !== -1 && pieceCanPromote) {
            promptPromotion(position, clickedSquare);
        } else if (validity !== -1) {
            movePiece(position, clickedSquare);
        }
    });
}

function listenPromotion(oldSquare, newSquare) {
    let piece = GAME_STATE[oldSquare].piece;

    $('#confirm').off('click');
    $('#cancel').off('click');

    $('#confirm').on('click', () => {
        promote(piece, oldSquare);
        movePiece(oldSquare, newSquare);

        $('.prompt').fadeOut('instant');
    });
    $('#cancel').on('click', () => {
        movePiece(oldSquare, newSquare);

        $('.prompt').fadeOut('instant');
    });
}

function listenDrops(pieceSelector, validDrops) {
    $('.square').off('click');

    $('.square').on('click', (e) => {
        const clickedSquare = e.currentTarget.id;
        const validity = validDrops.indexOf(parseInt(clickedSquare));

        if (validity !== -1) {
            dropPiece(pieceSelector, clickedSquare);
        }
    });
}

function movePiece(oldSquare, newSquare) {
    $('.square').off('click');

    let piece = GAME_STATE[oldSquare].piece;
    let side = GAME_STATE[oldSquare].side;

    $('.previous-move').removeClass('previous-move');
    $('.possible-move').removeClass('possible-move');

    $(`#${oldSquare}.piece`).removeClass('selected');
    $(`#${newSquare}`).addClass('previous-move');

    if (GAME_STATE[newSquare].piece) {
        capturePiece(newSquare);
    }

    GAME_STATE[oldSquare] = '';
    GAME_STATE[newSquare] = {
        "piece": piece,
        "side": side
    };

    if(kingIsInCheck(newSquare)) {
        console.log('king in check');
        GAME_STATE['check'] = true;
        GAME_STATE['check-origin'] = newSquare;
    } else {
        GAME_STATE['check'] = false;
        GAME_STATE['check-origin'] = null;
    }

    updateHTML();
    side === 'sente' ? listenGote() : listenSente();
}

function capturePiece(position) {
    let capturedPiece = GAME_STATE[position].piece;
    let capturingSide = (GAME_STATE[position].side === 'sente' ? 'gote' : 'sente');

    if (PROMOTED_PIECES.indexOf(capturedPiece) !== -1) {
        capturedPiece = capturePromotedPiece(capturedPiece);
    }
    GAME_STATE[`${capturingSide}-captures`].push(capturedPiece);
    $(`.${capturingSide}-hand`).append(`<div class="${capturingSide} piece">${capturedPiece}</div>`);
}

function capturePromotedPiece(piece) {
    switch (piece) {
        case '🐔':
            return '🐤';
        case '😽':
            return '🐱';
        default:
            return piece;
    }
}

function isInPromotionZone(position) {
    if (GAME_STATE["player-turn"] === 'sente') {
        return (
            position % 10 === 1 || position % 10 === 2
        )
    } else {
        return (
            position % 10 === 5 || position % 10 === 6
        )
    }
}

function promptPromotion(oldSquare, newSquare) {
    let piece = GAME_STATE[oldSquare].piece;
    const thisSquare = $(`#${oldSquare}`);

    $('.possible-move').remove();

    thisSquare.append(`
    <div class="prompt">
        <button id="cancel">${piece}</button> => <button id="confirm">${promotionHandler(piece)}</button>?
    </div>
    `);
    $('.prompt').fadeIn('fast');
    listenPromotion(oldSquare, newSquare);
}

function promote(thisPiece, position) {
    const promoteTo = promotionHandler(thisPiece);

    GAME_STATE[position].piece = promoteTo;
}

function dropPiece(pieceSelector, position) {
    $('.square').off('click');

    const piece = $(pieceSelector).text();
    const side = GAME_STATE['player-turn'];

    $('.previous-move').removeClass('previous-move');
    $('.possible-move').removeClass('possible-move');

    $(`#${position}`).addClass('previous-move');

    GAME_STATE[position] = {
        "piece": piece,
        "side": side
    };

    pieceSelector.remove();

    if(kingIsInCheck(position)) {
        console.log('king in check');
        GAME_STATE['check'] = true;
        GAME_STATE['check-origin'] = position;
    }

    updateHTML();
    side === 'sente' ? listenGote() : listenSente();
}

function kingIsInCheck(thisMove) {
    // NOTE: this works for GoroGoro, because there are no discovered checks
    // but it won't work in a game with ranged pieces
    const side = GAME_STATE[thisMove].side;
    const nextMoves = findValidMoves(thisMove);

    let isCheck = false;
    
    let i = 0;
    while (i<nextMoves.length) {
        const move = nextMoves[i];
        
        const kingExists = GAME_STATE[move].piece === '🦁';
        const isEnemyKing = GAME_STATE[move].side !== side;

        if(kingExists && isEnemyKing) {
            isCheck = true;
            break;
        }
        i++;
    }

    return isCheck;
}

function movementHandler(piece, square) {
    switch (piece) {
        case '🐤':
            return fuMoves(square);
        case '🐱':
            return ginMoves(square);
        case '🐶':
        case '🐔':
        case '😽':
            return kinMoves(square);
        case '🦁':
            return ouMoves(square);
    }
}

function promotionHandler(piece) {
    switch (piece) {
        case '🐤':
            return '🐔';
        case '🐱':
            return '😽';
        default:
            return piece;
    }
}

//rework this
function findValidMoves(square) {
    const piece = GAME_STATE[square].piece;
    const side = GAME_STATE[square].side;
    
    const validMoves = movementHandler(piece, square);
    let possibleMoves = [];

    // for (i = 0; i < PIECES.length; i++) {
    //     if (PIECES[i].displayName === piece) {
    //         console.log(PIECES[i].displayName);
    //     }
    // }

    // kings can't move into check
    if(piece === '🦁') {
        const threatenedSquares = checkKingThreats(square);
        //make sure king is not blocked by own pieces, moving off the board, or moving into check
        validMoves.forEach(move => {
            if (
                GAME_STATE[move] !== undefined 
                && GAME_STATE[move].side !== side
                && threatenedSquares.indexOf(move) === -1
            ) {
                possibleMoves.push(move);
            }
        });
    } else if(GAME_STATE['check'] === false) {
        //make sure pieces are not blocked by own pieces or moving off the board
        validMoves.forEach(move => {
            if (GAME_STATE[move] !== undefined && GAME_STATE[move].side !== side) {
                possibleMoves.push(move);
            }
        });
    } else {
        const checkingPiecePosition = parseInt(GAME_STATE['check-origin']);
        const possibleMoveIndex = validMoves.indexOf(checkingPiecePosition);
        if(possibleMoveIndex !== -1) {
            possibleMoves.push(validMoves[possibleMoveIndex]);
        }
    }

    return possibleMoves;
}

function checkKingThreats(kingSquare) {
    // NOTE: works for goro etc blah blah blah disclaimer
    const kingSide = GAME_STATE[kingSquare].side;
    let kingMoves = ouMoves(kingSquare);
    let threatenedSquares = [];

    kingMoves.forEach(move => {
        // ignore if off the edge or own piece
        if (GAME_STATE[move] !== undefined && GAME_STATE[move].side !== kingSide) {
            // check surrounding squares of each sqaure
            ouMoves(move).forEach(space => {
                // ignore if off the edge, own piece, no piece, and own square
                if (
                    GAME_STATE[space] !== undefined 
                    && GAME_STATE[space] !== kingSquare
                    && GAME_STATE[space].piece !== undefined 
                    && GAME_STATE[space].side !== kingSide
                ) {
                    if(threatHandler(space - move, space)) {
                        threatenedSquares.push(move);
                        // should break inner loop
                    }
                }
            })
        }
    });
    return threatenedSquares;
}

function threatHandler(direction, destination) {
    // attacker info
    const piece = GAME_STATE[destination].piece;
    const side = GAME_STATE[destination].side;

    switch(direction) {
        case 11:
            if(['🐱','🐶','🦁','🐔', '😽'].indexOf(piece) !== -1 && side === 'sente') {
                return true;
            } else if(['🐱'].indexOf(piece) !== -1 && side === 'gote') {
                return true;
            }
            break;
        case 10:
            if(['🐶','🦁','🐔', '😽'].indexOf(piece) !== -1) {
                return true;
            }
            break;
        case 9:
            if(['🐱'].indexOf(piece) !== -1 && side === 'sente') {
                return true;
            } else if(['🐱','🐶','🦁','🐔', '😽'].indexOf(piece) !== -1 && side === 'gote') {
                return true;
            }
            break;
        case 1:
            if(['🐤','🐱','🐶','🦁','🐔', '😽'].indexOf(piece) !== -1 && side === 'sente') {
                return true;
            } else if(['🐶','🦁','🐔', '😽'].indexOf(piece) !== -1 && side === 'gote') {
                return true;
            }
            break;
        case -1:
            if(['🐶','🦁','🐔', '😽'].indexOf(piece) !== -1 && side === 'sente') {
                return true;
            } else if(['🐤','🐱','🐶','🦁','🐔', '😽'].indexOf(piece) !== -1 && side === 'gote') {
                return true;
            }
            break;
        case -9:
            if(['🐱','🐶','🦁','🐔', '😽'].indexOf(piece) !== -1 && side === 'sente') {
                return true;
            } else if(['🐱'].indexOf(piece) !== -1 && side === 'gote') {
                return true;
            }
            break;
        case -10:
            if(['🐶','🦁','🐔', '😽'].indexOf(piece) !== -1) {
                return true;
            }
            break;
        case -11:
            if(['🐱'].indexOf(piece) !== -1 && side === 'sente') {
                return true;
            } else if(['🐱','🐶','🦁','🐔', '😽'].indexOf(piece) !== -1 && side === 'gote') {
                return true;
            }
            break;
        default:
            return false;
    }
}

function findValidDrops(piece) {
    let validDrops = [];
    
    if(GAME_STATE['check'] === false) {
        // NOTE: this works for GoroGoro, because you can't interpose
        // but it won't work in a game with ranged pieces
        if(piece.text() == '🐤') {
            const player = GAME_STATE['player-turn'];
            console.log(true);
            // c for column
            for(c=1; c<=LEFT_EDGE; c++) {
                const validThisCol = checkForNifu(player, c)
                validDrops = [ ...validDrops, ...validThisCol ];
                console.log(validDrops);
            }
        } else {
            for (position in GAME_STATE) {
                if(position.length === 2) {
                    const pieceExists = GAME_STATE[position].piece;
            
                    if (!pieceExists) {
                        validDrops.push(parseInt(position));
                    }
                }
            }
        }
    }
    
    return validDrops;
}

function checkForNifu(player, column) {
    // pawns can't be dropped on the back rank
    const lastValidRow = (player === 'sente' ? 2 : BOTTOM_ROW - 1);
    let nifu = false;
    let validDrops = [];
    // if gote we go the opposite direction
    if(player === 'sente') {
        // r for row
        for(r=BOTTOM_ROW;r>=lastValidRow;r--) {
            let coordinates = `${column}${r}`;
            let checkPosition = GAME_STATE[coordinates];
            if(checkPosition.piece === '🐤' && checkPosition.side === player) {
                nifu = true;
                validDrops = [];
                break;
            } else if(checkPosition.piece == undefined) {
                validDrops.push(parseInt(coordinates));
            }
        }
    } else {
        // r for row
        for(r=1;r<=lastValidRow;r++) {
            let coordinates = `${column}${r}`;
            let checkPosition = GAME_STATE[coordinates];
            if(checkPosition.piece === '🐤' && checkPosition.side === player) {
                nifu = true;
                validDrops = [];
                break;
            } else if(checkPosition.piece == undefined) {
                validDrops.push(parseInt(coordinates));
            }
        }
    }
    return validDrops;
}

// MOVEMENT
// function checkBounds(currentPosition) {
//     let onTopRow = (currentPosition % 10 === 1);
//     let onBotRow = (currentPosition % 10 === BOTTOM_ROW);
//     let onRightEdge = (Math.floor(currentPosition) === 10);
//     let onLeftEdge = (Math.floor(currentPosition) === LEFT_EDGE);

//     if(onTopRow && onRightEdge) {
//         return 'topRightCorner';
//     } else if(onBotRow && onRightEdge) {
//         return 'botRightCorner';
//     } else if(onTopRow && onLeftEdge) {
//         return 'topLeftCorner';
//     } else if(onBotRow && onLeftEdge) {
//         return 'botLeftCorner';
//     }
// }

function moveUp(currentPosition) {
    return currentPosition - 1;
}

function moveDown(currentPosition) {
    return currentPosition + 1;
}

function moveLeft(currentPosition) {
    return currentPosition + 10;
}

function moveRight(currentPosition) {
    return currentPosition - 10;
}

function moveUpLeft(currentPosition) {
    return currentPosition + 9;
}

function moveUpRight(currentPosition) {
    return currentPosition - 11;
}

function moveDownLeft(currentPosition) {
    return currentPosition + 11;
}

function moveDownRight(currentPosition) {
    return currentPosition - 9;
}

function fuMoves(position) {
    const origin = parseInt(position);
    if (GAME_STATE["player-turn"] === 'sente') {
        return [
            origin - 1
        ];
    } else {
        return [
            origin + 1
        ];
    }
}

function ginMoves(position) {
    const origin = parseInt(position);
    if (GAME_STATE["player-turn"] === 'sente') {
        return [
            moveUp(origin),
            moveUpLeft(origin),
            moveUpRight(origin),
            moveDownLeft(origin),
            moveDownRight(origin)
        ];
    } else {
        return [
            moveDown(origin),
            moveDownLeft(origin),
            moveDownRight(origin),
            moveUpLeft(origin),
            moveUpRight(origin)
        ];
    }
}

function kinMoves(position) {
    let origin = parseInt(position);
    if (GAME_STATE["player-turn"] === 'sente') {
        return [
            moveUp(origin),
            moveUpLeft(origin),
            moveUpRight(origin),
            moveDown(origin),
            moveLeft(origin),
            moveRight(origin)
        ];
    } else {
        return [
            moveUp(origin),
            moveLeft(origin),
            moveRight(origin),
            moveDown(origin),
            moveDownLeft(origin),
            moveDownRight(origin)
        ];
    }
}

function ouMoves(position) {
    let origin = parseInt(position);
    return [
        moveUp(origin),
        moveDown(origin),
        moveLeft(origin),
        moveRight(origin),
        moveUpLeft(origin),
        moveUpRight(origin),
        moveDownLeft(origin),
        moveDownRight(origin)
    ]
}

$(loadPage);