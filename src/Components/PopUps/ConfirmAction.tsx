// library imports
import Swal, { SweetAlertOptions } from 'sweetalert2';

interface ConfirmOptions {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    allowOutsideClick?: boolean,
    icon?: SweetAlertOptions['icon'];
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void | Promise<void>; 
}

export const confirmAction = async ({           //confrimation pop up 
    title = 'Are you sure?',
    text = '',
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel',
    confirmButtonColor = '#d33',
    cancelButtonColor = '#3085d6',
    icon = 'warning',
    onConfirm,
    onCancel,
    allowOutsideClick,
}: ConfirmOptions): Promise<void> => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor,
        cancelButtonColor,
        allowOutsideClick,
    });

    if (result.isConfirmed) {
        await onConfirm();
    } else if (result.dismiss === Swal.DismissReason.cancel && onCancel) {
        await onCancel();
    }
};
