const BookModel = require('../../db/models/book.model');

const addBookToPuchaseListing = async(req, res)=>{
    try{

        const { name, author, price, quantity } = req.body;

        const listedBy = req.user._id;


        const bookExists = await BookModel.findOne({
            name,
            listedBy
        });

        if(bookExists){
            return res.status(409).json({
                status : "error",
                message : "book entry already exists for the user"
            })
        }
        
        const newBook = new BookModel({
            name,author,price, quantity,listedBy
        });

        await newBook.save();

        return res.status(200).json({
            status : "success",
            msessage : "new book listing done"
        });

    }catch(e){
        return res.status(500).json({
            status : "error",
            message : "server error"
        })
    }
};


const getBook = async(req,res)=>{
    try{

        const listedBy = req.user._id;
        const { id } = req.params;

        const bookInfo = await BookModel.findOne({
            listedBy,
            _id : id
        },{
            createdAt : 0,
            updatedAt : 0
        }).populate('listedBy',{
            verification : 0,
            password : 0,
            createdAt : 0,
            updatedAt : 0,
            role : 0
        });

        return res.status(200).json({
            status : "success",
            bookInfo
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            status : "error",
            message : "server error"
        });
    }
}




module.exports = {
    addBookToPuchaseListing,
    getBook
}