module.exports = `
  input LearningBlockInput {
    name: String!
    questionIds: [ID!]!
  }
  type LearningBlock {
    id: ID!
    name: String!
    user: User!

    instances: [QuestionInstance_LearningBlock!]!

    createdAt: DateTime!
    updatedAt: DateTime!
    openedAt: DateTime!
    closedAt: DateTime!
  }
`
