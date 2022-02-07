import { CircularProgress } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { ApiRoutes } from 'src/constants';
import { BaseResponse, IdRequest } from 'src/types';
import { Api } from 'src/utils';
import ImageDownload from '../imageDownload';

type QRCodeProps = {
    title?: string;
    fileId?: string;
    apiGenerationRoute?: string;
    contentId?: string;
    imgProps?: any;
};

const QrCode = ({
    title,
    fileId,
    apiGenerationRoute,
    contentId,
    imgProps,
}: QRCodeProps) => {
    const [qrCodeSrc, setQRCode] = useState(null);

    useEffect(() => {
        const loadQRCode = async () => {
            const cannotGenerate = !contentId || !apiGenerationRoute;
            if (!fileId && cannotGenerate) {
                console.error('Cannot show QR');
                return;
            }
            let fId = fileId;
            if (!fileId) {
                const request: IdRequest = { id: contentId };
                const response: BaseResponse<string> = await Api.post(
                    apiGenerationRoute,
                    request
                );
                const { data, success } = response;
                console.log('QR code generation response', response);
                if (success) {
                    fId = data;
                }
            }
            const source = ApiRoutes.Files.GetFile(fId);
            setQRCode(source);
        };
        loadQRCode();
    }, [fileId, contentId]);

    const renderQRCode = () => {
        if (!qrCodeSrc) {
            return <CircularProgress />;
        }
        return (
            <ImageDownload
                imgSrc={qrCodeSrc}
                title={title}
                downloadUrl={qrCodeSrc}
                {...imgProps}
            />
        );
    };

    return <>{renderQRCode()}</>;
};

export default QrCode;
