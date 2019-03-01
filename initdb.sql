create database chator;

create table chator.messages (
  id int auto_increment primary key,
  message varchar(281) not null,
  url varchar(200)
)
character set utf8mb4 collate utf8mb4_bin;

insert into chator.messages(message) values ('rich');
insert into chator.messages(message) values ('jack');
