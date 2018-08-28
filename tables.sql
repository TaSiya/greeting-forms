drop table if EXISTS users;

create table users(
    id serial not null primary key,
    users_greeted varchar(100) not null,
    user_language text not null
);

