import pygame
import random
from settings import *

class Asteroid(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        size = random.randint(ASTEROID_MIN_SIZE, ASTEROID_MAX_SIZE)
        self.image = pygame.Surface((size, size))
        self.image.fill(ASTEROID_COLOR)
        
        self.rect = self.image.get_rect()
        
        # Spawn at random position at the top
        self.rect.x = random.randint(0, WIDTH - size)
        self.rect.y = random.randint(-100, -40)
        
        self.speed_y = random.randint(ASTEROID_SPEED_MIN, ASTEROID_SPEED_MAX)

    def update(self):
        self.rect.y += self.speed_y
