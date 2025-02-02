import mongoose from "mongoose";


const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${"faq"}`)
        console.log(`\n MongoDb Coneected Succesfully `)


    } catch (error) {
        console.log("Error", error)
        process.exit(1)
    }

}

export default connectDb