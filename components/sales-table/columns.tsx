"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { updatePurchaseStatus } from "@/db/utils";
import Image from "next/image";

export type SaleTableData = {
  id: number;
  itemId: string;
  buyerUsername: string;
  sellerUsername: string;
  quantity: number;
  totalPaid: number;
  timestamp: string;
  title: string;
  image: string;
  status: string;
  txnDigest: string;
  buyerShippingAddress: string;
};

export const columns: ColumnDef<SaleTableData>[] = [
  {
    accessorKey: "id",
    header: "Purchase ID",
    cell: ({ row }) => {
      const rowInfo = row.original as SaleTableData;
      const id = rowInfo.id;

      return <div className="text-center">{id}</div>;
    },
  },
  {
    id: "item",
    header: () => <div className="text-center">Item</div>,
    cell: ({ row }) => {
      const rowInfo = row.original as SaleTableData;
      const itemId = rowInfo.itemId;
      const itemName = rowInfo.title;
      const itemImage = rowInfo.image;
      const sellerUsername = rowInfo.sellerUsername;

      return (
        <a
          href={`/item/${sellerUsername}/${itemId}`}
          className="flex flex-row items-center gap-2"
        >
          <Image src={itemImage} alt="" width={100} height={100} className="w-12 h-12 rounded-xl" />
          <span className="text-sm underline">{itemName}</span>
        </a>
      );
    },
  },
  {
    accessorKey: "buyerUsername",
    header: () => <div className="text-center">Buyer</div>,
    cell: ({ row }) => {
      const rowInfo = row.original as SaleTableData;
      const buyerUsername = rowInfo.buyerUsername;

      return (
        <a href={`/seller/${buyerUsername}`} className="text-sm underline">
          {buyerUsername}
        </a>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowInfo = row.original as SaleTableData;
      const quantity = rowInfo.quantity;

      return <div className="text-center">{quantity}</div>;
    },
  },
  {
    accessorKey: "totalPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowInfo = row.original as SaleTableData;
      const totalPaid = rowInfo.totalPaid;

      return <div className="text-center">${totalPaid.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowInfo = row.original as SaleTableData;
      const timestampSql = rowInfo.timestamp;
      const t = timestampSql.split(/[- :]/);
      const timestamp = new Date(
        Date.UTC(+t[0], +t[1] - 1, +t[2], +t[3], +t[4], +t[5])
      );

      return <div className="text-center">{timestamp.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const rowInfo = row.original as SaleTableData;
      const status = rowInfo.status;

      if (status == "delivered") {
        return <div className="text-center text-green-500">Delivered</div>;
      } else if (status == "pending") {
        return <div className="text-center text-yellow-500">Pending</div>;
      } else {
        return <div className="text-center text-orange-500">Shipped</div>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const rowInfo = row.original;
      const txnDigest = rowInfo.txnDigest;
      const buyerShippingAddress = rowInfo.buyerShippingAddress;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Change Status to:</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={async () => {
                await updatePurchaseStatus(id, "delivered");
                window.location.reload();
              }}
            >
              Delivered
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await updatePurchaseStatus(id, "shipped");
                window.location.reload();
              }}
            >
              Shipped
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await updatePurchaseStatus(id, "pending");
                window.location.reload();
              }}
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(buyerShippingAddress);
              }}
            >
              {buyerShippingAddress == "" ? (
                <span className="text-red-500">Missing Shipping Address</span>
              ) : (
                <span>Copy Shipping Address</span>
              )}
            </DropdownMenuItem>
            <a
              href={`https://suiexplorer.com/txblock/${txnDigest}?network=devnet`}
              target="_blank"
            >
              <DropdownMenuItem>View Transaction</DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
