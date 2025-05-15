
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
import { ShoppingCart } from 'lucide-react';
import type { Investment } from '@/types';

const buySchema = z.object({
  shares: z.coerce.number().positive("Shares must be positive"),
  price: z.coerce.number().positive("Price must be positive"),
});

type BuyFormData = z.infer<typeof buySchema>;

interface BuyInvestmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyShares: (investmentId: string, shares: number, price: number) => void;
  investment: Investment | null;
}

export function BuyInvestmentDialog({ isOpen, onClose, onBuyShares, investment }: BuyInvestmentDialogProps) {
  const form = useForm<BuyFormData>({
    resolver: zodResolver(buySchema),
    defaultValues: {
      shares: 0,
      price: 0,
    },
  });

  React.useEffect(() => {
    if (investment) {
      form.reset({ shares: 0, price: investment.currentPrice > 0 ? investment.currentPrice : 0 });
    }
  }, [investment, form, isOpen]);

  const onSubmit = (data: BuyFormData) => {
    if (investment) {
      onBuyShares(investment.id, data.shares, data.price);
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
            <ShoppingCart className="mr-2 h-5 w-5 text-primary" /> Buy More Shares
          </DialogTitle>
          <DialogDescription>
            Buy additional shares of {investment.name} ({investment.symbol}).
            Current shares: {investment.shares.toFixed(2)}. Current price: ${investment.currentPrice.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Shares to Buy</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Share ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 175.50" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Shares
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

