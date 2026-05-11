// src/modules/experts/routes.js
import { getExperts, getExpert, startConsultation, getWhatsappLink } from './controller.js'

export default async function expertRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.get('/',              auth, getExperts)
  app.get('/:id',           auth, getExpert)
  app.post('/:id/consult',  auth, startConsultation)
  app.get('/:id/whatsapp',  auth, getWhatsappLink)
}
