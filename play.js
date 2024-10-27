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
    "player-turn": "sente"
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
    
    updateHTML();
}

function updateHTML() {
    for (position in GAME_STATE) {
        const pieceExists = GAME_STATE[position].piece;

        if (pieceExists) {
            displayPiece(position);
        } else {
            $(`#${position}`).html('');
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
    movesArray.forEach(move => {
        const thisSquare = $(`#${move}`);
        thisSquare.append(`<div class='possible-move'></div>`);
    });
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

        if (kingIsInCheck(GAME_STATE[square].side, piece, square)) {
            check();
        }

        $('.prompt').fadeOut('instant');
    });
    $('#cancel').on('click', () => {
        movePiece(oldSquare, newSquare);

        if (kingIsInCheck(GAME_STATE[square].side, piece, square)) {
            check();
        }

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

    //BUGGIN
    // if(kingIsInCheck(thisSide, thisPiece, newSquare)) {
    //     console.log('king in check');
    //     check();
    // }

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

    //BUGGIN
    // if(kingIsInCheck(thisSide, thisPiece, newSquare)) {
    //     console.log('king in check');
    //     check();
    // }

    updateHTML();
    side === 'sente' ? listenGote() : listenSente();
}

// function findKingPosition(kingSide) {
//     const allBoardSquares = Object.keys(GAME_STATE);
//     for (i = 0; i <= allBoardSquares.length; i++) {
//         let thisSquare = allBoardSquares[i];
//         if (GAME_STATE[thisSquare].piece === '🦁' && GAME_STATE[thisSquare].side === kingSide) {
//             return thisSquare;
//         }
//     }
// }

// function kingIsInCheck(lastMovedSide, lastMovedPiece, currentPosition) {
//     const nextMoves = movementHandler(lastMovedPiece, lastMovedSide, currentPosition);
//     const kingSide = (lastMovedSide = 'sente' ? 'gote' : 'sente');
//     const kingPosition = parseInt(findKingPosition(kingSide));

//     if (nextMoves.indexOf(kingPosition) !== -1) {
//         return true;
//     } else {
//         return false;
//     }
// }

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
    let validMoves = [];
    let possibleMoves = [];

    const piece = GAME_STATE[square].piece;
    const side = GAME_STATE[square].side;

    for (i = 0; i < PIECES.length; i++) {
        if (PIECES[i].displayName === piece) {
            console.log(PIECES[i].displayName);
        }
    }

    validMoves = movementHandler(piece, square);

    //make sure pieces are not blocked by own pieces or moving off the board
    validMoves.forEach(move => {
        if (GAME_STATE[move] !== undefined && GAME_STATE[move].side !== side) {
            possibleMoves.push(move);
        }
    });
    return possibleMoves;
}

function findValidDrops(piece) {
    let validDrops = [];
    if(piece == '🐤') {
        const player = GAME_STATE['player-turn'];
        for (position in GAME_STATE) {

        }
        // handle nifu
    } else {
        for (position in GAME_STATE) {
            const pieceExists = GAME_STATE[position].piece;
    
            if (!pieceExists) {
                validDrops.push(parseInt(position));
            }
        }
    }
    return validDrops;
}

function checkForNifu(player, column) {
    if(player === 'sente') {
        const top = column + 2;
        const bot = column + 6;
        for(i=top;i<=bot;i++) {

        }
    }
}

function check() {
    $('body').append(`<div class="prompt">王手</div>`);
    $('.prompt').fadeIn('fast');
    $('.prompt').delay(1000).fadeOut('fast');
}


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
    let origin = parseInt(position);
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