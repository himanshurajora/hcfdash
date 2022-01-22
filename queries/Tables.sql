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
    quantity float not null,
    reorder_level float not null,
    purchase_price float not null,
    selling_price float not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- The purchses Table

drop table if exists purchases;

create table purchases (
    id int not null auto_increment,
    purchase_date date not null,
    remarks varchar(255) not null,
    invoice_no varchar(255) not null,
    total_amount float not null,
    product_type varchar(255) not null default 'Herbs',
    primary key (id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- The Purchase_Herbs Tables, This table is connected to the purchases table
-- It will store the details of the herbs purchased

drop table if exists purchase_herbs;

create table purchase_herbs (
    id int not null auto_increment,
    purchase_id int not null,
    herb_id int not null,
    herb_name varchar(255) not null,
    quantity float not null,
    purchase_price float not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (id),
    foreign key (purchase_id) references purchases(id),
    foreign key (herb_id) references herbs(id)
);

-- A table to store herbs_history
-- This table will store the details of the herbs purchased and consumed
-- message column will be used to store the message of the transaction like "Herb Purchased" or "Herb Consumed"
drop table if exists herbs_history;

create table herbs_history (
    id int not null auto_increment,
    herb_id int,
    herb_name varchar(255) not null,
    quantity float not null,
    message varchar(255) not null,
    purchase_id int,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (id),
);

-- A table to store the compositions of the herbs

drop table if exists compositions;

create table compositions (
    id int not null auto_increment,
    code varchar(255) not null,
    name varchar(255) not null,
    quantity float not null default 0,
    formula_quantity float not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (id),
    unique (code)
);

-- A table for composition_herbs 
-- This table will store herb information for each composition_id

drop table if exists composition_herbs;

create table composition_herbs (
    id int not null auto_increment,
    composition_id int not null,
    herb_id int not null,
    herb_name varchar(255) not null,
    quantity float not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (id),
    foreign key (composition_id) references compositions(id),
    foreign key (herb_id) references herbs(id)
);

-- A table to store composition_herb_history

drop table if exists composition_herb_history;

create table composition_herb_history (
    id int not null auto_increment,
    composition_id int,
    herb_id int,
    herb_name varchar(255) not null,
    quantity float not null,
    message varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (id),
);