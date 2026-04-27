import math


def eh_primo(numero: int) -> bool:
    """Retorna True se numero for primo, caso contrário False."""
    if numero <= 1:
        return False
    if numero <= 3:
        return True
    if numero % 2 == 0:
        return False

    limite = int(math.isqrt(numero))
    for divisor in range(3, limite + 1, 2):
        if numero % divisor == 0:
            return False
    return True


if __name__ == "__main__":
    teste = [1, 2, 3, 4, 17, 18, 19, 20]
    for n in teste:
        print(f"{n} -> {'primo' if eh_primo(n) else 'não primo'}")
