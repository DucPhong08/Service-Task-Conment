const errorHandling =(err , req , res , next) => {
    console.log(err);
    res.status(500).json({
        status : 500 ,
        message :"1 số lỗi" ,
        err : err.message
    })
    
}

export default errorHandling