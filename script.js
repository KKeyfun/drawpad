let gridLines = true;
let isMouseDown = false;
let colorMode = 'normal';

document.body.addEventListener('mouseup',function(){isMouseDown=false});
//used to catch mouseup in case click is released outside of drawing grid

function createUI() {
    let header = document.createElement('h1');
    header.textContent = 'Sketchpad';
    document.body.appendChild(header);
    let container = document.createElement('div');
    container.classList.add('container');

    container.appendChild(createButtons());
    //Button + slider Creation

    document.body.appendChild(container);
    
    createGrid(16);
    addButtonFunction();
    modeChange('normal');
    //Create grid w/default size
}

function createButtons(){
    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('buttonContainer');
    let buttonLabels = ['Normal Mode','Rainbow Mode','Eraser','Clear Sketchpad','Toggle Grid'];
    let buttonClass = ['normal','rainbow','eraser','clear','grid'];

    for(let i=0;i<buttonLabels.length;i++){
        let button = document.createElement('button');
        button.textContent = buttonLabels[i];
        button.classList.add(buttonClass[i]);
        buttonContainer.appendChild(button);
    }

    
    let gridSlider = document.createElement('input');
    gridSlider.setAttribute('type','range');
    gridSlider.setAttribute('min','2');
    gridSlider.setAttribute('max','64');
    gridSlider.setAttribute('value',16);
    gridSlider.classList.add('gridSlider');

    let sliderSize = document.createElement('div');
    sliderSize.classList.add('sliderSize');
    sliderSize.textContent = '16x16';
    buttonContainer.appendChild(gridSlider);
    buttonContainer.appendChild(sliderSize);

    return buttonContainer;
}

function addButtonFunction(){
    let gridButton = document.querySelector('.grid');
    gridButton.addEventListener('click',toggleGrid);

    let normalButton = document.querySelector('.normal');
    normalButton.addEventListener('click',function(){modeChange('normal')});

    let rainbowButton = document.querySelector('.rainbow');
    rainbowButton.addEventListener('click',function(){modeChange('rainbow')});

    let clearButton = document.querySelector('.clear');
    clearButton.addEventListener('click',function(){clearGrid()});

    let eraserButton = document.querySelector('.eraser');
    eraserButton.addEventListener('click',function(){modeChange('eraser')});

    let gridSlider = document.querySelector('.gridSlider');
    gridSlider.addEventListener('change',function(){updateGrid(this)});
}

function updateGrid(slider){
    createGrid(slider.value);
    let sliderSize = document.querySelector('.sliderSize');
    sliderSize.textContent = `${slider.value}x${slider.value}`
}

function toggleGrid(){
    let cell = document.querySelectorAll('.cell');
    (gridLines) ? (cell.forEach ((e)=> e.style.border = `1px solid ${e.style.backgroundColor}` ),gridLines = false)
    : (cell.forEach ((e)=> e.style.border = '1px solid darkgray' ),gridLines = true)
}

function modeChange(mode){
    colorMode = `${mode}`;

    let cell = document.querySelectorAll('.cell');

    cell.forEach(e => e.addEventListener('mousedown',function(){
        isMouseDown=true;
        colorChange(`${mode}`,this);
    }))

    cell.forEach(e => e.addEventListener('mouseover',function(){
        if(isMouseDown){
            colorChange(`${mode}`,this);
        }
    }
    ))

    cell.forEach(e => e.addEventListener('mouseup',function(){
        e.removeEventListener('mouseover',function(){arguments.callee});
        isMouseDown=false;
        //arguments.callee references the anonymous function
    }
    ))

    }

function colorChange(mode,cell){
    if(mode=='normal'){
        cell.style.backgroundColor = 'black';
        if(gridLines==false){
        cell.style.border = '1px solid black'
        }
    }//Normal mode/Black - default when page is loaded

    if(mode=='rainbow'){
        let rgb = '';
        for(let i=0;i<3;i++){
            rgb += (Math.floor(Math.random() * 255)).toString(16);
        }
        cell.style.backgroundColor = `#${rgb}`;
        if(gridLines==false){
            cell.style.border = `1px solid #${rgb}`;
        }
    }//Rainbow Mode

    if(mode=='eraser'){
        cell.style.backgroundColor = 'white';
        if(gridLines==false){
            cell.style.border = '1px solid white'
        }
    }//Eraser mode/White
}

function createGrid(size) {
    deleteGrid();
    //Delete grid if there's already one so we dont get 2 sketch pads
    let gridContainer = document.createElement('div');
    gridContainer.classList.add('gridContainer');

    let cellWidth = (500-size-1)/size;
    for(let x=0;x<size;x++){
        for(let y=0;y<size;y++){
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.backgroundColor = 'white';
            cell.style.width = cellWidth+'px';
            gridContainer.appendChild(cell);

        }
    }

    let container = document.querySelector('.container');
    container.appendChild(gridContainer);

    switch(colorMode){
        case 'normal':
            modeChange('normal');
            break;
        case 'rainbow':
            modeChange('rainbow');
            break;
        case 'erase':
            modeChange('eraser');
    }
    //Remembers the mode and reapplies to new cells
}

function clearGrid(){
    
    let cells = document.querySelectorAll('.cell');

    if(gridLines){
        cells.forEach(e => e.style.border = '1px solid darkgray');
    } else{
        cells.forEach(e => e.style.border = '1px solid white');
    }

    cells.forEach(e => e.style.backgroundColor = 'white');
    
}

function deleteGrid(){
    let gridContainer = document.querySelector('.gridContainer');

    if(gridContainer!=null){
        gridContainer.remove();
    }
    //checks if the grid container exists before attempting removal
}

window.onload = createUI();