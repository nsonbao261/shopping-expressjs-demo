import { PrismaClient } from "@prisma/client";
import moment from 'moment';
import crypto from 'crypto';
import * as qs from 'qs';


export class PaymentService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    sortObject = (obj: any) => {
        let sorted: any = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }


    createPaymentUrl = async (data: any) => {
        const { orderId, totalCost, ipAddr } = data;

        var params: any = {}
        params['vnp_Amount'] = totalCost * 100
        params['vnp_Command'] = 'pay'
        params['vnp_CreateDate'] = moment(new Date()).format('YYYYMMDDHHmmss')
        params['vnp_CurrCode'] = 'VND'
        params['vnp_IpAddr'] = ipAddr
        params['vnp_Locale'] = 'vn'
        params['vnp_OrderInfo'] = "VNPAY_PAYMENT_FROSCHBOARDGAME" + "_" + totalCost
        params['vnp_OrderType'] = 'other'
        params['vnp_ReturnUrl'] = 'http://localhost:3000/api/payment/callback',
            params['vnp_TxnRef'] = orderId + moment(new Date()).format('YYYYMMDDHHmmss')
        params['vnp_Version'] = '2.1.0'
        params['vnp_TmnCode'] = process.env.VNPAY_TERMINAL_CODE

        params = this.sortObject(params)

        const signData = qs.stringify(params, { encode: false })
        const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET as string)
        const sign = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
        params['vnp_SecureHash'] = sign;

        return process.env.VNPAY_PAYMENT_URL + '?' + qs.stringify(params, { encode: false })
    }

    checkVnpayCallback = async (data: any) => {
        const secretKey = process.env.VNPAY_HASH_SECRET as string;

        const { vnp_Params, secureHash } = data;
        const params = this.sortObject(vnp_Params);

        const singnedData = qs.stringify(params, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(singnedData, 'utf-8')).digest('hex');

        return signed == secureHash;
    }
}