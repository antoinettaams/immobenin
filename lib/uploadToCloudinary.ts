import cloudinary from "./cloudinary"

export async function uploadBufferToCloudinary(buffer: Buffer) {
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "immo_biens",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve(result.secure_url)
        }
      )
      .end(buffer)
  })
}
