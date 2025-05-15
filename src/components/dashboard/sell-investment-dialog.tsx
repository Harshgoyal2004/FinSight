
"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MinusCircle } from 'lucide-react'; // Or other appropriate icon like 'DollarSign' or 'TrendingDown'
import type { Investment } from '@/types';

interface SellInvestmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSellShares: (investmentId: string, shares: number) => void;
  investment: Investment | null;
}

export function SellInvestmentDialog({ isOpen, onClose, onSellShares, investment }: SellInvestmentDialogProps) {
  const sellSchema = z.object({
    shares: z.coerce.number()
      .positive("Shares must be positive")
      .max(investment?.shares ?? 0, `Cannot sell more than ${investment?.shares.toFixed(2) ?? 0} owned shares`),
  });
  type SellFormData = z.infer<typeof sellSchema>;

  const form = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      shares: 0,
    },
  });

  React.useEffect(() => {
    if (isOpen) { // Reset form when dialog opens
      form.reset({ shares: 0 });
    }
  }, [isOpen, form]);

  const onSubmit = (data: SellFormData) => {
    if (investment) {
      onSellShares(investment.id, data.shares);
    }
    form.reset();
    onClose();
  };

  if (!investment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MinusCircle className="mr-2 h-5 w-5 text-destructive" /> Sell Shares
          </DialogTitle>
          <DialogDescription>
            Sell shares of {investment.name} ({investment.symbol}).
            You currently own {investment.shares.toFixed(2)} shares. Current price: ${investment.currentPrice.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Shares to Sell</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                <MinusCircle className="mr-2 h-4 w-4" />
                Sell Shares
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
