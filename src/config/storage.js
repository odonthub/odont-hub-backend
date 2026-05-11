// src/config/storage.js — Cloudflare R2
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import sharp from 'sharp'
import { randomUUID } from 'crypto'

export const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME
const PUBLIC = process.env.R2_PUBLIC_URL

// Tipos permitidos
const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEOS = ['video/mp4', 'video/quicktime', 'video/webm']
const ALLOWED_DOCS   = ['application/pdf']
const MAX_IMAGE_SIZE = 8 * 1024 * 1024   // 8MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024  // 200MB
const MAX_DOC_SIZE   = 20 * 1024 * 1024   // 20MB

export const storage = {
  // Upload de imagem (redimensiona para max 1200px e converte para webp)
  async uploadImage(buffer, mimetype, folder = 'posts') {
    if (!ALLOWED_IMAGES.includes(mimetype)) throw new Error('Tipo de imagem não permitido')
    if (buffer.length > MAX_IMAGE_SIZE) throw new Error('Imagem maior que 8MB')

    const optimized = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()

    const key = `${folder}/${randomUUID()}.webp`
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key: key,
      Body: optimized, ContentType: 'image/webp',
    }))
    return `${PUBLIC}/${key}`
  },

  // Upload de vídeo (direto, sem transcodificação no MVP)
  async uploadVideo(buffer, mimetype, folder = 'videos') {
    if (!ALLOWED_VIDEOS.includes(mimetype)) throw new Error('Tipo de vídeo não permitido')
    if (buffer.length > MAX_VIDEO_SIZE) throw new Error('Vídeo maior que 200MB')

    const ext = mimetype.split('/')[1]
    const key = `${folder}/${randomUUID()}.${ext}`
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key: key, Body: buffer, ContentType: mimetype,
    }))
    return `${PUBLIC}/${key}`
  },

  // Upload de documento (PDF, currículo, etc.)
  async uploadDocument(buffer, mimetype, folder = 'documents') {
    if (!ALLOWED_DOCS.includes(mimetype)) throw new Error('Apenas PDF é permitido')
    if (buffer.length > MAX_DOC_SIZE) throw new Error('Arquivo maior que 20MB')

    const key = `${folder}/${randomUUID()}.pdf`
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key: key, Body: buffer, ContentType: 'application/pdf',
    }))
    return `${PUBLIC}/${key}`
  },

  // Apaga arquivo pelo URL público
  async delete(publicUrl) {
    const key = publicUrl.replace(`${PUBLIC}/`, '')
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
  },
}
