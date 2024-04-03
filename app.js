var express = require("express");
var mongoose = require("mongoose");
var app = express();
const exphbs = require("express-handlebars");
var database = require("./config/database");
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

// Set Templating Enginge
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

mongoose.connect(database.url);

var Employee = require("./models/employee");
var Product = require("./models/product");

//get all employee data from db
app.get("/api/employees", async function (req, res) {
  // use mongoose to get all todos in the database
  try {
    const employees = await Employee.find();
    res.json(employees); // return all employees in JSON format
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get all products data from db
app.get("/api/products", async function (req, res) {
  // use mongoose to get all todos in the database
  try {
    const products = await Product.find().lean();
    res.render('product',{products: products}); // return all products in JSON format
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/newProduct', function(req,res) {
    res.render('newProduct.hbs');
})

// get a employee with ID of 1
app.get("/api/employees/:employee_id", async function (req, res) {
  let id = req.params.employee_id;
  try {
    const employee = await Employee.findById(id);

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get a product with ID of 1
app.get("/api/products/:product_id", async function (req, res) {
  let id = req.params.product_id;
  try {
    const product = await Product.findById(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create employee and send back all employees after creation
app.post("/api/employees", async function (req, res) {
  // create mongose method to create a new record into collection
  console.log(req.body);
  try {
    const employee = await Employee.create({
      name: req.body.name,
      salary: req.body.salary,
      age: req.body.age,
    });

    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create product and send back all products after creation
app.post("/api/products", async function (req, res) {
  console.log(req.body);

  try {
    const product = new Product({
      asin: req.body.asin,
      title: req.body.title,
      imgUrl: req.body.imgUrl,
      stars: req.body.stars,
      reviews: req.body.reviews,
      price: req.body.price,
      listPrice: req.body.listPrice,
      categoryName: req.body.categoryName,
      isBestSeller: req.body.isBestSeller,
      boughtInLastMonth: req.body.boughtInLastMonth,
    });

    await product.save();
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create employee and send back all employees after creation
app.put("/api/employees/:employee_id", async function (req, res) {
  // create mongose method to update an existing record into collection
  console.log(req.body);

  let id = req.params.employee_id;
  var data = {
    name: req.body.name,
    salary: req.body.salary,
    age: req.body.age,
  };

  // save the user
  await Employee.findByIdAndUpdate(id, data);
  res.send("Successfully! Employee updated - " + req.body.name);
});

// create product and send back all products after creation
app.put("/api/products/:product_id", async function (req, res) {
  // create mongose method to update an existing record into collection
  console.log(req.body);

  let id = req.params.product_id;
  var data = {
    title: req.body.title,
    price: req.body.price,
    
  };

  // save the user
  await Product.findByIdAndUpdate(id, data);
  res.send("Successfully! Product updated - " + req.body.id);
});

// delete a employee by id
app.delete("/api/employees/:employee_id", async function (req, res) {
  console.log(req.params.employee_id);
  let id = req.params.employee_id;
  await Employee.deleteOne({_id: id,});
  res.send("Successfully! Employee has been Deleted.");
});

// delete a product by id
app.delete("/api/products/:product_id", async function (req, res) {
  console.log(req.params.product_id);
  let id = req.params.product_id;
  await Product.deleteOne({ _id: id });
  res.send("Successfully! Product has been Deleted.");
});

app.listen(port);
console.log("App listening on port : " + port);
