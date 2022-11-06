import fileUpload from "express-fileupload";

interface IImageValidate {
  images: fileUpload.UploadedFile | fileUpload.UploadedFile[];
}

export const imageValidate = (images: IImageValidate) => {
  let imagesTable = [];

  //   checking if the images argument is an array
  if (Array.isArray(images)) {
    imagesTable = images;
  } else {
    imagesTable.push(images);
  }

  //   the number of photos validation (no more than three)
  if (imagesTable.length > 3) {
    return { err: "you can send maximum 3 images" };
  }

  //   iterating through the array or an image
  for (let image of imagesTable) {
    // check of the size, if its bigger than 1MB then it returns error
    if (image.size > 1048576) return { err: "size of the image is too big" };

    // really basic regExp which helps me with checking the type of the file
    const fileTypes = /jpg|png|jpeg/;
    const mimetype = fileTypes.test(image.mimetype);
    if (!mimetype) return { err: "Incorrect type of the file " };
  }

  return { err: false };
};
