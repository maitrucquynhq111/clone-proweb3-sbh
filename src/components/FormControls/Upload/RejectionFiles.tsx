import { FileRejection } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { CustomFile } from './type';
import { numberFormat } from '~app/configs';

type Props = {
  fileRejections: FileRejection[];
  accept: { [key: string]: string[] };
};

export default function RejectionFiles({ fileRejections, accept }: Props) {
  const { t } = useTranslation(['products-form']);

  return (
    <div className="pw-rounded-lg pw-py-2 pw-px-4 pw-mt-6 pw-border pw-border-amber-600 pw-bg-red-500/[.08]">
      {fileRejections.map(({ file, errors }) => {
        const { path, size }: CustomFile = file;
        return (
          <div key={path} className="pw-my-2">
            <p className="pw-text-base pw-font-bold pw-whitespace-nowrap">
              {path} - {numberFormat.format(Math.round(size / 1000))} KB
            </p>

            {errors.map((error) => (
              <p key={error.code} className="pw-text-sm pw-mt-1">
                -{' '}
                {error.code === 'file-invalid-type'
                  ? `${t('error.accept_file')} ${accept?.image?.join(', ')}`
                  : error.message}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
