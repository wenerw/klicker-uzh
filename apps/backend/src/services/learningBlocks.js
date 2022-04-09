const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const { ObjectId } = mongoose.Types

const { QuestionInstanceModel, LearningBlockModel, UserModel, QuestionModel } = require('../models')

async function createLearningBlock({ name, questionIds, userId }) {
  const learningBlockId = ObjectId()

  // initialize a new session namespace for hashing purposes
  const namespace = uuidv4()

  let instances = []

  const newInstances = questionIds.map(async (questionId) => {
    const question = await QuestionModel.findById(questionId)

    // create a new question instance model
    const instance = new QuestionInstanceModel({
      question: questionId,
      learningBlock: learningBlockId,
      user: userId,
      version: question.versions.length - 1,
    })

    instances = [...instances, instance]

    return instance.id
  })

  // create a new session model
  // pass in the list of blocks created above
  const newLearningBlock = new LearningBlockModel({
    _id: learningBlockId,
    namespace,
    name,
    instances: await Promise.all(newInstances),
    user: userId,
  })

  await Promise.all([
    ...instances.map((instance) => instance.save()),
    newLearningBlock.save(),
    UserModel.findByIdAndUpdate(userId, {
      $push: { learningBlocks: newLearningBlock.id },
    }),
  ])

  return newLearningBlock
}

module.exports = {
  createLearningBlock,
}
