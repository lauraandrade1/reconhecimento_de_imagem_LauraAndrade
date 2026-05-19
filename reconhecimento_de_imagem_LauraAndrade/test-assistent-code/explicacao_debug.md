# Depuração do código `debug.py`

Este documento descreve os erros encontrados em `debug.py` e como cada um foi corrigido.

## Erro 1: String do prompt não estava entre aspas
- Linha original: `item1 = float(input(Preço do item 1? ))`
- Problema: o prompt do `input()` não estava escrito entre aspas, gerando um `SyntaxError`.
- Correção: `item1 = float(input("Preço do item 1? "))`

## Erro 2: `desconto_cupom` era uma string
- Linha original: `desconto_cupom = (input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))`
- Problema: `input()` retorna texto, então `desconto_cupom` era uma string e não podia ser usado em cálculos numéricos.
- Correção: converter para `float` imediatamente.
  - `desconto_cupom = float(input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))`

## Erro 3: `print` de Item 2 não era f-string
- Linha original: `print(" Item 2:        R$ {total_item2:.2f}")`
- Problema: as chaves `{}` foram impressas literalmente, porque a string não era formatada.
- Correção: usar `f-string` para interpolar a variável.
  - `print(f" Item 2:        R$ {total_item2:.2f}")`

## Erro 4: bloco `if` sem indentação correta
- Linha original:
  ```python
  if desconto_cupom > 0: 
  print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")
  ```
- Problema: a linha de `print()` não estava indentada, causando `IndentationError`.
- Correção: identar a linha dentro do bloco `if`.
  - ```python
    if desconto_cupom > 0:
        print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")
    ```

## Resultado final
O código corrigido agora funciona corretamente e exibe:
- nome do cliente
- total de cada item
- subtotal
- imposto de 10%
- desconto (quando aplicável)
- total final

As correções foram aplicadas em `test-assistent-code/debug.py`.