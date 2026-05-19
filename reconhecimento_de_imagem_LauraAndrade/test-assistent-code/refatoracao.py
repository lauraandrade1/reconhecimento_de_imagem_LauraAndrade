def calcular_estatisticas(numeros: list[int]) -> tuple[float, float, int, int]:
    """
    Calcula estatísticas básicas de uma lista de números inteiros.

    Args:
        numeros (list[int]): Lista de números inteiros.

    Returns:
        tuple[float, float, int, int]: Tupla contendo (soma_total, media, maior_valor, menor_valor).
    """
    if not numeros:
        raise ValueError("A lista não pode estar vazia.")

    soma_total = sum(numeros)
    media = soma_total / len(numeros)
    maior_valor = max(numeros)
    menor_valor = min(numeros)

    return soma_total, media, maior_valor, menor_valor


if __name__ == "__main__":
    lista_numeros = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
    total, media, maior, menor = calcular_estatisticas(lista_numeros)

    print("Total:", total)
    print("Média:", media)
    print("Maior:", maior)
    print("Menor:", menor)