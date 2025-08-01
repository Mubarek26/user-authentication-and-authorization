const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
// const Tour = require('../../models/toursmodel');
const Tour = require('../../models/toursModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(process.env.DATABASE_LOCAL, {
}).then(con => {
    console.log(con.connections)
    console.log(`DB connection successful!`)
 
})
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
//import data
const importData = async () => {
    try {
        await Tour.create(tours,{ validateBeforeSave: false }); // Disable validation for bulk insert
        await User.create(users,{ validateBeforeSave: false }); // Disable validation for bulk insert
        await Review.create(reviews,{ validateBeforeSave: false }); // Disable validation for bulk insert
        console.log('Data successfully loaded!');
    } catch(err) {
        console.log(err);
    }
}
const deleteData=async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
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