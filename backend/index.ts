import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const server = Bun.serve({
    port: 3000,
    async fetch(request) {

        const url = new URL(request.url)

        if (url.pathname === "/health") {
            return Response.json({"message": "okay"}, {status: 200})
        }

        if (request.method === "POST" && url.pathname === "/api/session") {

            const body = (await request.json()) as {sdp: string}

            if (!body.sdp) {
                return Response.json({error: "SDP is required"}, {status: 404})
            }

            try {
                const result = await client.live.create({
                    session: {
                        model: "gpt-live-1",
                        instructions: "You are a helpful assistant.",
                        audio: {
                            output: {
                                voice: "marin"
                            }
                        }
                    },

                    transport: {
                        type: "webrtc",
                        sdp: body.sdp
                    }
                })

                return Response.json(result, {status: 201})
            } catch (error) {
                console.error(error)
                return Response.json({error: "Failed to create a new session"}, {status: 404})
            }
        }


        return Response.json({eroor: "Not found"}, {status: 404})
    }
})

console.log(`Server is up and running at http://localhost:${server.port}`)