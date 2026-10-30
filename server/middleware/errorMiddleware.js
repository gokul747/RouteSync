export function notFound(req,res,next){res.status(404);next(new Error(`Route not found: ${req.originalUrl}`))}
export function errorHandler(err,req,res,next){const status=res.statusCode&&res.statusCode!==200?res.statusCode:500;res.status(status).json({message:status===500?'Internal server error.':err.message, ...(process.env.NODE_ENV==='development'?{detail:err.message}: {})})}
