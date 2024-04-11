import { API_URI } from '~app/configs';
import { post } from '~app/utils/helpers';

type UploadInput = {
  name: string;
  media_type: string;
};

async function createUploadLink({ name, media_type }: UploadInput) {
  return await post<string>(
    `${API_URI}/ms-media-management/api/media/pre_up`,
    { name, media_type },
    {
      authorization: true,
    },
  );
}

async function createMassUploadLink({ name, media_type }: UploadInput) {
  return await post<{
    link: string;
    file_name_origin: string;
    file_name: string;
  }>(
    `${API_URI}/finan-mass-upload/api/v1/mass-upload/pre-up`,
    { name, media_type },
    {
      authorization: true,
    },
  );
}

async function upload(uploadUrl: string, { mime_type, content }: { mime_type: string; content: ArrayBuffer }) {
  return await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mime_type,
      'x-amz-acl': 'public-read',
    },
    body: content,
  });
}

async function commitUploadLink({ name, media_type }: UploadInput) {
  return await post<{ upload_url: string }>(
    `${API_URI}/ms-media-management/api/media/pos_up`,
    { name, media_type },
    {
      authorization: true,
    },
  );
}

const MediaService = {
  createUploadLink,
  createMassUploadLink,
  upload,
  commitUploadLink,
};

export default MediaService;
