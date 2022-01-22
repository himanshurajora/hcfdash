import database from "./database";


// function to add a composition history to compositions_herb_history table
// table structure:

/*
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
*/

// function to add a composition history to compositions_herb_history table

export async function addCompositionHistory(composition_id, herb_id, herb_name, quantity, message) {
    const query = `
        insert into composition_herb_history (composition_id, herb_id, herb_name, quantity, message)
        values (?, ?, ?, ?, ?)
    `;
    const params = [composition_id, herb_id, herb_name, quantity, message];
    const result = await database.query(query, params);
    // close connection
    database.end();
    return result;
}

// function to get all composition histories for a composition_id
export async function getCompositionHistories(composition_id) {
    const query = `
        select *
        from composition_herb_history
        where composition_id = ?
    `;
    const params = [composition_id];
    const result = await database.query(query, params);
    // close connection
    database.end();
    return result;
}

// function to remove a composition history
export async function removeCompositionHistory(id) {
    const query = `
        delete from composition_herb_history
        where id = ?
    `;
    const params = [id];
    const result = await database.query(query, params);
    // close connection
    database.end();
    return result;
}

// function to remove a composition history by composition_id
export async function removeCompositionHistoryByCompositionId(composition_id) {
    const query = `
        delete from composition_herb_history
        where composition_id = ?
    `;
    const params = [composition_id];
    const result = await database.query(query, params);
    // close connection
    database.end();
    return result;
}
