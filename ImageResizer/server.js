const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { resizeImage } = require('./df-image-resizer');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
	res.send('DF-Image-Resizer v0.1');
});

app.post('/resize-image', async (req, res) => {
    const base64_image = req.body.image;
    // console.log('POST B64_IMAGE', base64_image);
    if (base64_image) {
        // const base64_prefix = base64_image.split(',')[0];
        const base64_string = base64_image.split(',')[1];
        
        try {
            const resizedImage = await resizeImage(base64_string);
            res.status(200).json({ resizedImage });
        } catch(err) {
            console.error('DF-IMAGE-RESIZE-ERROR: ', err);
        }
    } else {
        console.error('Image not found.');
    }
});

app.listen(7000, err => {
	if (err) {
		console.error('There was an error while starting the server:');
		console.error(err);
		process.exit(1);
	}

	console.log(`DF-Image-Resizer is now running on port 7000...`);	
});
