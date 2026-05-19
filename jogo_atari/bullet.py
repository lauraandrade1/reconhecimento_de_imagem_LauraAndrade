import pygame
from settings import *

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((BULLET_WIDTH, BULLET_HEIGHT))
        self.image.fill(BULLET_COLOR)
        self.rect = self.image.get_rect()
        
        # Initial position
        self.rect.centerx = x
        self.rect.bottom = y
        
        self.speed_y = BULLET_SPEED

    def update(self):
        self.rect.y += self.speed_y
        # Destroy the bullet if it goes off the top of the screen
        if self.rect.bottom < 0:
            self.kill()
