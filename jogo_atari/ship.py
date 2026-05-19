import pygame
from settings import *

class Ship(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # Create the ship image as a simple rectangle
        self.image = pygame.Surface((SHIP_WIDTH, SHIP_HEIGHT))
        self.image.fill(SHIP_COLOR)
        
        # Position the ship at the bottom center of the screen
        self.rect = self.image.get_rect()
        self.rect.centerx = WIDTH // 2
        self.rect.bottom = HEIGHT - 20
        
        self.speed = SHIP_SPEED

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]:
            self.rect.x += self.speed
            
        # Keep ship on the screen
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > WIDTH:
            self.rect.right = WIDTH
