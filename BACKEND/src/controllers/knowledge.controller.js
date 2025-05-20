const FormData = require('form-data');
require('dotenv').config();
const fetch = require('node-fetch');

const DATASET_MAP = {
    register: {
        id: process.env.DATASET_REGISTER_ID,
        token: process.env.DATASET_REGISTER_TOKEN,
    },
    pricing: {
        id: process.env.DATASET_PRICING_ID,
        token: process.env.DATASET_PRICING_TOKEN,
    },
    referral: {
        id: process.env.DATASET_REFERRAL_ID,
        token: process.env.DATASET_REFERRAL_TOKEN,
    },
    admission: {
        id: process.env.DATASET_ADMISSION_ID,
        token: process.env.DATASET_ADMISSION_TOKEN,
    },
    insurance: {
        id: process.env.DATASET_INSURANCE_ID,
        token: process.env.DATASET_INSURANCE_TOKEN,
    },
    'medical-docs': {
        id: process.env.DATASET_MEDICALDOCS_ID,
        token: process.env.DATASET_MEDICALDOCS_TOKEN,
    },
};

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const category = req.body.category;
        if (!category || !DATASET_MAP[category]) {
            return res.status(400).json({ error: 'Invalid or missing category' });
        }

        const { id: datasetId, token } = DATASET_MAP[category];

        const fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

        const formData = new FormData();

        const dataObject = {
            indexing_technique: "high_quality",
            process_rule: {
                rules: {
                    pre_processing_rules: [
                        { id: "remove_extra_spaces", enabled: true },
                        { id: "remove_urls_emails", enabled: true }
                    ],
                    segmentation: {
                        separator: "###",
                        max_tokens: 500
                    }
                },
                mode: "custom"
            }
        };

        formData.append('data', JSON.stringify(dataObject), { contentType: 'application/json' });
        formData.append('file', req.file.buffer, { filename: fileName, contentType: req.file.mimetype });

        const apiUrl = `http://localhost/v1/datasets/${datasetId}/document/create-by-file`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload API error:', errorText);
            return res.status(response.status).json({ error: errorText });
        }

        const result = await response.json();
        res.json({ message: 'Upload thành công', result });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};


module.exports = { uploadFile };
