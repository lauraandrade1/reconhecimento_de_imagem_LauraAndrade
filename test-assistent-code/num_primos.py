import math


def eh_primo(numero: int) -> bool:
    """
    Verifica se um número é primo usando o teste de primalidade básico.

    Esta função determina se um número inteiro é primo, ou seja, se ele é maior que 1
    e não possui divisores positivos além de 1 e ele mesmo. Utiliza uma abordagem
    eficiente verificando divisores apenas até a raiz quadrada do número.

    Args:
        numero (int): O número a ser verificado. Deve ser um inteiro não negativo.
                      Para números menores ou iguais a 1, retorna False.

    Returns:
        bool: True se o número for primo, False caso contrário.

    Note:
        - Para números pequenos (≤ 3), a verificação é direta.
        - Para números pares maiores que 2, retorna False imediatamente.
        - A complexidade é O(sqrt(n)), tornando-a eficiente para números grandes.

    Example:
        >>> eh_primo(2)
        True
        >>> eh_primo(4)
        False
        >>> eh_primo(17)
        True
    """
    if numero <= 1:  # Números ≤ 1 não são primos por definição
        return False
    if numero <= 3:  # 2 e 3 são primos
        return True
    if numero % 2 == 0:  # Números pares > 2 não são primos
        return False

    limite = int(math.isqrt(numero))  # Limite até raiz quadrada para eficiência
    for divisor in range(3, limite + 1, 2):  # Verifica apenas divisores ímpares
        if numero % divisor == 0:  # Se divisível por divisor ímpar, não é primo
            return False
    return True


if __name__ == "__main__":
    teste = [1, 2, 3, 4, 17, 18, 19, 20]
    for n in teste:
        print(f"{n} -> {'primo' if eh_primo(n) else 'não primo'}")
