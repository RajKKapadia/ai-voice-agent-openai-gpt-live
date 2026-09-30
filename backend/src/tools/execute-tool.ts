import type { OpenAI } from "openai";
import { getOrder } from "./get-order";
import { getShipment } from "./get-shipment";
import { getReturnStatus } from "./get-return-status";
import { requestReturn } from "./request-return";
import { searchProducts } from "./search-products";

export async function executeTool(item: OpenAI.Responses.ResponseFunctionToolCall) {

    switch (item.name) {
        case "get_order": {
            const args = JSON.parse(item.arguments) as { orderId: string }
            const toolResult = getOrder(args.orderId)
            return toolResult
        }

        case "get_shipment": {
            const args = JSON.parse(item.arguments) as { orderId: string }
            const toolResult = getShipment(args.orderId)
            return toolResult
        }

        case "get_return_status": {
            const args = JSON.parse(item.arguments) as { orderId: string }
            const toolResult = getReturnStatus(args.orderId)
            return toolResult
        }

        case "request_return": {
            const args = JSON.parse(item.arguments) as { orderId: string, reason: string }
            const toolResult = requestReturn(args.orderId, args.reason)
            return toolResult
        }

        case "search_products": {
            const args = JSON.parse(item.arguments) as { query: string, inStockOnly: boolean }
            const toolResult = searchProducts(args.query, args.inStockOnly)
            return toolResult
        }

        default: {
            return {
                error: `Unknown tool: ${item.name}`
            }
        }
    }
}