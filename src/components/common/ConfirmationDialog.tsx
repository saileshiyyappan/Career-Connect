import React from 'react';
import { Modal } from '../modals/Modal';
import { PrimaryButton } from './PrimaryButton';
import { OutlineButton } from './OutlineButton';
import { AlertCircle } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-3 mb-6">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${isDanger ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}`}>
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <OutlineButton size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </OutlineButton>
        <PrimaryButton
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
          className={isDanger ? 'bg-rose-600 hover:bg-rose-700 text-white' : ''}
        >
          {confirmText}
        </PrimaryButton>
      </div>
    </Modal>
  );
};
