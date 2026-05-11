// src/modules/marketplace/routes.js
import {
  getListings, getListing, createListing, updateListing, deleteListing,
  expressInterest, getMyConversations,
} from './controller.js'

export default async function marketRoutes(app) {
  const auth = { preHandler: [app.authenticate] }

  app.get('/',             auth, getListings)
  app.get('/:id',          auth, getListing)
  app.post('/',            auth, createListing)
  app.patch('/:id',        auth, updateListing)
  app.delete('/:id',       auth, deleteListing)
  app.post('/:id/interest',auth, expressInterest)  // abre chat privado
  app.get('/conversations/me', auth, getMyConversations)
}
