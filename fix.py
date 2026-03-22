with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "return (data.completion || data.choices?.[0]?.message?.content || '').trim() || 'Пока нет ответа.';",
    "return (data.content?.[0]?.text || '').trim() || 'Пока нет ответа.';"
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Done')