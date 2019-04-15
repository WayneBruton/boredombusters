create database boredombusters;
use boredombusters;

create table users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    Upassword VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    resettoken varchar(20),
    isLoggedIn boolean NOT NULL default false,
    resetexpiry TIMESTAMP DEFAULT NOW()
);

insert into users (email, Upassword) values ('waynebruton@icloud.com', 'password');

create table products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name varchar(100) not null unique,
    product_description text not null,
    product_weight decimal(5,2) not null default 0.0,
    product_length decimal(5,2) not null default 0.0,
    product_height decimal(5,2) not null default 0.0,
    product_breadth decimal(5,2) not null default 0.0,
    vatable boolean not null default false,
    price decimal(7,2) not null default 0.0,
    vat decimal(7,2) not null default 0.0,
    items_in_stock int not null default 999,
    product_image varchar(100),
    available   boolean default true,
    created_at TIMESTAMP DEFAULT NOW()
);

insert into products (product_name,product_description, price, product_image ) values 
(
    'Skipping Rope',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.',
    199.90,
    "/images/image25.jpeg"
),
(
    'Tic Tac Toe',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.',
    249.90,
    "/images/image26.jpeg"
),
(
    'Snakes & Ladders',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa accusamus iure neque dicta
    consequatur. Adipisci quae doloribus veniam laboriosam, illo minus ratione magnam nemo, quasi
    quos accusantium, quaerat veritatis dolor.',
    89.90,
    "/images/image27.jpeg"
);











 
