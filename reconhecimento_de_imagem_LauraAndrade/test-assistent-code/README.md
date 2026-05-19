# Test Assistant Code

Este projeto contém uma coleção de scripts Python simples para fins de aprendizado e teste de conceitos básicos de programação. Inclui exemplos de verificação de números primos, cálculo de carrinho de compras com impostos e descontos, e cálculo de estatísticas básicas de listas de números. Cada script vem acompanhado de explicações detalhadas e exemplos de depuração.

## Descrição

O projeto é dividido em três principais componentes:

1. **Verificação de Números Primos** (`num_primos.py`): Função que verifica se um número é primo usando um algoritmo eficiente.
2. **Calculadora de Carrinho de Compras** (`debug.py`): Script que calcula o total de uma compra com itens, impostos e descontos.
3. **Cálculo de Estatísticas** (`refatoracao.py`): Função refatorada para calcular soma, média, maior e menor valor de uma lista de números.

Cada arquivo de código possui um arquivo de explicação correspondente (`.md`) que detalha o funcionamento linha por linha.

## Requisitos

- Python 3.6 ou superior
- Nenhum pacote adicional é necessário (usa apenas a biblioteca padrão `math`)

## Instalação

1. Clone ou baixe este repositório.
2. Navegue até a pasta `test-assistent-code`.
3. Execute os scripts diretamente com Python.

## Uso

### Verificação de Números Primos

Execute o script `num_primos.py` para testar a função `eh_primo`:

```bash
python num_primos.py
```

Isso executará testes com uma lista de números e imprimirá se cada um é primo ou não.

Para usar a função em outro código:

```python
from num_primos import eh_primo

print(eh_primo(17))  # True
print(eh_primo(18))  # False
```

### Calculadora de Carrinho de Compras

Execute o script `debug.py`:

```bash
python debug.py
```

O script solicitará entrada interativa:
- Nome do cliente
- Quantidade e preço de 3 itens
- Percentual de desconto (ou 0)

Em seguida, exibirá um recibo formatado com subtotal, imposto (10%), desconto e total.

### Cálculo de Estatísticas

Execute o script `refatoracao.py`:

```bash
python refatoracao.py
```

Isso calculará e imprimirá as estatísticas de uma lista de exemplo.

Para usar a função:

```python
from refatoracao import calcular_estatisticas

numeros = [1, 2, 3, 4, 5]
total, media, maior, menor = calcular_estatisticas(numeros)
print(f"Soma: {total}, Média: {media}, Maior: {maior}, Menor: {menor}")
```

## Estrutura dos Arquivos

- `num_primos.py`: Implementação da função para verificar números primos.
- `explicacao_num_primo.md`: Explicação detalhada linha por linha do código `num_primos.py`.
- `debug.py`: Script para cálculo de carrinho de compras.
- `explicacao_debug.md`: Documento descrevendo os erros encontrados e correções aplicadas em `debug.py`.
- `refatoracao.py`: Função refatorada para cálculo de estatísticas.
- `explicacao_refatoracao.md`: Explicação do código `refatoracao.py` (versão original não refatorada).

## Exemplos

### Exemplo de `num_primos.py`

```
1 -> não primo
2 -> primo
3 -> primo
4 -> não primo
17 -> primo
18 -> não primo
19 -> primo
20 -> não primo
```

### Exemplo de `debug.py`

```
===============================
 Cliente: João
===============================
 Item 1:        R$ 10.00
 Item 2:        R$ 20.00
 Item 3:        R$ 15.00
-------------------------------
 Subtotal:      R$ 45.00
 Imposto (10%): R$ 4.50
 Desconto (5%): -R$ 2.25
===============================
 TOTAL:         R$ 47.25
===============================
```

### Exemplo de `refatoracao.py`

```
Total: 248
Média: 24.8
Maior: 89
Menor: 2
```

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções ou novos exemplos. Abra uma issue ou envie um pull request.

## Licença

Este projeto é de domínio público. Use e modifique como desejar.