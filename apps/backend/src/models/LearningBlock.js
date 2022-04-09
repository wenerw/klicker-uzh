const mongoose = require('mongoose')
// const _values = require('lodash/values')
const { v4: uuidv4 } = require('uuid')

const { ObjectId } = mongoose.Schema.Types

// const { SESSION_STATUS, SESSION_STORAGE_MODE, SESSION_AUTHENTICATION_MODE } = require('../constants')

const LearningBlock = new mongoose.Schema(
  {
    namespace: { type: String, default: uuidv4 },
    name: { type: String, default: Date.now, index: true },
    settings: {
      timeLimitPerQuestion: { type: Number, default: -1 },
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    instances: [{ type: ObjectId, ref: 'QuestionInstance', required: true }],

    openedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
)

LearningBlock.index({ '$**': 1 })

module.exports = {
  LearningBlockModel: mongoose.model('LearningBlock', LearningBlock),
}
