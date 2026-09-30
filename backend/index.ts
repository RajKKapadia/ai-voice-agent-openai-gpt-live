import OpenAI from "openai"
import { connectSideband } from "./src/live/sideband";

import { getOrderTool } from "./src/tools/get-order"
import { getShipmentTool } from "./src/tools/get-shipment";
import { searchProductsTool } from "./src/tools/search-products";
import { getReturnStatusTool } from "./src/tools/get-return-status";
import { requestReturnTool } from "./src/tools/request-return";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        const url = new URL(request.url)

        if (url.pathname === "/health") {
            return Response.json({
                message: "Healthy"
            }, {
                status: 200
            })
        }

        if (request.method === "POST" && url.pathname === "/api/session") {
            const body = (await request.json()) as { sdp?: string, customerId: string }

            if (!body.sdp) {
                return Response.json({ error: "SDP is required" }, { status: 400 })
            }

            if (!body.customerId) {
                return Response.json({ error: "Customer ID is required" }, { status: 400 })
            }

            try {
                const result = await client.live.create({
                    session: {
                        model: "gpt-live-1",
                        instructions: "",
                        audio: {
                            output: {
                                voice: "marin"
                            }
                        },

                        delegation: {
                            type: "responses",
                            responses: {
                                model: "gpt-6-luna",
                                instructions: "You are a backend support agent. Use the available tools whenever the answer depends on data.",
                                tools: [getOrderTool, getShipmentTool, searchProductsTool, getReturnStatusTool, requestReturnTool],
                                tool_choice: "auto",
                                parallel_tool_calls: true
                            }
                        }
                    },
                    transport: {
                        type: "webrtc",
                        sdp: body.sdp
                    }
                })

                await connectSideband(result.session.id, { customerId: body.customerId, sessionId: result.session.id })

                return Response.json(result, { status: 201 })
            } catch (error) {

            }
        }

        return Response.json({ error: "Not found" }, { status: 404 })
    }
})

console.log(`Server is up and running at http://127.0.0.1:${server.port}`)