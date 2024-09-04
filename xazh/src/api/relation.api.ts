import { xazhAxios } from '../axios/xazh.axios'

export async function GetRelationInteractionAPI(users: string[]) {
  const result = await xazhAxios.post('/Relation/GetInteraction', {
    users: users,
  })

  return result.data ? result.data.body : null
}

export async function FollowUserAPI(users: string[]) {
  const result = await xazhAxios.post('/Relation/Follow', {
    users: users,
  })

  return result.data ? result.data.body : null
}

/**
 * Unfollow some users.
 * @param users
 * @param chunks Frist item is user's chunk,
 * second item is follower's chunk in Array of follower.
 * @returns
 */
export async function UnfollowUserAPI(
  users: string[],
  chunks?: { [key: string]: [string, string] }
) {
  const result = await xazhAxios.post('/Relation/Unfollow', {
    users: users,
    chunks: chunks,
  })

  return result.data ? result.data.body : null
}
