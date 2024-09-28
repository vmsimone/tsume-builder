let selectedAnimal;

function loadPage() {
    readyButtons();
    readyGrid();
}

function readyButtons() {
    $('button').on('click', (e) => {
        // $('button').css('border', 'black')
        e.preventDefault();
        selectedAnimal = e.currentTarget.value;

        console.log(selectedAnimal);
        // e.currentTarget.css('border', 'red');
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