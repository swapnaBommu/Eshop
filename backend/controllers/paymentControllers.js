import catchAsyncErrors from "../middlewares/catchAsyncError.js";
import Order from "../models/order.js";


import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session   =>  /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(
    async (req, res, next) => {
        const body = req?.body;

        const shippingInfo = body?.shippingInfo;

        const shipping_rate =   body?.itemsPrice >= 1000
            ? "shr_1PBDt4SJdvBR2ZydHfE7xMOH"
            : "shr_1PBDtUSJdvBR2ZydPIsfKIlO";
        
        const line_items = body?.orderItems?.map((item) => {
            return {
              price_data: {
                currency: "INR",
                product_data: {
                  name: item?.name,
                  images: [item?.image],
                  metadata: { productId: item?.product },
                },
                unit_amount: item?.price * 100,
              },
              tax_rates: ["txr_1PBE3QSJdvBR2ZydRI5cUluQ"],
              quantity: item?.quantity,
            };
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: `${process.env.FRONTEND_URL}/me/orders`,
            cancel_url: `${process.env.FRONTEND_URL}`,
            customer_email: req?.user?.email,
            client_reference_id: req?.user?._id?.toString(),
            mode: "payment",
            metadata: {...shippingInfo, itemPrice : body?.itemsPrice},
            shipping_options: [
                {
                shipping_rate,
                },
            ],
            line_items,
        });
        res.status(200).json({
            url:session.url,
        })
    }
)

