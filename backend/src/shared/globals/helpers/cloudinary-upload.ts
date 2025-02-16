import cloudinary, {UploadApiResponse, UploadApiErrorResponse} from 'cloudinary'


export async function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiErrorResponse| UploadApiResponse | undefined>
{
  return new Promise((resolve,req)=> {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate
      },
      (error:UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if(error) resolve(error);
      resolve(result)
      }
    )
  })
}
