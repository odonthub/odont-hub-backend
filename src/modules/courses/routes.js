// src/modules/courses/routes.js
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse, enrollCourse } from './controller.js'

export default async function courseRoutes(app) {
  const auth = { preHandler: [app.authenticate] }
  app.get('/',          auth, getCourses)
  app.get('/:id',       auth, getCourse)
  app.post('/',         auth, createCourse)
  app.patch('/:id',     auth, updateCourse)
  app.delete('/:id',    auth, deleteCourse)
  app.post('/:id/enroll', auth, enrollCourse)
}
