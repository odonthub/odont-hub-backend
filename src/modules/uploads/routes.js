// src/modules/uploads/routes.js
import { uploadImage, uploadVideo, uploadDocument } from './controller.js'

export default async function uploadRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.post('/image',    auth, uploadImage)
  app.post('/video',    auth, uploadVideo)
  app.post('/document', auth, uploadDocument)
}
