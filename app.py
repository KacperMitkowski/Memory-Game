from flask import Flask, render_template, request
import json

from database import sql_queries as sql

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/show_winners', methods=['POST'])
def show_winners_after_end_of_game():
    data = request.get_json()
    number_of_cards = data['number_of_cards']
    winners = sql.get_winners(number_of_cards)
    json_obj = json.dumps(winners)
    return json_obj


@app.route('/show_winners', methods=['GET'])
def show_winners_from_top_nav():
    winners = sql.get_winners(6)
    return render_template('winners.html',
                           winners=winners)


@app.route('/add_winner', methods=['POST'])
def add_winner():
    data = request.get_json()
    nick = data['nick']
    seconds = data['seconds']
    turns = data['turns']
    number_of_cards = data['number_of_cards']
    sql.add_winner(nick, seconds, turns, number_of_cards)
    return ''


if __name__ == '__main__':
    app.run(debug=True)
