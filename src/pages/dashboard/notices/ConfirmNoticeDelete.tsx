import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Tooltip from 'rc-tooltip';

interface ConfirmNoticeDeleteProps {
  onConfirm: () => void;
}

export function ConfirmNoticeDelete({ onConfirm }: ConfirmNoticeDeleteProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Tooltip placement="top" overlay={<p>Apagar</p>}>
          <Button>
            <Trash2 className="h-4 w-4" />
          </Button>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja apagar este edital?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita. O edital será excluído permanentemente e{' '}
            <strong>todas as conversas relacionadas a ele também serão apagadas.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-red-700 hover:bg-red-700/90" onClick={onConfirm}>
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
