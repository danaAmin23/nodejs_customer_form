// create express object from express module
let express = require('express');
// create body parser object from body-parser package
let bodyParser = require('body-parser');

// call express constructor to create express application object
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// create a handler (using an arrow function) for the HTTP GET request
// use the __dirname global value to create fully qualified url
app.get('/', (request, response) => response.sendFile(__dirname + "/index.html"));

let sql = require("mssql");

// create configuration object literal for connection string
// must use SQL authentication
// note the the \\ in the SQL server name
let config = {
    user: 'sa',
    password: 'jimbo7',
    server: 'LAPTOP-2QMM54GE\\SQLEXPRESS',
    database: 'Store',
};
sql.connect(config, function (err) {

    // create a handler (using an arrow function) for the HTTP POST request
    app.post('/add', (request, response) => {
        let postBody = request.body;
        response.send(postBody.postBody);

        console.log('\n');

        console.log(postBody);

        let FirstName = postBody.FirstName;
        let LastName = postBody.LastName;
        let Address = postBody.Address;
        let City = postBody.City;
        let Province = postBody.Province;
        let PostalCode = postBody.PostalCode;


        // create a SQL query string with place holder values

        let queryString = "INSERT INTO Customers (FirstName, LastName, Address, City, Province, PostalCode) VALUES (@FirstName, @LastName, @Address, @City, @Province, @PostalCode)";
        // create Request object
        let req = new sql.Request();


        // input the parameter values and associated SQL Server types
        req.input("FirstName", sql.VarChar(50), FirstName)
            .input("LastName", sql.VarChar(50), LastName)
            .input("Address", sql.VarChar(50), Address)
            .input("City", sql.VarChar(50), City)
            .input("Province", sql.VarChar(25), Province)
            .input("PostalCode", sql.VarChar(10), PostalCode)

            .query(queryString, function (err, recordset) {
                if (err) {
                    console.log(err);
                }
                console.log('\n');


                // send recordset as a response for debugging purposes
                console.log("rows INSERTED " + recordset.rowsAffected);

            });


    });

    app.post('/delete', (request, response) => {
        let postBody = request.body;
        response.send(postBody);
        let CusID = postBody.CusID;
        //console.log(CusID);
        console.log('\n');
        console.log(postBody);



        let queryString = "DELETE FROM Customers WHERE CusID=@CusID";

        let req = new sql.Request();


        // input the parameter values and associated SQL Server types
        req.input("CusID", sql.VarChar(50), CusID)


            .query(queryString, function (err, recordset) {
                if (err) {
                    console.log(err);
                }

                // send recordset as a response for debugging purposes
                console.log('\n');

                console.log("rows DELETED : " + recordset.rowsAffected);

            });





    });//delete

    app.post('/update', (request, response) => {
        let postBody = request.body;
        response.send(postBody);
        let CusID = postBody.CusID;
        //console.log(CusID);
        console.log('\n');
        console.log(postBody);


        //UPDATE Supplier
        //SET City = 'Oslo', Phone = '(0)1-953530', Fax = '(0)1-953555'
        //WHERE Id = 15

        let CusId = postBody.CusId;
        let FirstName = postBody.FirstName;
        let LastName = postBody.LastName;
        let Address = postBody.Address;
        let City = postBody.City;
        let Province = postBody.Province;
        let PostalCode = postBody.PostalCode;

        let queryString = "UPDATE Customers SET FirstName=@FirstName,LastName =@LastName,Address =@Address,City =@City,Province =@Province,PostalCode=@PostalCode WHERE CusID=@CusID;";

        let req = new sql.Request();


        // input the parameter values and associated SQL Server types
        req.input("CusID", sql.VarChar(50), CusID)
            .input("FirstName", sql.VarChar(50), FirstName)
            .input("LastName", sql.VarChar(50), LastName)
            .input("Address", sql.VarChar(50), Address)
            .input("City", sql.VarChar(50), City)
            .input("Province", sql.VarChar(25), Province)
            .input("PostalCode", sql.VarChar(10), PostalCode)
            .query(queryString, function (err, recordset) {
                if (err) {
                    console.log(err);
                }
                console.log('\n');

                // send recordset as a response for debugging purposes
                console.log("rows UPDATED : " + recordset.rowsAffected);

            });





    });//delete


    app.post('/find', (request, response) => {

     //   console.log(request);
        let postBody = request.body;


        let CusID = postBody.CusID;
        //console.log(CusID);
        console.log('\n');
        console.log(postBody);

        let CusId = postBody.CusId;


        let queryString = "SELECT * FROM Customers WHERE CusId = @CusId;"; // WHERE FirstName=@FirstName,LastName =@LastName,Address =@Address,City =@City,Province =@Province,PostalCode=@PostalCode WHERE CusID=@CusID;";

        let req = new sql.Request();

        let recordsetSize;

        req.input("CusID", sql.VarChar(50), CusID)
            .query(queryString, function (err, recordset) {
                if (err) {
                    console.log(err);
                }

                recordsetSize = recordset.recordsets[0].length;
              
        

                if(recordsetSize>0){
                // var props = JSON.parse(recordset);
                // send recordset as a response for debugging purposes
                console.log(recordset.recordsets[0][0].CusID);
                console.log(recordset.recordsets[0][0].FirstName);
                console.log(recordset.recordsets[0][0].LastName);
                console.log(recordset.recordsets[0][0].Address);
                console.log(recordset.recordsets[0][0].City);
                console.log(recordset.recordsets[0][0].Province);
                console.log(recordset.recordsets[0][0].PostalCode);

                //Post fields back to Client
                postBody.first = recordset.recordsets[0][0].FirstName;
                postBody.last = recordset.recordsets[0][0].LastName;
                postBody.address = recordset.recordsets[0][0].Address;
                postBody.city = recordset.recordsets[0][0].City;
                postBody.province = recordset.recordsets[0][0].Province;
                postBody.postal = recordset.recordsets[0][0].PostalCode;


                response.send(postBody);
                }//end if
                else{
                    postBody.errMessage = "Customer Record Doesnt Exist, Please enter valid customer #";
                    response.send(postBody);
                }//end else
                
  
            });




    });//find




});







// implicitly create a server listening on port 3000
app.listen(3000, () => console.info('Application running on port 3000'));