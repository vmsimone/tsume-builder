let selectedAnimal;

function loadPage() {
    readyButtons();
    readyGrid();
}

function readyButtons() {
    $('button.animal').on('click', (e) => {
        e.preventDefault();
        selectedAnimal = e.currentTarget.value;
        
        $('button.animal').css({'border-color': 'gray', 'transform': 'scale(1)'})
        $(`button[value=${selectedAnimal}]`).css({'border-color': 'red', 'transform': 'scale(1.5)'})
    });

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
    })
}

$(loadPage);