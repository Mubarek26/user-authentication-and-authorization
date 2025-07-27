const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/toursmodel');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
    // serverSelectionTimeoutMS: 10000
}).then(con => {
    console.log(con.connections)
    console.log(`DB connection successful!`)
 
})
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
//import data
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch(err) {
        console.log(err);
    }
}
const deleteData=async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch(err) {
        console.log(err);
    }
}
console.log(process.argv);
if (process.argv[2] === 'import') {
    importData();
} else if (process.argv[2] === 'delete') {
    deleteData();
}