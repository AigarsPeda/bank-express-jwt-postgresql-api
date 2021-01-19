// import { Response } from "express";
// import { poll } from "../../db";
// import { RequestWithUser } from "../../types";

// const SUPPORTED_IMAGE_TYPES = [
//   "image/png",
//   "image/jpeg",
//   "image/webp",
//   "image/jpg"
// ];

// dotenv.config();

// const gc = new Storage({
//   keyFilename: path.join(__dirname, "../key.json"),
//   projectId: "todo-node-1"
// });

// // gc.getBuckets().then((x) => console.log(x));
// const todoAvatars = gc.bucket("todo-avatars");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }).single("image");

// export const updateAvatar = async (req: RequestWithUser, res: Response) => {
//   try {
//     if (req.user) {
//       const { user } = req.user;

//       if (req.file && SUPPORTED_IMAGE_TYPES.includes(req.file.mimetype)) {
//         const url = await uploadImage(req.file, todoAvatars, user.username);

//         const foundUser = await poll.query(
//           "UPDATE users SET user_image_url = $1 WHERE user_id = $2 RETURNING user_image_url",
//           [url, user.user_id]
//         );

//         // console.log(foundUser.rows[0].user_image_url);

//         // TODO: do something if foundUser undefine

//         return res.status(200).json(foundUser.rows[0].user_image_url);
//       } else {
//         return res.status(403).json({
//           error: "Wrong image format. Acceptable formats WEBP PNG JPEG JPG"
//         });
//       }
//     } else {
//       return res.status(403).json({ error: "no user" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     return res.status(503).json({ error: "service unavailable" });
//   }

// };
