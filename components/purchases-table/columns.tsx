"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export type PurchaseTableData = {
  id: number;
  itemId: string;
  sellerUsername: string;
  quantity: number;
  totalPaid: number;
  timestamp: string;
  title: string;
  image: string;
  status: string;
  txnDigest: string;
};

export const columns: ColumnDef<PurchaseTableData>[] = [
  {
    accessorKey: "id",
    header: "Purchase ID",
    cell: ({ row }) => {
      const rowInfo = row.original as PurchaseTableData;
      const id = rowInfo.id;

      return <div className="text-center">{id}</div>;
    },
  },
  {
    id: "item",
    header: () => <div className="text-center">Item</div>,
    cell: ({ row }) => {
      const rowInfo = row.original as PurchaseTableData;
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
    accessorKey: "sellerUsername",
    header: () => <div className="text-center">Seller</div>,
    cell: ({ row }) => {
      const rowInfo = row.original as PurchaseTableData;
      const sellerUsername = rowInfo.sellerUsername;

      return (
        <a href={`/seller/${sellerUsername}`} className="text-sm underline">
          {sellerUsername}
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
      const rowInfo = row.original as PurchaseTableData;
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
      const rowInfo = row.original as PurchaseTableData;
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
      const rowInfo = row.original as PurchaseTableData;
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
      const rowInfo = row.original as PurchaseTableData;
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
      const rowInfo = row.original;
      const sellerUsername = rowInfo.sellerUsername;
      const itemId = rowInfo.itemId;
      const txnDigest = rowInfo.txnDigest;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <a href={`/rate/${sellerUsername}/${itemId}`}>
              <DropdownMenuItem>Rate Item</DropdownMenuItem>
            </a>
            <DropdownMenuItem>Report Item</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Contact Seller</DropdownMenuItem>
            <a href={`/rate/${sellerUsername}`}>
              <DropdownMenuItem>Rate Seller</DropdownMenuItem>
            </a>
            <DropdownMenuItem>Report Seller</DropdownMenuItem>
            <DropdownMenuSeparator />
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
