const sizeOf = require('buffer-image-size');
const Jimp = require('jimp');

exports.resizeImage = async (base64_image) => {
    const imageBytes = Buffer.from(base64_image, 'base64');
    const imageSize = sizeOf(imageBytes);

    // console.log('IMAGE HEIGHT', imageSize.height);
    // console.log('IMAGE WIDTH', imageSize.width);

    let resizeCoeff = 1;
    if (imageSize.height > 3000) {
        resizeCoeff = 0.2;
    } else if (imageSize.height > 2000) {
        resizeCoeff = 0.3;
    } else if (imageSize.height > 1000) {
        resizeCoeff = 0.5;
    } else if (imageSize.height > 600) {
        resizeCoeff = 0.9;
    }

    try {
        const jimpImage = await Jimp.read(imageBytes);
        await jimpImage.resize(imageSize.height * resizeCoeff, Jimp.AUTO);
        return await jimpImage.getBase64Async(Jimp.AUTO);
    } catch(err) {
        console.log('ERROR', err);
    }
};
