const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const env = process.env;


module.exports = async (req, res,next) => {
  try {
    const {authorization} = req.headers;  
    const [tokenType, tokendata] = (authorization ?? "").split(" ");


        if (tokenType !== "Bearer" || !tokendata) {
            return res
                .status(401)
                .json({ message: "로그인이 필요한 기능입니다" });
        }
        const decodedToken = jwt.verify(tokendata, env.SECRET_KEY);
        const userId = decodedToken.userId;
        const user = await Users.findOne({ where: { userId } });

        res.locals.user = user;
        next();
    } catch (err) {
        err.message = err.expect
            ? err.message
            : "전달된 토큰에서 오류가 발생하였습니다.";
        err.status = err.expect ? err.status : 403;
        next(err);
    }
};
