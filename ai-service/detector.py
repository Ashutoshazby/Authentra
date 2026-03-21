import os
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline

MODEL_CONFIGS = [
    {
        "requested_name": "Hello-SimpleAI/chatgpt-detector-roberta",
        "fallback_name": "Hello-SimpleAI/chatgpt-detector-roberta",
        "positive_labels": {"chatgpt", "ai", "generated", "fake"},
        "fallback_positive_index": 1
    },
    {
        "requested_name": "openai-community/gpt2-output-detector",
        "fallback_name": "openai-community/roberta-large-openai-detector",
        "positive_labels": {"fake", "ai", "generated"},
        "fallback_positive_index": 0
    }
]

app = Flask(__name__)
CORS(app)

classifiers = []
for config in MODEL_CONFIGS:
    model_name = config["requested_name"]
    try:
        detector_pipeline = pipeline(
            "text-classification",
            model=model_name,
            tokenizer=model_name,
            truncation=True,
            max_length=512
        )
    except Exception:
        model_name = config["fallback_name"]
        detector_pipeline = pipeline(
            "text-classification",
            model=model_name,
            tokenizer=model_name,
            truncation=True,
            max_length=512
        )

    classifiers.append(
        {
            "config": {**config, "resolved_name": model_name},
            "pipeline": detector_pipeline
        }
    )


def split_into_sentences(text):
    chunks = [segment.strip() for segment in re.split(r"(?<=[.!?])\s+", text) if segment.strip()]
    return [chunk for chunk in chunks if len(chunk.split()) >= 10]


def normalize_probability(predictions, model_config):
    probabilities = {}
    for item in predictions:
        label = item.get("label", "").lower()
        probabilities[label] = float(item.get("score", 0))

    for label, score in probabilities.items():
        if any(keyword in label for keyword in model_config["positive_labels"]):
            return max(0.0, min(1.0, score))

    if "human" in probabilities:
        return max(0.0, min(1.0, 1 - probabilities["human"]))
    if "real" in probabilities:
        return max(0.0, min(1.0, 1 - probabilities["real"]))

    ordered = sorted(predictions, key=lambda item: item.get("score", 0), reverse=True)
    if not ordered:
        return 0.0

    fallback_index = model_config["fallback_positive_index"]
    for item in predictions:
        label = item.get("label", "")
        if label.lower() == f"label_{fallback_index}":
            return max(0.0, min(1.0, float(item.get("score", 0))))

    top_item = ordered[0]
    return max(0.0, min(1.0, float(top_item.get("score", 0))))


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "models": [item["config"]["resolved_name"] for item in classifiers]
        }
    )


@app.route("/detect", methods=["POST"])
def detect():
    payload = request.get_json(silent=True) or {}
    text = (payload.get("text") or "").strip()

    if not text:
        return jsonify({"error": "Text is required"}), 400

    sentences = split_into_sentences(text)
    if not sentences:
        sentences = [text[:1200]]

    per_model_scores = []
    for classifier in classifiers:
        predictions = classifier["pipeline"](sentences, top_k=None, batch_size=8)
        sentence_scores = [
            normalize_probability(sentence_prediction, classifier["config"])
            for sentence_prediction in predictions
        ]
        if sentence_scores:
            per_model_scores.append(sum(sentence_scores) / len(sentence_scores))

    ai_probability = sum(per_model_scores) / max(len(per_model_scores), 1)
    label = "AI" if ai_probability >= 0.5 else "Human"

    return jsonify(
        {
            "ai_probability": round(ai_probability, 4),
            "label": label
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
