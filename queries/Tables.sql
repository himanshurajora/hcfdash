-- Remove herbs table if exists
drop table if exists herbs;

-- The Herbs Table
create table herbs (
    id int not null auto_increment,
    name varchar(255) not null,
    primary key (id),
    unique (name),
    botanical_name varchar(255) not null,
    unit varchar(255) not null,
    quantity int not null,
    reorder_level int not null,
    purchase_price int not null,
    selling_price int not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);
