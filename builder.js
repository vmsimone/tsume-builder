let selectedAnimal;
let player = 'sente';
const validHandPieces = ["🐶", "🐱", "🐤"];

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
        
        $('button.animal').css({'border-color': 'gray', 'transform': 'scale(1)'});
        if(selectedAnimal === "") {
            $(`button#erase`).css({'border-color': 'red', 'transform': 'scale(1.5)'})
        } else {
            $(`button[value=${selectedAnimal}]`).css({'border-color': 'green', 'transform': 'scale(1.5)'})
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
        $('.hand').html('');
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
        let piecesInHand = $(".hand div").length;
        let isValidHandPiece = validHandPieces.includes(selectedAnimal);

        if(player === 'sente' && piecesInHand < 9 && isValidHandPiece) {
            $('.hand').append(
                `<div class="hand-piece">${selectedAnimal}</div>`
            );
            readyHandPiece();
        }
    })
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