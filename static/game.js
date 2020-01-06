import {add_winner_to_db, get_winners_list} from './winners_list.js';
export {nick, seconds, turn_counter, number_of_cards, main_div, clear_div}

const win_sound = new Audio('./static/snd/win.mp3');
const miss_sound = new Audio('./static/snd/miss.wav');
const match_sound = new Audio('./static/snd/match.wav');
const main_div = document.getElementById('main_div');
const nick_and_board_form = document.querySelector('#nick_and_board_form');

let seconds = 0;
let turn_counter = 0;
let player_clicks_first_card = true;
let player_can_click = true;

let we_have_table_from_json = false;
let nick, number_of_cards, timer, shuffled_table, winners_list_button;
let first_card_index;
let first_img_url;
let second_card_index;
let second_img_url;


main();

//-------------------------------------------------------------------------------------------

function main() {

  nick_and_board_form.addEventListener('submit', (event) => {
    event.preventDefault();

    nick = document.getElementById('nick').value;
    number_of_cards = document.getElementById('card_number_menu').value;

    if (nick_is_ok(nick)) {
      clear_div(main_div);
      create_board_and_add_cards(number_of_cards);
      create_timer_div();
      create_turn_counter_div();
      create_nick_div();
      add_event_listeners_to_cards(number_of_cards);
      randomize_cards(number_of_cards);
      timer_start();

    } else
      show_error_message('Wrong nick length or no nick');
  });
}

//-------------------------------------------------------------------------------------------

function nick_is_ok(nick) {
  nick = nick.trim();
  if (nick.length >= 3 && nick.length <= 8)
    return true;
}

//-------------------------------------------------------------------------------------------

function show_error_message(message) {
  if (nick_and_board_form.childElementCount === 3) {
    let error_div = document.createElement('div');
    let error_div_message = document.createTextNode(message);

    error_div.classList.add('error');
    error_div.appendChild(error_div_message);
    nick_and_board_form.appendChild(error_div);
  }
}

//-------------------------------------------------------------------------------------------

function clear_div(div) {
  while (div.firstChild)
    div.removeChild(div.firstChild);
}

//-------------------------------------------------------------------------------------------

function create_board_and_add_cards(number_of_cards) {

  for (let i = 0; i < number_of_cards / 6; i++) {
    let row_div = document.createElement('div');
    row_div.setAttribute('class', 'row');

    main_div.appendChild(row_div);
    add_cards_to_board(row_div);
  }
}

//-------------------------------------------------------------------------------------------

function add_cards_to_board(row_div) {
  for (let i = 0; i < 6; i++) {
    let card_div = document.createElement('div');
    card_div.setAttribute('class', 'card_in_play');
    card_div.classList.add('col-xl-2');
    card_div.classList.add('col-md-4');

    let card_img = document.createElement('i');
    card_img.setAttribute('class', 'fas');
    card_img.classList.add('fa-star');

    card_div.appendChild(card_img);
    row_div.appendChild(card_div);
  }
}

//-------------------------------------------------------------------------------------------

function create_timer_div() {
  let timer_div = document.createElement('div');
  timer_div.setAttribute('id', 'timer');

  let timer_div_text = document.createTextNode('Game time: 0');
  timer_div.appendChild(timer_div_text);
  main_div.appendChild(timer_div);
}

//-------------------------------------------------------------------------------------------

function create_turn_counter_div() {
  let turn_counter_div = document.createElement('div');
  turn_counter_div.setAttribute('id', 'turn_counter');

  let turn_counter_div_text = document.createTextNode('Turn counter: 0');
  turn_counter_div.appendChild(turn_counter_div_text);
  main_div.appendChild(turn_counter_div);
}

//-------------------------------------------------------------------------------------------

function create_nick_div() {
  let nick_div = document.createElement('div');
  nick_div.setAttribute('id', 'nick_div');

  nick_div.innerText = `${nick} is playing`;
  main_div.appendChild(nick_div);
}

//-------------------------------------------------------------------------------------------

function add_event_listeners_to_cards(number_of_cards) {
  let all_divs = main_div.querySelectorAll('.row > div');

  for (let card_index = 0; card_index < number_of_cards; card_index++) {
    all_divs[card_index].setAttribute('data-index_number', card_index);
    all_divs[card_index].addEventListener('click', function () {
      game_start(card_index);
    })
  }
}

//-------------------------------------------------------------------------------------------

function timer_start() {
  timer = setInterval(() => {
    seconds++;
    let timer_div = document.getElementById('timer');
    timer_div.innerText = `Game time: ${seconds}`;
  }, 1000)
}

//-------------------------------------------------------------------------------------------

function randomize_cards(number_of_cards) {
  if (we_have_table_from_json === false) {
    number_of_cards = parseInt(number_of_cards);
    create_table_from_json_file_and_shuffle_it(number_of_cards);
    we_have_table_from_json = true;
  }
}

//-------------------------------------------------------------------------------------------

function create_table_from_json_file_and_shuffle_it(number_of_cards) {
  let http_request = new XMLHttpRequest();
  http_request.open('GET', './static/cards.json');

  http_request.onload = () => {
    let js_obj = JSON.parse(http_request.response);
    let ordered_table = [];
    for (let i = 0; i < number_of_cards; i++)
      ordered_table.push(js_obj.cards[i].url);

    shuffle_the_table(ordered_table);
  };
  http_request.send();
}

//-------------------------------------------------------------------------------------------

function shuffle_the_table(ordered_table) {
  shuffled_table = ordered_table.slice();

  let j, x, i;
  for (i = shuffled_table.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = shuffled_table[i];
    shuffled_table[i] = shuffled_table[j];
    shuffled_table[j] = x;
  }
}

//-------------------------------------------------------------------------------------------

function get_clicked_card(card_index, selector) {
  let all_divs = main_div.querySelectorAll(selector);

  for (let i = 0; i < all_divs.length; i++) {
    if (card_index === parseInt(all_divs[i].getAttribute('data-index_number')))
      return all_divs[i];
  }
}

//-------------------------------------------------------------------------------------------

function show_card(clicked_card, url) {
  if (clicked_card) {
    clear_div(clicked_card);

    let img = document.createElement('img');
    img.setAttribute('src', url);
    img.setAttribute('class', 'displayed_img');

    clicked_card.classList.remove('card_in_play');
    clicked_card.classList.add('card_out_of_play');
    clicked_card.appendChild(img);
  }
}

//-------------------------------------------------------------------------------------------

function remove_cards(first_card_index, second_card_index) {

  let first_clicked_card = get_clicked_card(first_card_index, '.card_out_of_play');
  let second_clicked_card = get_clicked_card(second_card_index, '.card_out_of_play');

  first_clicked_card.setAttribute('style', 'opacity: 0;');
  second_clicked_card.setAttribute('style', 'opacity: 0;');

  player_can_click = true;

  if (win_condition()) {
    win_sound.play();
    clearInterval(timer);
    add_winner_to_db();
    show_win_screen();
    winners_list_button.addEventListener('click', () => {
      get_winners_list(number_of_cards)
    })

  }
}

//-------------------------------------------------------------------------------------------

function restore_cards(first_card_index, second_card_index) {
  let first_clicked_card = get_clicked_card(first_card_index, '.card_out_of_play');
  let second_clicked_card = get_clicked_card(second_card_index, '.card_out_of_play');

  let two_cards = [first_clicked_card, second_clicked_card];

  two_cards.forEach((card) => {
    let card_img = document.createElement('i');
    card_img.setAttribute('class', 'fas');
    card_img.classList.add('fa-star');
    clear_div(card);
    card.classList.remove('card_out_of_play');
    card.classList.add('card_in_play');
    card.appendChild(card_img);
  });

  player_can_click = true;
}

//-------------------------------------------------------------------------------------------

function match_miss_decision(first_img_url, second_img_url, first_card_index, second_card_index) {
  // MATCH
  if (first_img_url === second_img_url) {
    match_sound.play();
    setTimeout(() => remove_cards(first_card_index, second_card_index), 750);
  }
  // MISS
  else {
    miss_sound.play();
    setTimeout(() => restore_cards(first_card_index, second_card_index), 1000);
  }
}

//-------------------------------------------------------------------------------------------

function win_condition() {
  let all_cards = main_div.querySelectorAll('.row > div');
  for (let card of all_cards) {
    if (card.classList.contains('card_in_play'))
      return false;
  }
  return true;
}

//-------------------------------------------------------------------------------------------

function show_win_screen() {
  clear_div(main_div);
  main_div.setAttribute('class', 'text-center');

  let win_header = document.createElement('div');
  win_header.setAttribute('id', 'win_header');
  let win_header_text = document.createTextNode(`${nick} You won`);
  win_header.appendChild(win_header_text);

  let time_div = document.createElement('div');
  time_div.setAttribute('id', 'time_div');
  let time_div_text = document.createTextNode(`In ${seconds} seconds`);
  time_div.appendChild(time_div_text);

  let turn_counter_div = document.createElement('div');
  turn_counter_div.setAttribute('id', 'turn_counter_div');
  let turn_counter_div_text = document.createTextNode(`In ${turn_counter} turns`);
  turn_counter_div.appendChild(turn_counter_div_text);

  let buttons_div = document.createElement('div');
  buttons_div.setAttribute('id', 'buttons_div');

  let form_to_once_again = document.createElement('form');
  form_to_once_again.setAttribute('action', '/');
  let once_again_button = document.createElement('button');
  let once_again_button_text = document.createTextNode('Once again?');
  once_again_button.appendChild(once_again_button_text);
  form_to_once_again.appendChild(once_again_button);

  winners_list_button = document.createElement('button');
  winners_list_button.setAttribute('id', 'winners_list_button');
  let winners_list_button_text = document.createTextNode('List of winners');
  winners_list_button.appendChild(winners_list_button_text);

  buttons_div.appendChild(form_to_once_again);
  buttons_div.appendChild(winners_list_button);

  main_div.appendChild(win_header);
  main_div.appendChild(time_div);
  main_div.appendChild(turn_counter_div);
  main_div.appendChild(buttons_div);

}

//-------------------------------------------------------------------------------------------

function check_if_click_the_same_card(card_index) {
  let clicked_div = main_div.querySelectorAll('.row > div');
  if (clicked_div[card_index].classList.contains('card_in_play'))
    return true;
}

//-------------------------------------------------------------------------------------------

function game_start(card_index) {
  let not_the_same_card = check_if_click_the_same_card(card_index);

  if (player_can_click === true && not_the_same_card) {

    let clicked_card = get_clicked_card(card_index, '.card_in_play');
    show_card(clicked_card, shuffled_table[card_index]);

    switch (player_clicks_first_card) {
      case true: {
        first_card_index = card_index;
        first_img_url = clicked_card.firstChild.getAttribute('src');
        player_clicks_first_card = false;
        break;
      }

      case false: {
        player_can_click = false;
        second_card_index = card_index;
        second_img_url = clicked_card.firstChild.getAttribute('src');

        match_miss_decision(first_img_url, second_img_url, first_card_index, second_card_index);

        turn_counter++;
        document.getElementById('turn_counter').innerText = `Turn counter: ${turn_counter}`;
        player_clicks_first_card = true;

        break;
      }
    }
  }
}

//-------------------------------------------------------------------------------------------

