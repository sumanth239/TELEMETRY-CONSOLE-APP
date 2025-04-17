// utils/confirmAction.ts
import Swal, { SweetAlertOptions } from 'sweetalert2';

interface ConfirmOptions {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    icon?: SweetAlertOptions['icon'];
    onConfirm: () => void | Promise<void>;
}

export const confirmAction = async ({
    title = 'Are you sure?',
    text = '',
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel',
    confirmButtonColor = '#d33',
    cancelButtonColor = '#3085d6',
    icon = 'warning',
    onConfirm,
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
    });

    if (result.isConfirmed) {
        await onConfirm();
    }
};
