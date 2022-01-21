import database from "./database";


// function to add a herb history to herbs_history table
// table structure:
/*
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
    foreign key (purchase_id) references purchases(id)
);
*/

// function to add a herb history to herbs_history table
export async function addHerbHistory(herb_id: number, herb_name: string, quantity: number, message: string, purchase_id: number | null) {
    const query = `
        insert into herbs_history (herb_id, herb_name, quantity, message, purchase_id)
        values (?, ?, ?, ?, ?)
    `;
    const params = [herb_id, herb_name, quantity, message, purchase_id];
    const result = await database.query(query, params);
    // close connection
    database.end();
    return result;
}


// function to get all herb histories for a herb_id
export async function getHerbHistories(herb_id: number) {
    const query = `
        select *
        from herbs_history
        where herb_id = ?
    `;
    const params = [herb_id];
    const result = await database.query(query, params);
    // close connection
    database.end();
    return result;
}


// function to remove a herb history
export async function removeHerbHistory(id: number) {
    const query = `
        delete from herbs_history
        where id = ?
    `;
    const params = [id];
    const result = await database.query(query, params);
    // close connection
    database.end();
    return result;
}

// function to remove herb histories for a purchase_id
export async function removeHerbHistories(purchase_id: number) {
    const query = `
        delete from herbs_history
        where purchase_id = ?
    `;
    const params = [purchase_id];
    const result = await database.query(query, params);
    // close connection
    database.end();
    return result;
}




