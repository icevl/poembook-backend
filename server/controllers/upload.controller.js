import db from '../../config/sequelize';

const Upload = db.Upload;

/**
 * Get upload
 */
function get(req, res) {
    return res.json(req.upload);
}

/**
 * Create new upload
 */
function create(req, res, next) {
    const upload = {
        user_id: req.user.id
    };

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // const file = req.files.file;
    // console.log('file', file);

    Upload.create(upload)
        .then(savedUpload => res.json(savedUpload))
        .catch(e => next(e));

    return true;
}

/**
 * Delete upload
 */
function remove(req, res, next) {
    const upload = req.upload;
    upload
        .destroy()
        .then(() => res.json({ success: true }))
        .catch(e => next(e));
}

export default { get, create, remove };
