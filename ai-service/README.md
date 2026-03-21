---
title: Authentra AI Service
emoji: 🤖
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# Authentra AI Service

This Hugging Face Space runs the Flask AI-detection microservice used by Authentra.

The service exposes:

- `GET /health`
- `POST /detect`

It is intended to be deployed on Hugging Face Spaces using the included `Dockerfile`.
