import { v4 } from 'uuid';
import { read, utils } from 'xlsx';

export const createDownloadElement = (url: string, fileName = 'file') => {
  const element = document.createElement('a');
  element.href = url;
  element.setAttribute('download', fileName);
  element.setAttribute('target', '_blank');
  element.click();
};

export const handleDownloadImage = async (url: string, fileName: string) => {
  return fetch(url)
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      const fileUrl = URL.createObjectURL(blob);
      createDownloadElement(fileUrl, fileName);
    })
    .catch(() => {
      throw 'error on downloading image';
    });
};

export function downloadBuffer(arrayBuffer: ExpectedAny, filename: string) {
  const byteArray = new Uint8Array(arrayBuffer);
  const newBlob = new Blob([byteArray], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(newBlob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export const handleChangeFiles = async ({ files, maxFiles = 10 }: { files: ExpectedAny[]; maxFiles: number }) => {
  const formatFiles = [];
  for (let i = 0; i < files.length; i++) {
    if (formatFiles.length < maxFiles) {
      const file = files[i];
      if (isLocalImage(file)) {
        const dotExt = /\.[^.$]+$/.exec(file.name)?.[0];
        if (dotExt) {
          const name = v4() + dotExt;
          formatFiles.push({
            name,
            type: file.type,
            url: window.URL.createObjectURL(file),
            content: await file.arrayBuffer(),
          });
        }
      } else {
        formatFiles.push(file);
      }
    }
  }
  return formatFiles;
};

export const revokeObjectUrl = (url: string) => {
  if (window.URL) {
    window.URL.revokeObjectURL(url);
  }
};

export const isExcelValidate = (bstr: string | ArrayBuffer | null) => {
  const wb = read(bstr, { type: 'binary' });
  const wsname = wb.SheetNames[0];

  if (wsname) {
    const ws = wb.Sheets[wsname];
    if (ws) {
      const data = utils.sheet_to_json(ws, {
        header: 1,
      });
      const result = data.filter((item: ExpectedAny) => item.length > 0);
      if (result.length - 1 === 0 || result.length - 1 > 1000) {
        return false;
      }
      return true;
    }
    return false;
  }
  return false;
};

export function isLocalImage(image: string | PendingUploadImage): image is PendingUploadImage {
  return typeof image === 'object';
}
