# Explicação do código `num_primos.py`

A seguir, cada linha do código Python é explicada.

1. `import math`
   - Importa o módulo `math`, que fornece funções matemáticas.

2. `

3. `def eh_primo(numero: int) -> bool:`
   - Declara a função `eh_primo`, que recebe `numero` como inteiro e retorna `True` ou `False`.

4. `    """Retorna True se numero for primo, caso contrário False."""`
   - Comentário de documentação (docstring) que descreve o propósito da função.

5. `    if numero <= 1:`
   - Verifica se o número é menor ou igual a 1.

6. `        return False`
   - Retorna `False`, porque 1 e números menores não são primos.

7. `    if numero <= 3:`
   - Verifica se o número é 2 ou 3.

8. `        return True`
   - Retorna `True` para 2 e 3, que são primos.

9. `    if numero % 2 == 0:`
   - Verifica se o número é par.

10. `        return False`
    - Retorna `False` porque números pares maiores que 2 não são primos.

11. `    limite = int(math.isqrt(numero))`
    - Calcula a raiz quadrada inteira do número para limitar os testes de divisão.

12. `    for divisor in range(3, limite + 1, 2):`
    - Percorre apenas divisores ímpares, desde 3 até `limite`, evitando pares.

13. `        if numero % divisor == 0:`
    - Verifica se `divisor` divide `numero` sem deixar resto.

14. `            return False`
    - Retorna `False` se encontrar um divisor, pois o número não é primo.

15. `    return True`
    - Se nenhum divisor for encontrado, o número é primo e retorna `True`.

16. `if __name__ == "__main__":`
    - Bloco que só executa quando o arquivo é executado diretamente.

17. `    teste = [1, 2, 3, 4, 17, 18, 19, 20]`
    - Lista de números usados para testar a função.

18. `    for n in teste:`
    - Inicia um laço que percorre cada número da lista de teste.

19. `        print(f"{n} -> {'primo' if eh_primo(n) else 'não primo'}")`
    - Imprime o número e o resultado da verificação, mostrando se é primo ou não.
