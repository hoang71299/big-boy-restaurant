"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useDishListMutation } from "@/app/queries/useDish";
import { formatCurrency } from "@/lib/utils";
import Quantity from "@/app/guest/menu/quantity";
import { useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";

export default function MenuOrder() {
  const { data } = useDishListMutation();
  const dishes = useMemo(() => data?.payload.data ?? [], [data]);
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const totalPrice = useMemo(() => {
    return dishes.reduce((total, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return total;
      return total + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);
  const handleChangeValue = (quantity: number, dishId: number) => {
    setOrders((prevOrder) => {
      if (quantity === 0) {
        return prevOrder.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrder.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrder, { dishId, quantity }];
      }
      const newOrders = [...prevOrder];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  return (
    <>
      {dishes.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{dish.name}</h3>
            <p className="text-xs">{dish.description}</p>
            <p className="text-xs font-semibold">
              {formatCurrency(dish.price)} đ
            </p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Quantity
              value={
                orders.find((order) => order.dishId === dish.id)?.quantity || 0
              }
              onChange={(value) => handleChangeValue(value, dish.id)}
            />
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)} đ</span>
        </Button>
      </div>
    </>
  );
}
