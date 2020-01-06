export {add_winner_to_db, get_winners_list, show_winners_list};
import {nick, seconds, turn_counter, number_of_cards, main_div, clear_div} from './game.js';

//-------------------------------------------------------------------------------------------

function add_winner_to_db() {
  let http_request = new XMLHttpRequest();
  http_request.open('POST', '/add_winner');
  http_request.setRequestHeader("Content-Type", "application/json");

  let player_result = {
    nick: nick,
    seconds: seconds,
    turns: turn_counter,
    number_of_cards: number_of_cards
  };
  let json_obj = JSON.stringify(player_result);
  http_request.send(json_obj);
}

//-------------------------------------------------------------------------------------------

function get_winners_list(number_of_cards) {
  clear_div(main_div);

  let http_request = new XMLHttpRequest();
  http_request.open('POST', '/show_winners');
  http_request.setRequestHeader("Content-Type", "application/json");

  http_request.onload = function () {
    let winners = JSON.parse(http_request.response);
    show_winners_list(winners);
  };
  let js_obj = {number_of_cards: number_of_cards};
  let json_obj = JSON.stringify(js_obj);

  http_request.send(json_obj);
}

//-------------------------------------------------------------------------------------------

function show_winners_list(winners) {
  let winners_table_string = '';
  winners_table_string += `
    <div class="container">
        <div class="row justify-content-center display-1">
            Winners
        </div>
        <div class="row justify-content-center">
            <div class="border border-dark p-2 col-2">
                <span class="header">Position</span>
            </div>
            <div class="border border-dark p-2 col-2">
                <span class="header">Nick</span>
            </div>
            <div class="border border-dark p-2 col-2">
                <span class="header">Seconds</span>
            </div>
            <div class="border border-dark p-2 col-2">
                <span class="header">Turns</span>
            </div>
            <div class="border border-dark p-2 col-2">
                <span class="header">Cards</span>
            </div>
        </div>`;

  for (let i = 0; i < winners.length; i++) {
    winners_table_string += `
      <div class="row justify-content-center">
        <div class="border border-dark  p-2 col-2">
            ${i + 1}
        </div>
        <div class="border border-dark  p-2 col-2">
            ${winners[i].nick}
        </div>
        <div class="border border-dark  p-2 col-2">
            ${winners[i].seconds}
        </div>
        <div class="border border-dark  p-2 col-2">
            ${winners[i].turns}
        </div>
        <div class="border border-dark  p-2 col-2">
            ${winners[i].number_of_cards}
        </div>
      </div>
      `;
  }
  winners_table_string += `
      <div class="row justify-content-center m-4">
        <form id="change_winners_list_form">
            Which board?
            <select id="board_size_form">
                <option value="6">6 cards</option>
                <option value="12">12 cards</option>
                <option value="18">18 cards</option>
                <option value="24">24 cards</option>
                <option value="30">30 cards</option>
                <option value="36">36 cards</option>
            </select>
            <button>Change</button>
        </form>
      </div>
    </div>`;
  main_div.innerHTML = winners_table_string;

  let go_to_winners_list_button = document.getElementById('change_winners_list_form');
  go_to_winners_list_button.addEventListener('submit', (event) => {
    event.preventDefault();
    let new_board_size = document.getElementById('board_size_form').value;
    get_winners_list(new_board_size);
  })
}