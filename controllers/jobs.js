const Job = require('../models/Job');
const {BadRequestError, NotFoundError} = require('../errors');
const StatusCodes = require('http-status-codes');

const getAllJobs = async (req, res) => {
    const {user} = req;

    const jobs = await Job.find({createdBy: user.userId}).sort('createdAt');

    if (!jobs) {
        throw new NotFoundError(`Don't have jobs by user ${user.userId}`)
    }

    res.status(StatusCodes.OK).json({jobs});
}

const getJob = async (req, res) => {
    //const {user} = req;
    //const jobId = req.params;
    const {
        user: { userId },
        params: { id: jobId },
      } = req
    
    const job = await Job.findOne({_id: jobId, createdBy: userId})


    if (!job) {
        throw new NotFoundError(`Don't have job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job});
}

const postJob = async (req, res) => {
    
    req.body.createdBy = req.user.userId;
    
    
    const job = await Job.create(req.body);

    res.status(StatusCodes.OK).json({job});
}

const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
      } = req
    
      const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId,
      })
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).send()
}

const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
      } = req
    
      if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
      }
      const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
      )
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).json({ job })
}

module.exports = {
    getAllJobs,
    getJob,
    postJob,
    deleteJob,
    updateJob,
}