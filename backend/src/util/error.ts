export const handleError = (err, req, res, next) => {
    let code: Number = req.code ? req.code : res.statusCode.toString();
    let status: String = "error";

    if (code == 404)
        status = "not found";
    else if (code == 422)
        status = "unprocessable entity";
    else if (code == 401)
        status = "unauthorized";

    res.status(code).send({
        status: status,
        code: code,
        messages: 'ERROR: ' + err.message,
        result: {}
    });
    console.log('ERROR:' + err.message);
};