import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import LearningBlockListQuery from '../../graphql/queries/LearningBlockListQuery.graphql'
import TeacherLayout from '../../components/layouts/TeacherLayout'

const messages = defineMessages({
  pageTitle: {
    defaultMessage: 'Learning Blocks',
    id: 'learningBlocks.pageTitle',
  },
  title: {
    defaultMessage: 'Learning Blocks',
    id: 'learningBlocks.title',
  },
})

function Index(): React.ReactElement {
  const intl = useIntl()

  const { data } = useQuery(LearningBlockListQuery)

  console.log(data)

  return (
    <TeacherLayout
      navbar={{
        title: intl.formatMessage(messages.title),
      }}
      pageTitle={intl.formatMessage(messages.pageTitle)}
      sidebar={{ activeItem: 'learningBlocks' }}
    >
      <div className="h-full py-4 px-[0.7rem] md:m-auto md:p-8 md:max-w-screen-xl" />
    </TeacherLayout>
  )
}

export default Index
