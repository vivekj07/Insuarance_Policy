
const errorMiddleware=(err,req,res,next)=>{

    err.message =err.message || "Internal Server Error"
    err.statuscode=err.statuscode || 500
    // console.log(err.message)

    if(err.code == 11000){
        const key=Object.keys(err.keyValue)[0];
        const value=err.keyValue[key]
        err.message=`Already Exist : ${key} : ${value} `
    }

    return res.status(err.statuscode).json({
        success:false,
        message:err.message
    })
}


class ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode
    }
}

export {ErrorHandler,errorMiddleware}