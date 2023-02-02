const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const sendFile = async (req, res) => {
  const type = req.files.file.mimetype?.split("/")[0];
  const resource_type =
    type === "image"
      ? "image"
      : type === "video" || type === "audio"
      ? "video"
      : type === "application"
      ? "raw"
      : "auto";

  const sendFile = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
    folder: "tako-uploads",
    resource_type: resource_type,
    public_id: req.files.file.name,
    use_filename: true,
  });

  if (!sendFile) {
    throw new BadRequestError(`Error in sending file. Try again later.`);
  }

  fs.unlinkSync(req.files.file.tempFilePath);

  res.status(StatusCodes.OK).json({ file: sendFile.secure_url });
};

module.exports = { sendFile };
