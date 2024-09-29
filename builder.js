let selectedAnimal;

function loadPage() {
    readyButtons();
    readyGrid();
}

function readyButtons() {
    $('button.animal').on('click', (e) => {
        $('button.animal').style = 'border-color: gray';
        e.preventDefault();
        selectedAnimal = e.currentTarget.value;

        console.log(selectedAnimal);
        e.currentTarget.style = 'border-color: red';
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