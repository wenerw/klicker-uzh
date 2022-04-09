const LearningBlockService = require('../services/learningBlocks')
const { LearningBlockModel } = require('../models')

/* ----- queries ----- */
const allLearningBlocksQuery = async (parentValue, args, { auth }) => {
  const results = await LearningBlockModel.find({ user: auth.sub }).sort({ createdAt: -1 }).populate('instances')

  return results
}

const joinLearningBlockQuery = async (parentValue, { id }) => {
  const result = await LearningBlockModel.findById(id)

  return result
}

/* ----- mutations ----- */
const createLearningBlockMutation = (parentValue, { learningBlock: { name, questionIds } }, { auth }) => {
  return LearningBlockService.createLearningBlock({
    name,
    questionIds,
    userId: auth.sub,
  })
}

module.exports = {
  // queries
  allLearningBlocks: allLearningBlocksQuery,
  joinLearningBlock: joinLearningBlockQuery,

  // mutations
  createLearningBlock: createLearningBlockMutation,
}
