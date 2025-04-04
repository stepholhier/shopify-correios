const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN_CORREIOS = process.env.CORREIOS_TOKEN;
const CEP_ORIGEM = "80250-070"; // Substitua pelo seu

// Rota de teste
app.get("/status", (req, res) => {
  res.json({ status: "API Correios rodando 🚀", token: !!TOKEN_CORREIOS });
});

// Rota de cálculo de frete
app.post("/calcular-frete", async (req, res) => {
  const { cepDestino, peso, altura, largura, comprimento } = req.body;

  if (!cepDestino) return res.status(400).json({ error: "CEP destino obrigatório" });

  try {
    const response = await fetch("https://api.correios.com.br/v1/frete/calcular", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN_CORREIOS}`
      },
      body: JSON.stringify({
        cepOrigem: CEP_ORIGEM,
        cepDestino: cepDestino,
        peso: peso || 1,
        formato: 1, // caixa/pacote
        comprimento: comprimento || 16,
        altura: altura || 2, 
        largura: largura || 11,
        servicos: ["04510", "04014"] // Exemplo: PAC e SEDEX
      })
    });

    const data = await response.json();
    console.log("📦 Resposta Correios:", data);
    res.json(data);

  } catch (error) {
    console.error("❌ Erro ao calcular frete:", error);
    res.status(500).json({ error: "Erro ao calcular frete com Correios" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor Correios na porta ${PORT}`));
