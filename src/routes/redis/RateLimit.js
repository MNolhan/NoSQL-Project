import redisClient from "../redis/redisClient.js";

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate:${ip}`;

    const requests = await redisClient.incr(key);

    if (requests === 1) {
      await redisClient.expire(key, 900);
    }

    if (requests > 100) {
      return res.status(429).json({
        message: "Trop de requêtes, veuillez réessayer plus tard"
      });
    }

    next();
  } catch (err) {
    next();
  }
};

export default rateLimiter;