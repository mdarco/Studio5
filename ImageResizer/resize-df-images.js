const sql = require('mssql');
const { resizeImage } = require('./df-image-resizer');

const imageResize = async (base64_image) => {
    if (base64_image) {
        // const base64_prefix = base64_image.split(',')[0];
        const base64_string = base64_image.split(',')[1];
        
        try {
            return await resizeImage(base64_string);
        } catch(err) {
            console.error('DF-IMAGE-RESIZE-ERROR: ', err);
        }
    } else {
        console.error('DF-IMAGE-RESIZE-ERROR: image not found.');
    }
};

const main = async () => {
    const config = {
        user: 'sa',
        password: 'StekerSmeker2301',
        server: 'localhost\\SQL2K17',
        database: 'DF-Prod'
    };
    
    let errorCount = 0;
    try {
        const pool = await sql.connect(config);
        console.log('Connected to DB...');

        // const result = await sql.query`select MemberID, LastName from [Members] where FirstName = 'Maja' and LastName = 'Milutinović'`;
        const sqlResult = await pool.request().query("select MemberID, ProfileImage from [Members]");
    
        if (sqlResult && sqlResult.recordset && sqlResult.recordset.length > 0) {
            for (let i = 0; i <= sqlResult.recordset.length - 1; i++) {
                const item = sqlResult.recordset[i];
                if (item.ProfileImage) {
                    console.log('Processing member [ID = %s]', item.MemberID);
                    const result = await imageResize(item.ProfileImage);

                    const updateStatement = `
                        update Members
                        set ProfileImage = '${result}'
                        where MemberID = ${item.MemberID}
                    `;

                    await pool.request().query(updateStatement);

                    console.log('Processing member [ID = %s] done.', item.MemberID);
                }
            }
            console.log('Processing DONE.');
            console.log('Error no. =', errorCount);
        }
    } catch (err) {
        errorCount++;
        console.log('DB ERROR: ', err);
    }
};

main();
