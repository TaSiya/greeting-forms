drop table if EXISTS users, count_greet;

create table users(
    id serial not null primary key,
    users_greeted varchar(100) not null,
    user_language text not null
);

create table count_greet(
    id serial not null primary key,
    count int not null,
    foreign key (id) references users(id)
);