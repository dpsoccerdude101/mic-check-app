import { useRouter } from 'next/router';
import QrCodeDialog from 'src/components/qrcode/dialog';
import uiRoutes from 'src/constants/uiRoutes';

const Qr = () => {
    const router = useRouter();
    const { id } = router.query;
    return id ? (
        <QrCodeDialog
            contentIds={[...id.toString()]}
            open
            onClose={() => router.push(uiRoutes.Root)}
        />
    ) : (
        <></>
    );
};

export default Qr;
