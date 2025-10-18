/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  images: {
    domains: ['d2d8wwwkmhfcva.cloudfront.net'], // Instacart images
  },
}

export default nextConfig