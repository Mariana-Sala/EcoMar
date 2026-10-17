
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Falta configurar GEMINI_API_KEY en el archivo .env");
}

// Inicializar el cliente de Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(cors({
  origin: [
    "http://127.0.0.1:5501",
    "http://localhost:3000"
  ],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const instruccionesEcoMar = `
Eres el asistente virtual de EcoMar, un proyecto educativo
centrado principalmente en el ODS 14: Vida submarina, y el
ODS 13: Acción por el clima.

Tus temas principales son:
- Corales y ecosistemas marinos.
- Contaminación por plásticos.
- Pesca sostenible.
- Cambio climático y su relación con el océano.
- Planes de acción ambiental personales y comunitarios.

Responde siempre en español, con un tono amable, claro,
educativo y respetuoso.

Prioriza ejemplos relacionados con el Caribe colombiano
cuando sean pertinentes.

Ofrece recomendaciones prácticas y realistas.
Si el usuario solicita un plan de acción, ayúdalo a definir:
objetivo, actividades, recursos, plazos e indicadores de éxito.

No inventes cifras, fuentes ni hechos científicos.
Si no sabes algo o no tienes información suficiente, dilo con honestidad.
Si una consulta no está relacionada con el medioambiente,
responde brevemente y redirige la conversación a tus temas.
Distingue las recomendaciones generales de los hechos
verificados.

No afirmes que una acción ambiental garantiza resultados
que no se pueden asegurar.

Mantén las respuestas relacionadas con la educación
ambiental y los objetivos de EcoMar.

Responde con explicaciones completas y coherentes.
Para preguntas educativas, utiliza una extensión moderada,
generalmente entre 2 y 5 párrafos.
No termines una frase a medias ni cortes una explicación.
`;

// Ruta para recibir mensajes del chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Envía al menos un mensaje."
      });
    }

    // Limitamos el historial para controlar el consumo.
    const historial = messages.slice(-20);

    const historialValido = historial.every((mensaje) =>
      mensaje &&
      ["user", "model"].includes(mensaje.role) &&
      typeof mensaje.text === "string" &&
      mensaje.text.trim().length > 0 &&
      mensaje.text.length <= 4000
    );

    if (!historialValido || historial[historial.length - 1].role !== "user") {
      return res.status(400).json({
        error: "El historial contiene mensajes no válidos."
      });
    }

    // Preparar la conversación para Gemini
    const contenidos = historial.map((item) => ({
        role: item.role,
        parts: [{ text: item.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contenidos,
      config: {
        systemInstruction: instruccionesEcoMar,
        maxOutputTokens: 1500
      }
    });

    const respuesta = response.text;

    if (!respuesta) {
      throw new Error("Gemini no generó una respuesta de texto.");
    }

    console.log(
      "Motivo de finalización:",
      response.candidates?.[0]?.finishReason,
    );

    console.log("Longitud de respuesta:", response.text?.length);

    return res.json({ reply: respuesta});
    
  } catch (error) {
    console.error("Error en EcoMar:", error.messages);

    console.error("Detalles:", {
      name: error?.name,
      message: error?.message,
      status: error?.status,
      code: error?.code
    })

    if (error?.status === 503) {
      return res.status(503).json({
        error:
          "Náyade está recibiendo muchas consultas. Espera unos segundos e inténtalo nuevamente.",
      });
    }

    return res.status(500).json({
      error: "No pude generar una respuesta. Inténtalo nuevamente."
    });
  }
});

app.listen(PORT, () => {
  console.log(`EcoMar está disponible en http://localhost:${PORT}`);
});
