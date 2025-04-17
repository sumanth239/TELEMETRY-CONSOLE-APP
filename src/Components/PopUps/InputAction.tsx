// utils/modalAction.ts
import Swal, { SweetAlertOptions } from 'sweetalert2';

interface InputModalOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  icon?: SweetAlertOptions['icon'];
  inputType?: 'text' | 'email' | 'password'; // Input type (optional)
  inputPlaceholder?: string; // Placeholder for input (optional)
  onConfirm: (inputValue?: string) => void | Promise<void>; // Callback with input value
}

export const inputModalAction = async ({
  title = 'Are you sure?',
  text = '',
  confirmButtonText = 'Yes',
  cancelButtonText = 'Cancel',
  confirmButtonColor = '#d33',
  cancelButtonColor = '#3085d6',
  icon = 'warning',
  inputType = 'text', // Default to 'text' input if not provided
  inputPlaceholder = '',
  onConfirm,
}: InputModalOptions): Promise<void> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
    input: inputType ? 'text' : undefined, // Display input field if inputType is defined
    inputPlaceholder,
  });

  if (result.isConfirmed) {
    // If input is provided, pass it to the onConfirm callback
    await onConfirm(result.value);
  }
};
