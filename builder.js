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
let board = {
    "11": " ・",
    "12": " ・",
    "13": " ・",
    "14": " ・",
    "15": " ・",
    "16": " ・",
    "17": " ・",
    "18": " ・",
    "19": " ・",
    "21": " ・",
    "22": " ・",
    "23": " ・",
    "24": " ・",
    "25": " ・",
    "26": " ・",
    "27": " ・",
    "28": " ・",
    "29": " ・",
    "31": " ・",
    "32": " ・",
    "33": " ・",
    "34": " ・",
    "35": " ・",
    "36": " ・",
    "37": " ・",
    "38": " ・",
    "39": " ・",
    "41": " ・",
    "42": " ・",
    "43": " ・",
    "44": " ・",
    "45": " ・",
    "46": " ・",
    "47": " ・",
    "48": " ・",
    "49": " ・",
    "51": " ・",
    "52": " ・",
    "53": " ・",
    "54": " ・",
    "55": " ・",
    "56": " ・",
    "57": " ・",
    "58": " ・",
    "59": " ・",
    "61": " ・",
    "62": " ・",
    "63": " ・",
    "64": " ・",
    "65": " ・",
    "66": " ・",
    "67": " ・",
    "68": " ・",
    "69": " ・",
    "71": " ・",
    "72": " ・",
    "73": " ・",
    "74": " ・",
    "75": " ・",
    "76": " ・",
    "77": " ・",
    "78": " ・",
    "79": " ・",
    "81": " ・",
    "82": " ・",
    "83": " ・",
    "84": " ・",
    "85": " ・",
    "86": " ・",
    "87": " ・",
    "88": " ・",
    "89": " ・",
    "91": " ・",
    "92": " ・",
    "93": " ・",
    "94": " ・",
    "95": " ・",
    "96": " ・",
    "97": " ・",
    "98": " ・",
    "99": " ・"
}

let goteHandKifu = 'なし';
let boardKifu = 
`
|${board['91']}${board['81']}${board['71']}${board['61']}${board['51']}${board['41']}${board['31']}${board['21']}${board['11']}|一
|${board['92']}${board['82']}${board['72']}${board['62']}${board['52']}${board['42']}${board['32']}${board['22']}${board['12']}|二
|${board['93']}${board['83']}${board['73']}${board['63']}${board['53']}${board['43']}${board['33']}${board['23']}${board['13']}|三
|${board['94']}${board['84']}${board['74']}${board['64']}${board['54']}${board['44']}${board['34']}${board['24']}${board['14']}|四
|${board['95']}${board['85']}${board['75']}${board['65']}${board['55']}${board['45']}${board['35']}${board['25']}${board['15']}|五
|${board['96']}${board['86']}${board['76']}${board['66']}${board['56']}${board['46']}${board['36']}${board['26']}${board['16']}|六
|${board['97']}${board['87']}${board['77']}${board['67']}${board['57']}${board['47']}${board['37']}${board['27']}${board['17']}|七
|${board['98']}${board['88']}${board['78']}${board['68']}${board['58']}${board['48']}${board['38']}${board['28']}${board['18']}|八
|${board['99']}${board['89']}${board['79']}${board['69']}${board['59']}${board['49']}${board['39']}${board['29']}${board['19']}|九
`;
let senteHandKifu = 'なし';

let kifu = `
後手の持駒：${goteHandKifu}
  ９ ８ ７ ６ ５ ４ ３ ２ １
+---------------------------+
${boardKifu}
+---------------------------+
先手の持駒：${senteHandKifu}
先手：
後手：
手数----指手---------消費時間--
`;

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

        resetKifu();
    });
}

function readyKif() {
    $('#kif').on('click', (e) => {
        e.preventDefault();
        //copy kifu to clipboard
        navigator.clipboard.writeText(kifu);
        alert('KIF copied to clipboard');

        // $('#kif').attr('href', `data:text/plain;charset=UTF-8,${kifu}`);
        // $('#kif').attr('download', 'kifu.kif');
    });
}

function readyGrid() {
    $('td').on('click', (e) => {
        e.preventDefault();
        let thisSquareID = e.currentTarget.id;

        $(`#${thisSquareID}`).text(selectedAnimal);
        if(player === 'gote') {
            $(`#${thisSquareID}`).css('rotate', '180deg');
            updateKifu('gote', selectedAnimal, thisSquareID);
        } else {
            $(`#${thisSquareID}`).css('rotate', '0deg');
            updateKifu('sente', selectedAnimal, thisSquareID);
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
                updateKifu('sente', selectedAnimal, 'sh');
            } else {
                goteHand[selectedAnimal]++;
                updateKifu('gote', selectedAnimal, 'gh');
            }
            updateHand(hand);
            readyHandPiece();
        }
    });
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

function updateKifu(player, piece, squareID) {
    if(squareID == "sh") {
        senteHandKifu = '';
        Object.keys(senteHand).forEach(key => {
            if(senteHand[key] == 1) {
                senteHandKifu += key;
            } else if(senteHand[key] > 1) {
                senteHandKifu += key + kanji_numbers[senteHand[key]];
            }
        });
        if(senteHandKifu == '') {
            senteHandKifu = 'なし';
        }
    } else if(squareID == "gh") {
        goteHandKifu = '';
        Object.keys(goteHand).forEach(key => {
            if(goteHand[key] == 1) {
                goteHandKifu += key;
            } else if(goteHand[key] > 1) {
                goteHandKifu += key + kanji_numbers[goteHand[key]];
            }
        });
        if(goteHandKifu == '') {
            goteHandKifu = 'なし';
        }
    } else if(piece == "") {
        board[squareID] = " ・";
    } else {
        if(player === 'sente') {
            board[squareID] = " " + piece;
        } else {
            board[squareID] = "v" + piece;
        }
    }
    boardKifu = 
    `
    |${board['91']}${board['81']}${board['71']}${board['61']}${board['51']}${board['41']}${board['31']}${board['21']}${board['11']}|一
    |${board['92']}${board['82']}${board['72']}${board['62']}${board['52']}${board['42']}${board['32']}${board['22']}${board['12']}|二
    |${board['93']}${board['83']}${board['73']}${board['63']}${board['53']}${board['43']}${board['33']}${board['23']}${board['13']}|三
    |${board['94']}${board['84']}${board['74']}${board['64']}${board['54']}${board['44']}${board['34']}${board['24']}${board['14']}|四
    |${board['95']}${board['85']}${board['75']}${board['65']}${board['55']}${board['45']}${board['35']}${board['25']}${board['15']}|五
    |${board['96']}${board['86']}${board['76']}${board['66']}${board['56']}${board['46']}${board['36']}${board['26']}${board['16']}|六
    |${board['97']}${board['87']}${board['77']}${board['67']}${board['57']}${board['47']}${board['37']}${board['27']}${board['17']}|七
    |${board['98']}${board['88']}${board['78']}${board['68']}${board['58']}${board['48']}${board['38']}${board['28']}${board['18']}|八
    |${board['99']}${board['89']}${board['79']}${board['69']}${board['59']}${board['49']}${board['39']}${board['29']}${board['19']}|九
    `;

    kifu = `
        後手の持駒：${goteHandKifu}
        ９ ８ ７ ６ ５ ４ ３ ２ １
        +---------------------------+
        ${boardKifu}
        +---------------------------+
        先手の持駒：${senteHandKifu}
        先手：
        後手：
        手数----指手---------消費時間--
    `;
    console.log(kifu);
    readyKif();
}

function resetKifu() {
    board = {
        "11": " ・",
        "12": " ・",
        "13": " ・",
        "14": " ・",
        "15": " ・",
        "16": " ・",
        "17": " ・",
        "18": " ・",
        "19": " ・",
        "21": " ・",
        "22": " ・",
        "23": " ・",
        "24": " ・",
        "25": " ・",
        "26": " ・",
        "27": " ・",
        "28": " ・",
        "29": " ・",
        "31": " ・",
        "32": " ・",
        "33": " ・",
        "34": " ・",
        "35": " ・",
        "36": " ・",
        "37": " ・",
        "38": " ・",
        "39": " ・",
        "41": " ・",
        "42": " ・",
        "43": " ・",
        "44": " ・",
        "45": " ・",
        "46": " ・",
        "47": " ・",
        "48": " ・",
        "49": " ・",
        "51": " ・",
        "52": " ・",
        "53": " ・",
        "54": " ・",
        "55": " ・",
        "56": " ・",
        "57": " ・",
        "58": " ・",
        "59": " ・",
        "61": " ・",
        "62": " ・",
        "63": " ・",
        "64": " ・",
        "65": " ・",
        "66": " ・",
        "67": " ・",
        "68": " ・",
        "69": " ・",
        "71": " ・",
        "72": " ・",
        "73": " ・",
        "74": " ・",
        "75": " ・",
        "76": " ・",
        "77": " ・",
        "78": " ・",
        "79": " ・",
        "81": " ・",
        "82": " ・",
        "83": " ・",
        "84": " ・",
        "85": " ・",
        "86": " ・",
        "87": " ・",
        "88": " ・",
        "89": " ・",
        "91": " ・",
        "92": " ・",
        "93": " ・",
        "94": " ・",
        "95": " ・",
        "96": " ・",
        "97": " ・",
        "98": " ・",
        "99": " ・"
    };
    goteHandKifu = 'なし';
    senteHandKifu = 'なし';
    boardKifu = 
    `
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|一
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|二
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|三
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|四
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|五
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|六
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|七
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|八
    | ・ ・ ・ ・ ・ ・ ・ ・ ・|九
    `;
    kifu = `
        後手の持駒：${goteHandKifu}
        ９ ８ ７ ６ ５ ４ ３ ２ １
        +---------------------------+
        ${boardKifu}
        +---------------------------+
        先手の持駒：${senteHandKifu}
        先手：
        後手：
        手数----指手---------消費時間--
    `;
}

$(loadPage);