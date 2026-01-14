"use client";

import { useGuestGetOrderListMutation } from "@/app/queries/useGuest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderListMutation();
  const orders = useMemo(() => {
    return data?.payload.data ?? [];
  }, [data]);

  const totalPrice = useMemo(() => {
    return orders.reduce((total, order) => {
      return total + order.quantity * order.dishSnapshot.price;
    }, 0);
  }, [orders]);
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }
    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
      } = data;
      toast({
        description: `Món ${name} (Sl : ${
          data.quantity
        }) vừa được cập nhập sang trang thái ${getVietnameseOrderStatus(
          data.status
        )}`,
      });
      refetch();
    }

    socket.on("update-order", onUpdateOrder);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="flex-shrink-0 text-sm font-bold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} đ *{" "}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant="secondary">
              {" "}
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <div className="w-full flex space-x-4 justify-between text-xl font-bold">
          <span>Tổng cộng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)} đ</span>
        </div>
      </div>
    </>
  );
}
