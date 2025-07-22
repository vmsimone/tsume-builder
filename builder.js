let selectedAnimal;
let player = 'sente';
const kanji_numbers = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九"
}

const validHandPieces = ["🐶", "🐱", "🐤", "飛", "角", "金", "銀", "桂", "香", "歩" ];
const senteHand = {
    "飛": 0,
    "角": 0,
    "金": 0,
    "銀": 0,
    "桂": 0,
    "香": 0,
    "歩": 0
};
const goteHand = {
    "飛": 0,
    "角": 0,
    "金": 0,
    "銀": 0,
    "桂": 0,
    "香": 0,
    "歩": 0
};

function loadPage() {
    readyAnimals();
    readyFlip();
    readyReset();
    readyGrid();
    readyHand();
}

function readyAnimals() {
    $('button.animal').on('click', (e) => {
        e.preventDefault();
        selectedAnimal = e.currentTarget.value;
        
        // $('button.animal').css({'border-color': 'gray', 'transform': 'scale(1)'});
        $('button.animal').removeClass('selected');
        $('button#erase').removeClass('selected');

        if(selectedAnimal === "") {
            $('button#erase').addClass('selected');
        } else {
            $(`button[value=${selectedAnimal}]`).addClass('selected');
        }
    });
}

function readyFlip() {
    $('#flip').on('click', (e) => {
        e.preventDefault();

        if(player === 'sente') {
            player = 'gote';
            $('button.animal').css('rotate', '180deg');
            $('button#erase').css('rotate', '0deg');
        } else {
            player = 'sente';
            $('button.animal').css('rotate', '0deg')
        }  
    });
}

function readyReset() {
    $('#reset').on('click', (e) => {
        e.preventDefault();
        $('td').text('');
        $('.sente.hand').html('<div class="hand-label">☗先手</div>');
        $('.sente.hand').css('margin-top', '582px');
        $('.sente.hand').css('height', '210px');
        
        $('.gote.hand').html('<div class="hand-label">☖後手</div>');
        $('.gote.hand').css('margin-top', '50px');
        $('.gote.hand').css('height', '210px');
        Object.keys(senteHand).forEach(key => {
            senteHand[key] = 0;
        });
        Object.keys(goteHand).forEach(key => {
            goteHand[key] = 0;
        });
    });
}

function readyGrid() {
    $('td').on('click', (e) => {
        e.preventDefault();
        let thisSquareID = e.currentTarget.id;

        $(`#${thisSquareID}`).text(selectedAnimal);
        if(player === 'gote') {
            $(`#${thisSquareID}`).css('rotate', '180deg');
        } else {
            $(`#${thisSquareID}`).css('rotate', '0deg');
        }
    })
}

function readyHand() {
    $('.hand').on('click', (e) => {
        e.preventDefault();
        let isValidHandPiece = validHandPieces.includes(selectedAnimal);
        let hand = $(e.currentTarget).hasClass('sente') ? 'sente' : 'gote';

        if(senteHand[selectedAnimal] < 9 && isValidHandPiece) {
            $(`.hand.${hand}`).append(
                `<div class="hand-piece">${selectedAnimal}</div>`
            );
            if(hand === 'sente') {
                senteHand[selectedAnimal]++;
            } else {
                goteHand[selectedAnimal]++;
            }
            updateHand(hand);
            readyHandPiece();
        }
    })
}

function updateHand(player) {
    if(player === 'sente') {
        $('.sente.hand').html(`
            <div class="hand-label">☗先手</div>
        `);
        Object.keys(senteHand).forEach(key => {
            if(senteHand[key] > 0) {
                $('.sente.hand').append(`
                    <div class="hand-piece">${key}${[9 > senteHand[key] && senteHand[key] > 1 ? kanji_numbers[senteHand[key]] : '']}</div>
                `);
                updateHandMargin('sente', $('.sente.hand .hand-piece').text().length);
            }
        });

    } else {
        $('.gote.hand').html(`
            <div class="hand-label">☖後手</div>
        `);
        Object.keys(goteHand).forEach(key => {
            if(goteHand[key] > 0) {
                $('.gote.hand').append(`
                    <div class="hand-piece">${key}${[9 > goteHand[key] && goteHand[key] > 1 ? kanji_numbers[goteHand[key]] : '']}</div>
                `);
                updateHandMargin('gote', $('.gote.hand .hand-piece').text().length);
            }
        });
    }
}

function updateHandMargin(player, textLength) {
    let newMargin;
    let newHeight = 210 + (textLength * 48);
    if(player === 'sente') {
        newMargin = 582 - (textLength * 48);
    } else {
        newMargin = 50 + (textLength * 4);
    }
    if(textLength >= 1) {
        $(`.hand.${player}`).css('margin-top', `${newMargin}px`);
        $(`.hand.${player}`).css('height', `${newHeight}px`);
    }
}

function readyHandPiece() {
    $('.hand-piece').on('click', (e) => {
        e.preventDefault();
        if(selectedAnimal === "") {
            e.currentTarget.remove();
        }
    })
}

$(loadPage);