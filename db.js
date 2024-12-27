import pg from 'pg';

const database = new pg.Client({
    user:'postgres',
    host:'localhost',
    password:'Venki@6363',
    database:'scrapcart',
    port: 5432
})

database.connect((error) =>{
    if(error){
        console.error("connection failed! ", error.stack);
    }
    console.log("connection successful!..");

})


export default database;