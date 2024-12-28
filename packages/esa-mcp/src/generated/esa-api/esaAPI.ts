/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * esa API
 * API for esa.io - A documentation sharing service
 * OpenAPI spec version: 1.0.0
 */
import type {
  Comment,
  GetOauthTokenInfo200,
  GetV1Teams200,
  GetV1TeamsParams,
  GetV1TeamsTeamNameComments200,
  GetV1TeamsTeamNameCommentsCommentIdParams,
  GetV1TeamsTeamNameCommentsCommentIdStargazers200,
  GetV1TeamsTeamNameEmojis200,
  GetV1TeamsTeamNameEmojisParams,
  GetV1TeamsTeamNameInvitation200,
  GetV1TeamsTeamNameInvitations200,
  GetV1TeamsTeamNamePosts200,
  GetV1TeamsTeamNamePostsParams,
  GetV1TeamsTeamNamePostsPostNumberComments200,
  GetV1TeamsTeamNamePostsPostNumberParams,
  GetV1TeamsTeamNamePostsPostNumberStargazers200,
  GetV1TeamsTeamNamePostsPostNumberWatchers200,
  GetV1TeamsTeamNameStats200,
  GetV1TeamsTeamNameTags200,
  GetV1User200,
  GetV1UserParams,
  PatchV1TeamsTeamNameCommentsCommentIdBody,
  PatchV1TeamsTeamNamePostsPostNumber200,
  PatchV1TeamsTeamNamePostsPostNumberBody,
  Post,
  PostOauthRevoke200,
  PostOauthRevokeBody,
  PostOauthToken200,
  PostOauthTokenBody,
  PostV1TeamsTeamNameCategoriesBatchMove200,
  PostV1TeamsTeamNameCategoriesBatchMoveBody,
  PostV1TeamsTeamNameCommentsCommentIdStarBody,
  PostV1TeamsTeamNameEmojis201,
  PostV1TeamsTeamNameEmojisBodyOne,
  PostV1TeamsTeamNameEmojisBodyTwo,
  PostV1TeamsTeamNameInvitationRegenerator200,
  PostV1TeamsTeamNameInvitations201,
  PostV1TeamsTeamNameInvitationsBody,
  PostV1TeamsTeamNamePostsBody,
  PostV1TeamsTeamNamePostsPostNumberCommentsBody,
  PostV1TeamsTeamNamePostsPostNumberStarBody,
  Team
} from './esaAPI.schemas'

/**
 * @summary Issue new access token
 */
export type postOauthTokenResponse = {
  data: PostOauthToken200;
  status: number;
  headers: Headers;
}

export const getPostOauthTokenUrl = () => {


  return `https://api.esa.io/oauth/token`
}

export const postOauthToken = async (postOauthTokenBody: PostOauthTokenBody, options?: RequestInit): Promise<postOauthTokenResponse> => {
  
  const res = await fetch(getPostOauthTokenUrl(),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postOauthTokenBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Get access token information
 */
export type getOauthTokenInfoResponse = {
  data: GetOauthTokenInfo200;
  status: number;
  headers: Headers;
}

export const getGetOauthTokenInfoUrl = () => {


  return `https://api.esa.io/oauth/token/info`
}

export const getOauthTokenInfo = async ( options?: RequestInit): Promise<getOauthTokenInfoResponse> => {
  
  const res = await fetch(getGetOauthTokenInfoUrl(),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Revoke access token
 */
export type postOauthRevokeResponse = {
  data: PostOauthRevoke200;
  status: number;
  headers: Headers;
}

export const getPostOauthRevokeUrl = () => {


  return `https://api.esa.io/oauth/revoke`
}

export const postOauthRevoke = async (postOauthRevokeBody: PostOauthRevokeBody, options?: RequestInit): Promise<postOauthRevokeResponse> => {
  
  const res = await fetch(getPostOauthRevokeUrl(),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postOauthRevokeBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List teams
 */
export type getV1TeamsResponse = {
  data: GetV1Teams200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsUrl = (params?: GetV1TeamsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `https://api.esa.io/v1/teams?${normalizedParams.toString()}` : `https://api.esa.io/v1/teams`
}

export const getV1Teams = async (params?: GetV1TeamsParams, options?: RequestInit): Promise<getV1TeamsResponse> => {
  
  const res = await fetch(getGetV1TeamsUrl(params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Get a team
 */
export type getV1TeamsTeamNameResponse = {
  data: Team;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}`
}

export const getV1TeamsTeamName = async (teamName: string, options?: RequestInit): Promise<getV1TeamsTeamNameResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameUrl(teamName),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Get team statistics
 */
export type getV1TeamsTeamNameStatsResponse = {
  data: GetV1TeamsTeamNameStats200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameStatsUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/stats`
}

export const getV1TeamsTeamNameStats = async (teamName: string, options?: RequestInit): Promise<getV1TeamsTeamNameStatsResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameStatsUrl(teamName),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List posts
 */
export type getV1TeamsTeamNamePostsResponse = {
  data: GetV1TeamsTeamNamePosts200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNamePostsUrl = (teamName: string,
    params?: GetV1TeamsTeamNamePostsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `https://api.esa.io/v1/teams/${teamName}/posts?${normalizedParams.toString()}` : `https://api.esa.io/v1/teams/${teamName}/posts`
}

export const getV1TeamsTeamNamePosts = async (teamName: string,
    params?: GetV1TeamsTeamNamePostsParams, options?: RequestInit): Promise<getV1TeamsTeamNamePostsResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNamePostsUrl(teamName,params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Create a post
 */
export type postV1TeamsTeamNamePostsResponse = {
  data: Post;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNamePostsUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts`
}

export const postV1TeamsTeamNamePosts = async (teamName: string,
    postV1TeamsTeamNamePostsBody: PostV1TeamsTeamNamePostsBody, options?: RequestInit): Promise<postV1TeamsTeamNamePostsResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNamePostsUrl(teamName),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postV1TeamsTeamNamePostsBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Get a post
 */
export type getV1TeamsTeamNamePostsPostNumberResponse = {
  data: Post;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNamePostsPostNumberUrl = (teamName: string,
    postNumber: number,
    params?: GetV1TeamsTeamNamePostsPostNumberParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}?${normalizedParams.toString()}` : `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}`
}

export const getV1TeamsTeamNamePostsPostNumber = async (teamName: string,
    postNumber: number,
    params?: GetV1TeamsTeamNamePostsPostNumberParams, options?: RequestInit): Promise<getV1TeamsTeamNamePostsPostNumberResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNamePostsPostNumberUrl(teamName,postNumber,params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Update a post
 */
export type patchV1TeamsTeamNamePostsPostNumberResponse = {
  data: PatchV1TeamsTeamNamePostsPostNumber200;
  status: number;
  headers: Headers;
}

export const getPatchV1TeamsTeamNamePostsPostNumberUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}`
}

export const patchV1TeamsTeamNamePostsPostNumber = async (teamName: string,
    postNumber: number,
    patchV1TeamsTeamNamePostsPostNumberBody: PatchV1TeamsTeamNamePostsPostNumberBody, options?: RequestInit): Promise<patchV1TeamsTeamNamePostsPostNumberResponse> => {
  
  const res = await fetch(getPatchV1TeamsTeamNamePostsPostNumberUrl(teamName,postNumber),
  {      
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      patchV1TeamsTeamNamePostsPostNumberBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Delete a post
 */
export type deleteV1TeamsTeamNamePostsPostNumberResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getDeleteV1TeamsTeamNamePostsPostNumberUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}`
}

export const deleteV1TeamsTeamNamePostsPostNumber = async (teamName: string,
    postNumber: number, options?: RequestInit): Promise<deleteV1TeamsTeamNamePostsPostNumberResponse> => {
  
  const res = await fetch(getDeleteV1TeamsTeamNamePostsPostNumberUrl(teamName,postNumber),
  {      
    ...options,
    method: 'DELETE'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List comments on a post
 */
export type getV1TeamsTeamNamePostsPostNumberCommentsResponse = {
  data: GetV1TeamsTeamNamePostsPostNumberComments200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNamePostsPostNumberCommentsUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}/comments`
}

export const getV1TeamsTeamNamePostsPostNumberComments = async (teamName: string,
    postNumber: number, options?: RequestInit): Promise<getV1TeamsTeamNamePostsPostNumberCommentsResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNamePostsPostNumberCommentsUrl(teamName,postNumber),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Create a comment
 */
export type postV1TeamsTeamNamePostsPostNumberCommentsResponse = {
  data: Comment;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNamePostsPostNumberCommentsUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}/comments`
}

export const postV1TeamsTeamNamePostsPostNumberComments = async (teamName: string,
    postNumber: number,
    postV1TeamsTeamNamePostsPostNumberCommentsBody: PostV1TeamsTeamNamePostsPostNumberCommentsBody, options?: RequestInit): Promise<postV1TeamsTeamNamePostsPostNumberCommentsResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNamePostsPostNumberCommentsUrl(teamName,postNumber),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postV1TeamsTeamNamePostsPostNumberCommentsBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Get a comment
 */
export type getV1TeamsTeamNameCommentsCommentIdResponse = {
  data: Comment;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameCommentsCommentIdUrl = (teamName: string,
    commentId: number,
    params?: GetV1TeamsTeamNameCommentsCommentIdParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `https://api.esa.io/v1/teams/${teamName}/comments/${commentId}?${normalizedParams.toString()}` : `https://api.esa.io/v1/teams/${teamName}/comments/${commentId}`
}

export const getV1TeamsTeamNameCommentsCommentId = async (teamName: string,
    commentId: number,
    params?: GetV1TeamsTeamNameCommentsCommentIdParams, options?: RequestInit): Promise<getV1TeamsTeamNameCommentsCommentIdResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameCommentsCommentIdUrl(teamName,commentId,params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Update a comment
 */
export type patchV1TeamsTeamNameCommentsCommentIdResponse = {
  data: Comment;
  status: number;
  headers: Headers;
}

export const getPatchV1TeamsTeamNameCommentsCommentIdUrl = (teamName: string,
    commentId: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/comments/${commentId}`
}

export const patchV1TeamsTeamNameCommentsCommentId = async (teamName: string,
    commentId: number,
    patchV1TeamsTeamNameCommentsCommentIdBody: PatchV1TeamsTeamNameCommentsCommentIdBody, options?: RequestInit): Promise<patchV1TeamsTeamNameCommentsCommentIdResponse> => {
  
  const res = await fetch(getPatchV1TeamsTeamNameCommentsCommentIdUrl(teamName,commentId),
  {      
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      patchV1TeamsTeamNameCommentsCommentIdBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Delete a comment
 */
export type deleteV1TeamsTeamNameCommentsCommentIdResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getDeleteV1TeamsTeamNameCommentsCommentIdUrl = (teamName: string,
    commentId: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/comments/${commentId}`
}

export const deleteV1TeamsTeamNameCommentsCommentId = async (teamName: string,
    commentId: number, options?: RequestInit): Promise<deleteV1TeamsTeamNameCommentsCommentIdResponse> => {
  
  const res = await fetch(getDeleteV1TeamsTeamNameCommentsCommentIdUrl(teamName,commentId),
  {      
    ...options,
    method: 'DELETE'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List all team comments
 */
export type getV1TeamsTeamNameCommentsResponse = {
  data: GetV1TeamsTeamNameComments200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameCommentsUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/comments`
}

export const getV1TeamsTeamNameComments = async (teamName: string, options?: RequestInit): Promise<getV1TeamsTeamNameCommentsResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameCommentsUrl(teamName),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List post stargazers
 */
export type getV1TeamsTeamNamePostsPostNumberStargazersResponse = {
  data: GetV1TeamsTeamNamePostsPostNumberStargazers200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNamePostsPostNumberStargazersUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}/stargazers`
}

export const getV1TeamsTeamNamePostsPostNumberStargazers = async (teamName: string,
    postNumber: number, options?: RequestInit): Promise<getV1TeamsTeamNamePostsPostNumberStargazersResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNamePostsPostNumberStargazersUrl(teamName,postNumber),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Star a post
 */
export type postV1TeamsTeamNamePostsPostNumberStarResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNamePostsPostNumberStarUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}/star`
}

export const postV1TeamsTeamNamePostsPostNumberStar = async (teamName: string,
    postNumber: number,
    postV1TeamsTeamNamePostsPostNumberStarBody: PostV1TeamsTeamNamePostsPostNumberStarBody, options?: RequestInit): Promise<postV1TeamsTeamNamePostsPostNumberStarResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNamePostsPostNumberStarUrl(teamName,postNumber),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postV1TeamsTeamNamePostsPostNumberStarBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Unstar a post
 */
export type deleteV1TeamsTeamNamePostsPostNumberStarResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getDeleteV1TeamsTeamNamePostsPostNumberStarUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}/star`
}

export const deleteV1TeamsTeamNamePostsPostNumberStar = async (teamName: string,
    postNumber: number, options?: RequestInit): Promise<deleteV1TeamsTeamNamePostsPostNumberStarResponse> => {
  
  const res = await fetch(getDeleteV1TeamsTeamNamePostsPostNumberStarUrl(teamName,postNumber),
  {      
    ...options,
    method: 'DELETE'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List comment stargazers
 */
export type getV1TeamsTeamNameCommentsCommentIdStargazersResponse = {
  data: GetV1TeamsTeamNameCommentsCommentIdStargazers200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameCommentsCommentIdStargazersUrl = (teamName: string,
    commentId: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/comments/${commentId}/stargazers`
}

export const getV1TeamsTeamNameCommentsCommentIdStargazers = async (teamName: string,
    commentId: number, options?: RequestInit): Promise<getV1TeamsTeamNameCommentsCommentIdStargazersResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameCommentsCommentIdStargazersUrl(teamName,commentId),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Star a comment
 */
export type postV1TeamsTeamNameCommentsCommentIdStarResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNameCommentsCommentIdStarUrl = (teamName: string,
    commentId: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/comments/${commentId}/star`
}

export const postV1TeamsTeamNameCommentsCommentIdStar = async (teamName: string,
    commentId: number,
    postV1TeamsTeamNameCommentsCommentIdStarBody: PostV1TeamsTeamNameCommentsCommentIdStarBody, options?: RequestInit): Promise<postV1TeamsTeamNameCommentsCommentIdStarResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNameCommentsCommentIdStarUrl(teamName,commentId),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postV1TeamsTeamNameCommentsCommentIdStarBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Unstar a comment
 */
export type deleteV1TeamsTeamNameCommentsCommentIdStarResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getDeleteV1TeamsTeamNameCommentsCommentIdStarUrl = (teamName: string,
    commentId: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/comments/${commentId}/star`
}

export const deleteV1TeamsTeamNameCommentsCommentIdStar = async (teamName: string,
    commentId: number, options?: RequestInit): Promise<deleteV1TeamsTeamNameCommentsCommentIdStarResponse> => {
  
  const res = await fetch(getDeleteV1TeamsTeamNameCommentsCommentIdStarUrl(teamName,commentId),
  {      
    ...options,
    method: 'DELETE'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List post watchers
 */
export type getV1TeamsTeamNamePostsPostNumberWatchersResponse = {
  data: GetV1TeamsTeamNamePostsPostNumberWatchers200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNamePostsPostNumberWatchersUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}/watchers`
}

export const getV1TeamsTeamNamePostsPostNumberWatchers = async (teamName: string,
    postNumber: number, options?: RequestInit): Promise<getV1TeamsTeamNamePostsPostNumberWatchersResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNamePostsPostNumberWatchersUrl(teamName,postNumber),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Watch a post
 */
export type postV1TeamsTeamNamePostsPostNumberWatchResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNamePostsPostNumberWatchUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}/watch`
}

export const postV1TeamsTeamNamePostsPostNumberWatch = async (teamName: string,
    postNumber: number, options?: RequestInit): Promise<postV1TeamsTeamNamePostsPostNumberWatchResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNamePostsPostNumberWatchUrl(teamName,postNumber),
  {      
    ...options,
    method: 'POST'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Unwatch a post
 */
export type deleteV1TeamsTeamNamePostsPostNumberWatchResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getDeleteV1TeamsTeamNamePostsPostNumberWatchUrl = (teamName: string,
    postNumber: number,) => {


  return `https://api.esa.io/v1/teams/${teamName}/posts/${postNumber}/watch`
}

export const deleteV1TeamsTeamNamePostsPostNumberWatch = async (teamName: string,
    postNumber: number, options?: RequestInit): Promise<deleteV1TeamsTeamNamePostsPostNumberWatchResponse> => {
  
  const res = await fetch(getDeleteV1TeamsTeamNamePostsPostNumberWatchUrl(teamName,postNumber),
  {      
    ...options,
    method: 'DELETE'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Batch move categories
 */
export type postV1TeamsTeamNameCategoriesBatchMoveResponse = {
  data: PostV1TeamsTeamNameCategoriesBatchMove200;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNameCategoriesBatchMoveUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/categories/batch_move`
}

export const postV1TeamsTeamNameCategoriesBatchMove = async (teamName: string,
    postV1TeamsTeamNameCategoriesBatchMoveBody: PostV1TeamsTeamNameCategoriesBatchMoveBody, options?: RequestInit): Promise<postV1TeamsTeamNameCategoriesBatchMoveResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNameCategoriesBatchMoveUrl(teamName),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postV1TeamsTeamNameCategoriesBatchMoveBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List tags
 */
export type getV1TeamsTeamNameTagsResponse = {
  data: GetV1TeamsTeamNameTags200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameTagsUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/tags`
}

export const getV1TeamsTeamNameTags = async (teamName: string, options?: RequestInit): Promise<getV1TeamsTeamNameTagsResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameTagsUrl(teamName),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Get team invitation URL
 */
export type getV1TeamsTeamNameInvitationResponse = {
  data: GetV1TeamsTeamNameInvitation200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameInvitationUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/invitation`
}

export const getV1TeamsTeamNameInvitation = async (teamName: string, options?: RequestInit): Promise<getV1TeamsTeamNameInvitationResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameInvitationUrl(teamName),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Regenerate team invitation URL
 */
export type postV1TeamsTeamNameInvitationRegeneratorResponse = {
  data: PostV1TeamsTeamNameInvitationRegenerator200;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNameInvitationRegeneratorUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/invitation_regenerator`
}

export const postV1TeamsTeamNameInvitationRegenerator = async (teamName: string, options?: RequestInit): Promise<postV1TeamsTeamNameInvitationRegeneratorResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNameInvitationRegeneratorUrl(teamName),
  {      
    ...options,
    method: 'POST'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List pending invitations
 */
export type getV1TeamsTeamNameInvitationsResponse = {
  data: GetV1TeamsTeamNameInvitations200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameInvitationsUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/invitations`
}

export const getV1TeamsTeamNameInvitations = async (teamName: string, options?: RequestInit): Promise<getV1TeamsTeamNameInvitationsResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameInvitationsUrl(teamName),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Send email invitations
 */
export type postV1TeamsTeamNameInvitationsResponse = {
  data: PostV1TeamsTeamNameInvitations201;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNameInvitationsUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/invitations`
}

export const postV1TeamsTeamNameInvitations = async (teamName: string,
    postV1TeamsTeamNameInvitationsBody: PostV1TeamsTeamNameInvitationsBody, options?: RequestInit): Promise<postV1TeamsTeamNameInvitationsResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNameInvitationsUrl(teamName),
  {      
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      postV1TeamsTeamNameInvitationsBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Delete an invitation
 */
export type deleteV1TeamsTeamNameInvitationsCodeResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getDeleteV1TeamsTeamNameInvitationsCodeUrl = (teamName: string,
    code: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/invitations/${code}`
}

export const deleteV1TeamsTeamNameInvitationsCode = async (teamName: string,
    code: string, options?: RequestInit): Promise<deleteV1TeamsTeamNameInvitationsCodeResponse> => {
  
  const res = await fetch(getDeleteV1TeamsTeamNameInvitationsCodeUrl(teamName,code),
  {      
    ...options,
    method: 'DELETE'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary List emojis
 */
export type getV1TeamsTeamNameEmojisResponse = {
  data: GetV1TeamsTeamNameEmojis200;
  status: number;
  headers: Headers;
}

export const getGetV1TeamsTeamNameEmojisUrl = (teamName: string,
    params?: GetV1TeamsTeamNameEmojisParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `https://api.esa.io/v1/teams/${teamName}/emojis?${normalizedParams.toString()}` : `https://api.esa.io/v1/teams/${teamName}/emojis`
}

export const getV1TeamsTeamNameEmojis = async (teamName: string,
    params?: GetV1TeamsTeamNameEmojisParams, options?: RequestInit): Promise<getV1TeamsTeamNameEmojisResponse> => {
  
  const res = await fetch(getGetV1TeamsTeamNameEmojisUrl(teamName,params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Create a new emoji
 */
export type postV1TeamsTeamNameEmojisResponse = {
  data: PostV1TeamsTeamNameEmojis201;
  status: number;
  headers: Headers;
}

export const getPostV1TeamsTeamNameEmojisUrl = (teamName: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/emojis`
}

export const postV1TeamsTeamNameEmojis = async (teamName: string,
    postV1TeamsTeamNameEmojisBody: PostV1TeamsTeamNameEmojisBodyOne | PostV1TeamsTeamNameEmojisBodyTwo, options?: RequestInit): Promise<postV1TeamsTeamNameEmojisResponse> => {
  
  const res = await fetch(getPostV1TeamsTeamNameEmojisUrl(teamName),
  {      
    ...options,
    method: 'POST'
    ,
    body: JSON.stringify(
      postV1TeamsTeamNameEmojisBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Delete an emoji
 */
export type deleteV1TeamsTeamNameEmojisCodeResponse = {
  data: void;
  status: number;
  headers: Headers;
}

export const getDeleteV1TeamsTeamNameEmojisCodeUrl = (teamName: string,
    code: string,) => {


  return `https://api.esa.io/v1/teams/${teamName}/emojis/${code}`
}

export const deleteV1TeamsTeamNameEmojisCode = async (teamName: string,
    code: string, options?: RequestInit): Promise<deleteV1TeamsTeamNameEmojisCodeResponse> => {
  
  const res = await fetch(getDeleteV1TeamsTeamNameEmojisCodeUrl(teamName,code),
  {      
    ...options,
    method: 'DELETE'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}



/**
 * @summary Get authenticated user
 */
export type getV1UserResponse = {
  data: GetV1User200;
  status: number;
  headers: Headers;
}

export const getGetV1UserUrl = (params?: GetV1UserParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  });

  return normalizedParams.size ? `https://api.esa.io/v1/user?${normalizedParams.toString()}` : `https://api.esa.io/v1/user`
}

export const getV1User = async (params?: GetV1UserParams, options?: RequestInit): Promise<getV1UserResponse> => {
  
  const res = await fetch(getGetV1UserUrl(params),
  {      
    ...options,
    method: 'GET'
    
    
  }

  )
  const data = await res.json()

  return { status: res.status, data, headers: res.headers }
}


