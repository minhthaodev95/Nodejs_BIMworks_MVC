
module.exports = {
    err404: (req, res, next) => {
        next(new Error('404 Not Found'));
    },
    errorHandler: (err, req, res, next) => {
          // set locals, only providing error in development

        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.sendStatus(err.status || 500);
    }
}
