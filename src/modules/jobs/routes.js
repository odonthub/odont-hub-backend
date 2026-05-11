// src/modules/jobs/routes.js
import {
  getJobs, getJob, createJob, updateJob, deleteJob,
  applyToJob, getMyApplications,
  createProfile, getProfiles, updateProfile,
} from './controller.js'

export default async function jobRoutes(app) {
  const auth = { preHandler: [app.authenticate] }

  // Vagas
  app.get('/',             auth, getJobs)
  app.get('/:id',          auth, getJob)
  app.post('/',            auth, createJob)
  app.patch('/:id',        auth, updateJob)
  app.delete('/:id',       auth, deleteJob)

  // Candidaturas
  app.post('/:id/apply',   auth, applyToJob)
  app.get('/applications/me', auth, getMyApplications)

  // Perfis "Estou disponível"
  app.get('/profiles/available',  auth, getProfiles)
  app.post('/profiles/me',        auth, createProfile)
  app.patch('/profiles/me',       auth, updateProfile)
}
