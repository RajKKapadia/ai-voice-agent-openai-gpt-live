import WebSocket from "ws"
import OpenAI from "openai"
import { executeTool } from "../tools/execute-tool"

export type RuntimeContext = {
    sessionId: string
    customerId: string
}

export async function connectSideband(sessionId: string, runtimeContext: RuntimeContext) {
    const url = `wss://api.openai.com/v1/live/sessions/${sessionId}/attach`
    const sideband = new WebSocket(url, {
        headers: {
            authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
    })

    sideband.on("open", () => {
        console.log(`Sideband opened for ${sessionId}`)
    })

    sideband.on("error", (error) => {
        console.log(`Sideband error ${error}`)
    })

    sideband.on("close", (error) => {
        console.log(`Sideband closed for ${sessionId}`)
    })

    sideband.on("message", async (rawEvent) => {
        const responseEvent = JSON.parse(rawEvent.toString()) as OpenAI.Live.ResponseEvent

        await handleSidebandEvents(responseEvent, sideband, runtimeContext)
    })
}

async function handleSidebandEvents(responseEvent: OpenAI.Live.ResponseEvent, sideband: WebSocket, runtimeContext: RuntimeContext) {
    if (responseEvent.type === "response.event") {
        const event = responseEvent.event

        if (event.type === "response.output_item.done") {

            const item = event.item as OpenAI.Responses.ResponseOutputItem

            if (item.type === "function_call") {

                if (item.status === "completed") {

                    /**
                     * TODOs
                     * Call the actual tool
                     * Submit the response
                     */
                    const toolResult = await executeTool(item)

                    sendToolResult(sideband, responseEvent.event_id, item.call_id, JSON.stringify(toolResult))
                }
            }
        }
    }
}

function sendToolResult(sideband: WebSocket, eventId: string, callId: string, toolResult: string) {
    sideband.send(JSON.stringify({
        type: "response.item.create",
        event_id: eventId,
        item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify(toolResult)
        }
    }))

    sideband.send(JSON.stringify({
        type: "response.create"
    }))
}