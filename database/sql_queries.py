from database import db_connection as con


@con.connection_handler
def add_winner(cursor, nick, seconds, turns, number_of_cards):
    cursor.execute("""
                   INSERT INTO winners(nick, 
                                       seconds, 
                                       turns, 
                                       number_of_cards) 
                   VALUES(%(nick)s, 
                          %(seconds)s,
                          %(turns)s,
                          %(number_of_cards)s);
                   """, {'nick': nick,
                         'seconds': int(seconds),
                         'turns': int(turns),
                         'number_of_cards': int(number_of_cards)})


@con.connection_handler
def get_winners(cursor, number_of_cards):
    cursor.execute("""
                   SELECT nick, seconds, turns, number_of_cards
                   FROM winners
                   WHERE number_of_cards=%(number_of_cards)s
                   ORDER BY seconds ASC;
                   """,
                   {'number_of_cards': number_of_cards})
    winners = cursor.fetchall()
    return winners
