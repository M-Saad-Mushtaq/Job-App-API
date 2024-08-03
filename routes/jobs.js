const express = require('express');
const router = express.Router();

const {
    getAllJobs,
    getJob,
    postJob,
    deleteJob,
    updateJob,
} = require('../controllers/jobs');

router.route('/').post(postJob).get(getAllJobs);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

module.exports = router;