'use client';
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
} from '@/components/feat-1/ui/alert-dialog';
import { Badge } from '@/components/feat-1/ui/badge';
import { Card } from '@/components/feat-1/ui/card';
import { Trash2 } from 'lucide-react';
import { FC } from 'react';
import UpdateAddress from './UpdateAddress';

interface Address {
  id: number;
  addressLine?: string;
  isPrimary?: string | null;
refetch: () => void;
}

const CardAddress: FC<Address> = ({ addressLine, isPrimary, id, refetch }) => {
  const { deleteUserAddress } = useDeleteUserAddress(id);

  const handleDelete = async () => {
    try {
      await deleteUserAddress();
      refetch();
    } catch (error) {
      console.error('Failed to delete address', error);
    }
  };
  return (
    <Card className=" p-4 shadow-lg flex flex-col gap-4 ">
      <div className=" flex flex-col gap-2">
        <p className="text-sm">{addressLine}</p>
      </div>
      <Badge variant="outline" className=" w-fit">
        {isPrimary}
      </Badge>
      <div className="grid grid-cols-8 gap-2">
        <UpdateAddress addressId={id} />
        <AlertDialog>
          <AlertDialogTrigger
            className="rounded-xl bg-white text-black
     border hover:ring-mythemes-maingreen  hover:ring hover:bg-mythemes-grey"
          >
            <Trash2 className="mx-auto text-red-500" size={20} />
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[382px] rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this address? Once it iss gone,
                there is no getting it back.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default CardAddress;