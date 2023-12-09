import { builder } from "./builder"
import "./types/product"
import "./types/product_image"
import "./types/category"
import "./types/users"
import "./types/orderDetails"
import "./types/userAddress"
import "./types/userPayment"
import "./types/orderItems"

export const schema = builder.toSchema()

