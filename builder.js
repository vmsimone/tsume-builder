let selectedAnimal;
let player = 'sente';

function loadPage() {
    readyButtons();
    readyGrid();
}

function readyButtons() {
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
    })

    $('#reset').on('click', (e) => {
        e.preventDefault();
        $('td').text('');
    })
}

function readyGrid() {
    $('td').on('click', (e) => {
        e.preventDefault();
        let thisSquareID = e.currentTarget.id;

        $(`#${thisSquareID}`).text(selectedAnimal);
        if(player === 'gote') {
            $(`#${thisSquareID}`).css('rotate', '180deg');
        }
    })
}

$(loadPage);