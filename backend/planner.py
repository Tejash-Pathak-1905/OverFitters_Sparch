import re


def plan(command, flights):
    words = command.strip().lower()
    ordinal = re.search(r"\b(first|second|third|[123])\b", words)
    index = {"first": 0, "second": 1, "third": 2, "1": 0, "2": 1, "3": 2}
    if re.search(r"\b(buy|book|checkout)\b", words):
        return {"intent": "checkout", "index": index[ordinal.group()] if ordinal else None}
    if re.search(r"\b(compare|cheapest|sort)\b", words):
        ranked = sorted(range(len(flights)), key=lambda position: flights[position].price)
        return {"intent": "compare", "order": ranked[:3]}
    if re.search(r"\b(where|resume|recap)\b", words):
        return {"intent": "recap"}
    if re.search(r"\b(read|summarize|summary)\b", words):
        return {"intent": "summary"}
    return {"intent": "unknown"}
