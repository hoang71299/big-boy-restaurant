import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import dishApiRequest from "@/apiRequests/dish";
import { AlertCircle } from "lucide-react";

export default async function DishPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;
  if (!dish)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <h1 className="text-xl font-semibold">Không tìm thấy món ăn</h1>
            <p className="text-sm text-muted-foreground">
              Món ăn bạn đang tìm không tồn tại hoặc đã bị xoá.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* LEFT - IMAGE */}
          <div className="relative rounded-xl overflow-hidden border">
            <Image
              src={dish.image}
              alt={dish.name}
              width={1080}
              height={1080}
              className="w-full h-full max-h-[520px] object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>

          {/* RIGHT - CONTENT */}
          <div className="flex flex-col space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold">{dish.name}</h1>

              <div className="flex items-center gap-3">
                <Badge className="text-base px-3 py-1">
                  {formatCurrency(dish.price)}
                </Badge>

                <span className="text-sm text-green-600 font-medium">
                  Còn hàng
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Mô tả món ăn</h3>
              <p className="text-muted-foreground leading-relaxed">
                {dish.description}
              </p>
            </div>

            <Separator />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
