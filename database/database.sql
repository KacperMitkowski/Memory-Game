DROP TABLE IF EXISTS winners
CREATE TABLE winners (
    id serial not null PRIMARY KEY,
    nick text,
    seconds integer,
    turns integer,
    number_of_cards integer
);






