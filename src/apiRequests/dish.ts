import http from "@/lib/http";
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from "@/schemaValidations/dish.schema";
import { number } from "zod";

const prefix = "/dishes"

const dishApiRequest = {
  list: () => http.get<DishListResType>(`${prefix}`),
  getDish: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  addDish: (body: CreateDishBodyType) => http.post<DishResType>(`${prefix}`, body),
  updateDish: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`${prefix}/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`${prefix}/${id}`)
}
export default dishApiRequest

