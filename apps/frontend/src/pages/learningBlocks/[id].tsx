import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'

import JoinLearningBlockQuery from '../../graphql/queries/JoinLearningBlockQuery.graphql'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '../../lib/apollo'

function JoinLearningBlock({ id }): React.ReactElement {
  const intl = useIntl()
  const router = useRouter()

  const { data, loading, error, subscribeToMore } = useQuery(JoinLearningBlockQuery, {
    variables: { id },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data || error) {
    return <div>Failed...</div>
  }

  console.log(data)

  return (
    <div>
      {data.joinLearningBlock.instances.map((instance) => {
        return <div>{instance.question.title}</div>
      })}
    </div>
  )
}

export async function getServerSideProps(props) {
  const apolloClient = initializeApollo()

  try {
    await Promise.all([
      apolloClient.query({
        query: JoinLearningBlockQuery,
        variables: {
          id: props.req.params.id,
        },
      }),
    ])
  } catch (error) {
    console.log(error)
  }

  return {
    props: {
      [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract(),
      id: props.req.params.id,
    },
  }
}

export default JoinLearningBlock
