import pygame
from settings import *
from ship import Ship
from bullet import Bullet
from asteroid import Asteroid

class Game:
    def __init__(self):
        self.score = 0
        self.game_over = False
        
        # Sprite groups
        self.all_sprites = pygame.sprite.Group()
        self.asteroids = pygame.sprite.Group()
        self.bullets = pygame.sprite.Group()
        
        # Create ship
        self.ship = Ship()
        self.all_sprites.add(self.ship)
        
        # Spawn timer
        self.spawn_timer = 0
        
        # Font for score and game over text
        self.font = pygame.font.SysFont('arial', 30)
        self.large_font = pygame.font.SysFont('arial', 60)

    def process_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and not self.game_over:
                    self.shoot()
                if event.key == pygame.K_r and self.game_over:
                    self.reset_game()
        return True

    def shoot(self):
        bullet = Bullet(self.ship.rect.centerx, self.ship.rect.top)
        self.all_sprites.add(bullet)
        self.bullets.add(bullet)

    def reset_game(self):
        self.score = 0
        self.game_over = False
        self.all_sprites.empty()
        self.asteroids.empty()
        self.bullets.empty()
        
        self.ship = Ship()
        self.all_sprites.add(self.ship)

    def run_logic(self):
        if not self.game_over:
            self.all_sprites.update()
            
            # Spawn asteroids
            self.spawn_timer += 1
            if self.spawn_timer >= ASTEROID_SPAWN_RATE:
                asteroid = Asteroid()
                self.all_sprites.add(asteroid)
                self.asteroids.add(asteroid)
                self.spawn_timer = 0
                
            # Check collisions between bullets and asteroids
            hits = pygame.sprite.groupcollide(self.asteroids, self.bullets, True, True)
            for hit in hits:
                self.score += 10
                
            # Check collisions between ship and asteroids
            hits = pygame.sprite.spritecollide(self.ship, self.asteroids, False)
            if hits:
                self.game_over = True
                
            # Check if any asteroid reached the bottom
            for asteroid in self.asteroids:
                if asteroid.rect.top > HEIGHT:
                    self.game_over = True

    def display_frame(self, screen):
        screen.fill(BLACK)
        
        if not self.game_over:
            self.all_sprites.draw(screen)
            
            # Draw score
            score_text = self.font.render(f"Score: {self.score}", True, WHITE)
            screen.blit(score_text, (10, 10))
        else:
            # Game Over screen
            game_over_text = self.large_font.render("GAME OVER", True, RED)
            score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
            restart_text = self.font.render("Press R to Restart", True, WHITE)
            
            screen.blit(game_over_text, (WIDTH//2 - game_over_text.get_width()//2, HEIGHT//3))
            screen.blit(score_text, (WIDTH//2 - score_text.get_width()//2, HEIGHT//2))
            screen.blit(restart_text, (WIDTH//2 - restart_text.get_width()//2, HEIGHT//2 + 50))
            
        pygame.display.flip()
