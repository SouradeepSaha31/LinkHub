class ApiResponse {
    constructor(statusCode, message= "Successful", data){
        this.statusCode = statusCode,
        this.message = message,
        this.data = data,
        this.success = true
        return this
    }
}

export {ApiResponse}