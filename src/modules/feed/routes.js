// src/modules/feed/routes.js
import {
  getPosts, createPost, deletePost,
  likePost, unlikePost,
  getComments, createComment, deleteComment,
} from './controller.js'

export default async function feedRoutes(app) {
  const auth = { preHandler: [app.authenticate] }

  // Feed paginado
  app.get('/',        auth, getPosts)

  // Posts
  app.post('/',       auth, createPost)
  app.delete('/:id',  auth, deletePost)

  // Likes
  app.post('/:id/like',   auth, likePost)
  app.delete('/:id/like', auth, unlikePost)

  // Comentários
  app.get('/:id/comments',    auth, getComments)
  app.post('/:id/comments',   auth, createComment)
  app.delete('/comments/:id', auth, deleteComment)
}
