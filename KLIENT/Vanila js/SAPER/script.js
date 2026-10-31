const e = require("express");

let gameArray = [];


function input_generation(id, opis, wartosc) {
  const input = document.createElement("input");
  input.id = id;
  input.name = id;
  input.value = wartosc;
  input.type = 'number';

  const label = document.createElement("label");
  label.htmlFor = id;
  label.innerText = opis

  return { input, label };
}

function build_form() {
  const form = document.createElement('div');
  
  
  
  let row = input_generation("row", "Podaj liczbe wierszy", 10);
  let column = input_generation("column", "Podaj liczbe kolumn", 10);
  let mine = input_generation("mine", "Podaj liczbe min", 10);

  for (const field of [row, column, mine]) {
    form.appendChild(field.label);
    form.appendChild(field.input);
  }

  const submit_button = document.createElement("button");
  submit_button.innerText = "prześlij";
  
  form.appendChild(submit_button)
  
  document.body.appendChild(form)


  submit_button.onclick = function(){
    
  }
}

function build_board(totalRows,totalColumns,totalMines){
    for (let row = 0; row < totalRows; row++){
        for (let column; column <totalColumns; column++){
            let field = document.createElement('div')
            field.className = 'field'

            field.setAttribute('data-x', column)
            field.setAttribute('data-y', row)

            field.addEventListener('contextmenu',flag_field )
        }
    }

}

function flag_field(event) {
  event.preventDefault();

  const field = event.currentTarget;
  const isFlagged = field.style.backgroundColor === "red";
  field.style.backgroundColor = isFlagged ? "" : "red";
}


function check_for_bomb(x,y){
    if (gameArray[y][x] === 1){
        return game_finished
    }
}

function game_finished(){
    alert("Gra zakończona przegrałeś")
} 

build_form()