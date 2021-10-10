const express = require("express");
const db = require('./db');
const app = express();
const port = 7000;

const cors = require('cors');

const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

// set access port
app.use(express.json());
app.listen(port, () => {
  console.log(`RUN http://localhost:${port}`);
});

// default display
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

// DROP table if exists, then CREATE
const qrop_item = "DROP TABLE IF EXISTS Item";
const creat_item = "CREATE TABLE Item ( \
                      Id int NOT NULL AUTO_INCREMENT, \
                      Item varchar(255), \
                      Price DOUBLE, \
                      quantity int, \
                      PicLink varchar(255), \
                      PRIMARY KEY (Id) );";
const qrop_order = "DROP TABLE IF EXISTS Item_order";
const creat_order = "CREATE TABLE Item_order ( \
                      Id int NOT NULL AUTO_INCREMENT, \
                      Item varchar(255), \
                      Price DOUBLE, \
                      quantity int, \
                      PRIMARY KEY (Id) )";
const qrop_card = "DROP TABLE IF EXISTS Card";
const creat_card = "CREATE TABLE Card ( \
                      Id int NOT NULL AUTO_INCREMENT, \
                      card_number varchar(255), \
                      expiration_date varchar(255), \
                      cvvCode varchar(255), \
                      holder_name varchar(255), \
                      PRIMARY KEY (Id) )";
const qrop_address = "DROP TABLE IF EXISTS Address";
const creat_address = "CREATE TABLE Address ( \
                        Id int NOT NULL AUTO_INCREMENT, \
                        name varchar(255), \
                        addressLine1 varchar(255), \
                        addressLine2 varchar(255), \
                        city varchar(255), \
                        state varchar(255), \
                        zip varchar(255), \
                        PRIMARY KEY (Id) )";
const qrop_contactUsMessage = "DROP TABLE IF EXISTS ContactUs_Message";
const creat_contactUsMessage = "CREATE TABLE ContactUs_Message ( \
                                  Id int NOT NULL AUTO_INCREMENT, \
                                  content varchar(255), \
                                  PRIMARY KEY (Id) )";

const set_up = [qrop_item, creat_item, qrop_order, creat_order, qrop_card, creat_card, qrop_address, creat_address, qrop_contactUsMessage, creat_contactUsMessage];

set_up.forEach(element => db.query(element));

// INSERT default data
const item_add1 = "INSERT INTO Item (Item, Price, quantity, PicLink) VALUES ('Roller Skate', 399.95, 10, 'https://media.dollskill.com/media/1qVrP7p2r7z7HDduWyE9QzFM179S12Lk-34.jpg')"
const item_add2 = "INSERT INTO Item (Item, Price, quantity, PicLink) VALUES ('Helmet', 69.95, 10, 'https://cdn.shopify.com/s/files/1/0836/6919/products/green_bike_helmet_001_600x.jpg?v=1611711971')"
const item_add3 = "INSERT INTO Item (Item, Price, quantity, PicLink) VALUES ('Pads', 74.95, 10, 'https://www.rei.com/media/8be42fa2-c3a3-4517-85c1-e13dea1213f5?size=784x588')"
const item_add4 = "INSERT INTO Item (Item, Price, quantity, PicLink) VALUES ('Wheels', 32.00, 10, 'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/Impala-58mm-82a-Pastel-Lilac-Roller-Skate-Wheels-_341741-front-US.jpg')"
const item_add5 = "INSERT INTO Item (Item, Price, quantity, PicLink) VALUES ('Hat', 20.00, 8, 'https://cdn.shopify.com/s/files/1/0066/8945/6243/products/Impala_skate_inline_skates_blades_rollerblades_blue_180x.jpg?v=1584306107')"

const set_up2 = [item_add1, item_add2, item_add3, item_add4, item_add5];

set_up2.forEach(element =>
    db.query(element));

const order_add1 = "INSERT INTO Item_order (Item, Price, quantity) VALUES ('Roller Skate', 399.95, 0);"
const order_add2 = "INSERT INTO Item_order (Item, Price, quantity) VALUES ('Helmet', 69.95, 0);"
const order_add3 = "INSERT INTO Item_order (Item, Price, quantity) VALUES ('Pads', 74.95, 0);"
const order_add4 = "INSERT INTO Item_order (Item, Price, quantity) VALUES ('Wheels', 32.00, 0);"
const order_add5 = "INSERT INTO Item_order (Item, Price, quantity) VALUES ('Hat', 20.00, 0);"

const set_up3 = [order_add1, order_add2, order_add3, order_add4, order_add5];

set_up3.forEach(element =>
    db.query(element));

// set access API
app.get("/item_query", function(req, res) {
    const result = db.query('select * from Item');
    console.log('data: ', result);
    return res.send(result)
});

app.post("/depost_order", function(req, res) {
  var names = req.body.names;
  var quantity = req.body.quantity;

  const id_quantiy = new Map();
  const new_id_quantiy = new Map();
  
  for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var num = quantity[i];
      id_quantiy[name] = num;
  }
  
  const result1 = db.query('select * from Item');
  const result_json1 = JSON.stringify(result1);
  const result_json =  JSON.parse(result_json1);
  // console.log('result_json: ', result_json);
  // console.log('result_json.length: ', result_json.length);

  // console.log('id_quantiy: ', id_quantiy);

  var flag = true;
  var response = '';
  for (var i = 0; i < result_json.length; i++) {
    var json_e = result_json[i];
    var id_key = json_e["Id"];
    // console.log('id_key = ', id_key);
    // console.log('id_quantiy.has(id_key) ', id_key in id_quantiy);

    if (id_key in id_quantiy) {
      if (id_quantiy[id_key] > json_e["quantity"]){
        flag = false
        response += json_e["Item"] + ' only has = ' + json_e["quantity"].toString() + " in stock" + '\n'
      }
      else{
        new_id_quantiy[json_e["Id"]] = json_e["quantity"] - id_quantiy[id_key];
      }
    }
  }
  // console.log('new_id_quantiy: ', new_id_quantiy);
  // console.log('flag: ', flag);

  if (flag == true) {
    for (const [Id, value] of Object.entries(new_id_quantiy)) {
        // console.log(key, value);
        // console.log(Id + " = " + value);

        const result1 = db.query(`UPDATE Item_order SET quantity = ${id_quantiy[Id]} WHERE Id = ${Id};`);
        console.log('depost_order 1: ', result1);
        
        const result2 = db.query(`UPDATE Item SET quantity = ${value} WHERE Id = ${Id};`);
        console.log('depost_order 2: ', result2);
    }
  }
  
  return res.send(response)
});


app.get("/order_query", function(req, res) {
    const result = db.query('select * from Item_order')
    console.log('order_query: ', result);
    return res.send(result)
});

app.post("/depost_card", function(req, res) {
    var card_number = req.body.card_number;
    var expiration_date = req.body.expiration_date;
    var cvvCode = req.body.cvvCode;
    var holder_name = req.body.holder_name;
    const result = db.query(
      `INSERT INTO Card (card_number, expiration_date, cvvCode, holder_name) VALUES ('${card_number}', '${expiration_date}', '${cvvCode}', '${holder_name}');`);
    console.log('depost_card: ', result);
    return res.send(result)
    });

app.get("/card_query", function(req, res) {
    const result = db.query('select * from Card')
    console.log('card_query: ', result);
    return res.send(result)
});

app.post("/depost_address", function(req, res) {
    var name = req.body.name;
    var address_1 = req.body.address_1;
    var address_2 = req.body.address_2;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    const result = db.query(
      `INSERT INTO Address (name, addressLine1, addressLine2, city, state, zip) VALUES ('${name}', '${address_1}', '${address_2}', '${city}', '${state}', '${zip}');`);
    console.log('depost_address: ', result);
    return res.send(result)
});

app.get("/address_query", function(req, res) {
    const result = db.query('select * from Address')
    console.log('address_query: ', result);
    return res.send(result)
});

app.post("/depost_contactUsMessage", function(req, res) {
  var content = req.body.content;
  const result = db.query(
    `INSERT INTO ContactUs_Message (content) VALUES ('${content}');`);
  // console.log('depost_contactUsMessage: ', result);
  const returnId = db.query('select LAST_INSERT_ID()')
  console.log('returnId: ', returnId);
  return res.send(returnId)
});

app.get("/contactUsMessage_query", function(req, res) {
  const Id = req.body.Id;
  const result = db.query(`select * from ContactUs_Message where Id = ${Id}`)
  console.log('contactUsMessage_query: ', result);
  return res.send(result)
});